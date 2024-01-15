const cors = require('cors');

const express = require('express');
const app = express()


const pool = require('./pgdb');

app.use(cors());
app.use(express.json()) 

// TODO: input validation to prevent SQL injections
// TODO: push activity and category together via transcation -- will need to push activity and category relations as well


app.route('/activity')
    .get(async (req,res)=>{
        const q = await pool.query('SELECT uid, name FROM activity');
        console.log(q.rows);
        res.send(q.rows);
        })
    .post(async(req,res)=>{
        console.log("POST TO setactivity");
        const {activity, categories} = req.body;
    
        const ctg = categories.filter(c => c.length > 0)
        let ret = "";
    
        await pool.query('BEGIN')
        try{
            const aQueryRet = await pool.query(`
                INSERT INTO activity (name) VALUES ('${activity}') 
                RETURNING uid`);
            
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
                activityId: aQueryRet.rows[0].uid
            });
        }
        catch(e){
            ret = await pool.query('ROLLBACK');
            console.log(e)
    
            res.status(409).send({status: 409, message: "Error: Activity already exists"});
        }
    
        console.log(ret);
    
    })

// QUERY SPECIFIC ACTIVITY app.route('/activty/:id')


app.get('/categories',async (req,res)=>{
        const q = await pool.query('SELECT name FROM category');
        res.send(q.rows);
    })

app.route('/events')
    .get(async(req,res)=>{
    // console.log("REQUESTING EVENTS");

    const date = req.query.date;
    const q = await pool.query(`
        SELECT event.uid AS id, title, name  AS activity, 
        to_char(time_start, 'HH:MM') AS time_start, to_char(time_end, 'HH:MM') AS time_end 
        FROM event 
        LEFT JOIN activity ON activity_id = activity.uid 
        WHERE '${date}' = calendar_date
        ORDER BY time_start ASC;
    `)
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
            SELECT e.uid AS id, e.title AS title, to_char(time_start, 'HH:MM AM') AS time_start,  to_char(time_end, 'HH:MM AM') AS time_end, 
            act.name AS activity, ARRAY_AGG(cat.name) AS categories , to_char(date_created, 'MONTH DD, YYYY') AS date_created  
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

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});