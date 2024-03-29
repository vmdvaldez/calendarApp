const cors = require('cors');

const express = require('express');
const app = express()


const pool = require('./pgdb');

app.use(cors());
app.use(express.json()) 

// TODO: input validation to prevent SQL injections
// TODO: push activity and category together via transcation -- will need to push activity and category relations as well

app.use('/activity', (req,res, next)=>{
    for (const key in req.body){
        if(typeof req.body[key] === 'string') req.body[key] = req.body[key].trim();
        else if(Array.isArray(req.body[key])) req.body[key] = req.body[key].map(elem=>{ 
            if(typeof elem === 'string') return elem.trim();
        })
    }
    next();
});
app.route('/activity')
    .get(async (req,res)=>{
        console.log("GET ACTIVITY");
        const q = await pool.query(`
            SELECT activity.uid, activity.name, 
                to_char(activity.date_created, 'Month DD, YYYY') AS date_created,
                ARRAY_REMOVE(ARRAY_AGG(cat.name), NULL) AS categories
            FROM activity
            LEFT JOIN activity_category AS ac ON ac.activity_id = activity.uid
            LEFT JOIN category AS cat ON ac.category_id = cat.uid
            GROUP BY activity.uid
            ORDER BY activity.date_created DESC
        `);
        res.send(q.rows);
        })
    .post(async(req,res)=>{
        console.log("POST TO setactivity");
        const {activity, categories} = req.body;
    
        let ctg = categories.filter(c => c.length > 0)
        ctg = [... new Set(ctg)];
        let ret = "";
    
        await pool.query('BEGIN')
        try{
            const aQueryRet = await pool.query(`
                INSERT INTO activity (name) VALUES ('${activity}') 
                RETURNING uid, to_char(date_created, 'Month DD, YYYY') AS date_created`);
            
            if (ctg.length){
                const cQueryRet = await pool.query(`
                    WITH ins AS (
                    INSERT INTO category (name) VALUES ${ctg.map(c=>`('${c}')`)} 
                    ON CONFLICT (name) DO NOTHING 
                    RETURNING uid)
                    
                    SELECT * FROM ins UNION
                    SELECT uid FROM category WHERE name IN (${ctg.map(c=>`'${c}'`)})
                    `);
                
                    await pool.query(`
                    INSERT INTO activity_category (activity_id, category_id)
                    VALUES ${cQueryRet.rows.map(c=>`('${aQueryRet.rows[0].uid}', '${c.uid}')`)}
                    `)
            }
    
    
            ret = await pool.query('COMMIT');
            res.status(201).send({
                status: 201,
                message: `Successfully Created Activity ${activity} with category: ${ctg.map(c=>` ${c}`)}`,
                activityInfo: {id: aQueryRet.rows[0].uid, date_created: aQueryRet.rows[0].date_created}
            });
        }
        catch(e){
            ret = await pool.query('ROLLBACK');
            console.log(e)
    
            res.status(409).send({status: 409, message: "Error: Activity already exists"});
        }
    })

app.route('/activity/:id')
    .delete(async (req,res)=>{
        const id = req.params.id;
        console.log(req.params.id);

        try{
            
            await pool.query(`BEGIN`)

            // DELETE activity and category association
            await pool.query(`
                DELETE FROM activity_category
                WHERE activity_id = '${id}'
            `)

            // Remove reference to activity in events
            await pool.query(`
                UPDATE event
                SET activity_id = NULL
                WHERE activity_id = '${id}'
            `)

            // DELETE activity 
            await pool.query(`
                DELETE FROM activity
                WHERE uid = '${id}'
            `)

            const q = await pool.query(`COMMIT`);

            res.status(200).send({status:200, message: `Successfully Deleted Activity`})

        }catch(e){
            console.log(e)
            res.status(409).send({status:409, message: `Error: deleting activity id ${id}`})
        }
    })

// Remove and Add Category
app.route('/activity/:id/categories/:category')
    .delete(async(req,res)=>{
        const id = req.params.id
        const category = req.params.category
        try{
            const q = await pool.query(`
                DELETE FROM activity_category
                    USING category AS cat 
                    WHERE category_id = cat.uid AND activity_id = '${id}' AND cat.name = '${category}'
            `)

            res.status(200).send({status: 200, message: `Succesfully dissociated category (${category}) from activity`});
        }catch(e){
            console.log(e)
            res.status(409).send({status:409, message: "Error: Category Cannot be disossicated"});
        }
    })
    .post(async(req,res)=>{
        const id = req.params.id;
        const category = req.params.category;


        try{
            const q = await pool.query(`
                INSERT INTO activity_category (activity_id, category_id)
                SELECT '${id}', uid 
                FROM category
                WHERE category.name = '${category}' 
            `)

            res.status(200).send({status:200, message: `Successfully added category (${category}) to activity`});
        }catch(e){
            console.log(e);
            res.status(409).send({status:409, message: "Error: category cannot be created for activity"});
        }
    })



// QUERY SPECIFIC ACTIVITY app.route('/activty/:id')
app.route('/categories')
    .get(async(req,res)=>{
        try{
            const q = await pool.query(`
                SELECT uid AS id, name, to_char(date_created, 'Month DD, YYYY') AS date_created 
                FROM category
                ORDER BY date_created DESC
                `);
            console.log(q.rows);
            res.send(q.rows);
        }catch(e){
            console.log(e)
            res.send(409)
        }

        })
    .post(async (req,res)=>{
        console.log(req.body)
        const category = req.body.category
        try{
            const q = await pool.query(`
                INSERT INTO category (name)
                VALUES ('${category}')
                RETURNING uid AS id, name, to_char(date_created, 'Month DD, YYYY') AS date_created
            `)
            
            res.status(200).send(q.rows[0])
        }catch(e){
            console.log(e)
            res.status(409).send({})
        }
    })

app.route('/categories/:id')
    .delete(async(req,res)=>{
        const id  = req.params.id
        console.log(id);
        try{
            await pool.query(`BEGIN`)

            await pool.query(`
                DELETE from activity_category
                WHERE category_id = '${id}'
            `)

            await pool.query(`
                DELETE from category
                WHERE uid = '${id}'
            `)

            const q = await pool.query(`COMMIT`)
            
            res.status(200).send({status:200, message:`Successfully deleted category`})
        }catch(e){
            console.log(e)
            res.status(409).send({status:409, message:"Error: Unable to delete category"})
        }
    })

app.use('/events', (req,res,next)=>{
    for (const key in req.body){
        if(typeof req.body[key] === 'string') req.body[key] = req.body[key].trim().toUpperCase();
        else if(Array.isArray(req.body[key])) req.body[key] = req.body[key].map(elem=>{ 
            if(typeof elem === 'string') return elem.trim();
        })
    }
    next();
});
app.route('/events')
    .get(async(req,res)=>{
    // console.log("REQUESTING EVENTS");

    console.log(req.query)

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const q = await pool.query(`
        SELECT event.uid AS id, title, name  AS activity, 
        to_char(time_start, 'HH:MI') AS time_start, to_char(time_end, 'HH:MI') AS time_end 
        FROM event 
        LEFT JOIN activity ON activity_id = activity.uid 
        WHERE calendar_date >= '${startDate}' AND calendar_date < '${endDate}'
        ORDER BY time_start ASC;
    `)
    console.log(q.rows)
    res.send(q.rows);
    })
    .post(async(req, res)=>{
        console.log("POST TO createEvents");
        console.log(req.body);
        const event = req.body;
    
        // TODO: check for invalid activity name
    
    
        try{
            const ret = await pool.query(`
            INSERT INTO event (title, activity_id, calendar_date, time_start, time_end) 
            VALUES (
                '${event.title}',
                (SELECT uid FROM activity WHERE name = '${event.activity}'),
                '${event.date}',
                '${event.start}',
                '${event.end}}'
                )
            RETURNING uid AS id
            `);
    
            
            res.status(201).send({
                status: 201,
                message: `Event ${event.title} Successfully Created.`,
                eventid: ret.rows[0].id
            })
        }catch(e){
    
            res.status(409).send({
                status: 409,
                message: `Error: Unexpected error occured. Check if Activity is Valid`
            });
        }
    
    
    
    });

// TODO:
app.route('/events/:id')
    .get(async(req,res)=>{
        console.log("ID event");
        
        const eventId = req.params.id;
        console.log(eventId)
        try{
            const q = await pool.query(`
            SELECT e.uid AS id, e.title AS title, to_char(time_start, 'HH:MI AM') AS time_start,  to_char(time_end, 'HH:MI AM') AS time_end, 
            act.name AS activity, ARRAY_AGG(cat.name) AS categories , to_char(e.date_created, 'MONTH DD, YYYY') AS date_created  
            FROM event AS e 
            LEFT JOIN activity AS act ON act.uid = e.activity_id
            LEFT JOIN activity_category AS ac  ON act.uid = ac.activity_id
            LEFT JOIN category AS cat ON cat.uid = ac.category_id
            WHERE e.uid = '${eventId}'
            GROUP BY (e.uid, act.name);
            `)
            console.log(q.rows)
            res.send(q.rows[0]);
        }catch(e){
            console.log(e)
            res.send("ERROR");
        }

    })
    .delete(async(req,res)=>{
        try{
            const q = await pool.query(`
                DELETE from event WHERE uid = '${req.params.id}'
                RETURNING uid, title
            `);
            res.status(200).send({
                status: 200,
                message: `Successefully Deleted event ${q.rows[0].title}`
            });
        }
        catch(e){
            console.log(e);
            res.status(409).send({
                status: 409,
                message: `Error: Unexpected error occured. Check if Event id exists Valid`
            })
        }

    })
    .put(async(req, res)=>{
        console.log(req.body);
        const eventId = req.body.id;
        const title = req.body.title;
        const start = req.body.time_start
        const end = req.body.time_end
        const activity_id = req.body.activity_id

        try{
            const q = await pool.query(`
                UPDATE event
                SET 
                    title = '${title}' , 
                    time_start = '${start}' ,
                    time_end = '${end}' , 
                    activity_id = '${activity_id}'
                WHERE
                    uid = '${eventId}'
            `)
            console.log(q.rows);
            res.status(200).send({status: 200, message: `Event Successfully Updated`})
        }
        catch(e){
            console.log(e)
            res.status(409).send({status: 409, message: `Error Occured Cannot Updated`})
        }
    })

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});