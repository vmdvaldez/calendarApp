const cors = require('cors');

const express = require('express');
const app = express()


const pool = require('./pgdb');

app.use(cors());
app.use(express.json()) 

// TODO: input validation to prevent SQL injections
// TODO: push activity and category together via transcation -- will need to push activity and category relations as well

app.get('/activity', async (req,res)=>{
    console.log("REQUESTING ACTIVITIES")
    const q = await pool.query('SELECT name FROM activity');

    res.send(q.rows);
    })


app.get('/categories',async (req,res)=>{
        console.log("REQUESTING CATEGORIES");
        const q = await pool.query('SELECT name FROM category');
        res.send(q.rows);
    })

app.get('/events', async(req,res)=>{
    //TODO: return activity name instead of ID
    //TODO: SORT BY calendar_date
    // console.log("REQUESTING EVENTS");

    // console.log(req.query);
    const eventId = req.query.id
    const date = req.query.date;
    // TODO MAKE array categories https://stackoverflow.com/questions/60998663/merge-rows-same-values-in-postgresql-based-on-row-difference
    if (eventId != undefined){
        const q = await pool.query(`
            SELECT e.uid AS id, e.title AS title,   to_char(time_start, 'HH:MM AM') AS time_start,  to_char(time_end, 'HH:MM AM') AS time_end, 
            act.name AS activity, ARRAY_AGG(cat.name) AS categories , to_char(date_created, 'MONTH DD, YYYY') AS date_created  
            FROM event AS e 
            JOIN activity AS act ON act.uid = e.activity_id
            JOIN activity_category AS ac  ON act.uid = ac.activity_id
            JOIN category AS cat ON cat.uid = ac.category_id
            WHERE e.uid = '${eventId}'
            GROUP BY (e.uid, act.name);
        `)
        res.send(q.rows[0]);
    }
    else{
        const q = await pool.query(`
            SELECT event.uid AS id, title, name AS activity FROM event JOIN activity ON activity_id = activity.uid WHERE '${date}' = calendar_date;
        `)
        res.send(q.rows);
    }

    // res.send(400);
});

app.post('/setactivity', async(req,res)=>{
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
            message: `Successfully Created Activity ${activity} with category: ${ctg.map(c=>` ${c}`)}`
        });
    }
    catch(e){
        ret = await pool.query('ROLLBACK');
        console.log(e)

        res.status(409).send({status: 409, message: "Error: Activity already exists"});
    }

    console.log(ret);

});

app.post('/createevent', async(req, res)=>{
    console.log("POST TO setactivity");
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
        console.log(e);

        res.status(409).send({
            status: 409,
            message: `Error: Unexpected error occured. Check if Activity is Valid`
        });
    }



});

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});