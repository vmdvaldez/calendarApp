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

app.post('/setactivity', async(req,res)=>{
    // TODO : handle return
    console.log("POST TO setactivity");
    console.log(req.body);
    const {activity, categories} = req.body;

    let ret = "";

    await pool.query('BEGIN')
    try{
        const aQueryRet = await pool.query(`
            INSERT INTO activity (name) VALUES ('${activity}') 
            RETURNING uid`);
        const cQueryRet = await pool.query(`
            WITH ins AS (
            INSERT INTO category (name) VALUES ${categories.map(c=>`('${c}')`)} 
            ON CONFLICT (name) DO NOTHING 
            RETURNING uid)
            
            SELECT * FROM ins UNION
            SELECT uid FROM category WHERE name IN (${categories.map(c=>`'${c}'`)})
            `);
        

        await pool.query(`
        INSERT INTO activity_category (activity_id, category_id)
        VALUES ${cQueryRet.rows.map(c=>`('${aQueryRet.rows[0].uid}', '${c.uid}')`)}
        `)

        ret = await pool.query('COMMIT');
    }
    catch(e){
        ret = await pool.query('ROLLBACK');
        console.log(e)
    }

    // console.log(ret);

    res.send(200);
});


const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});