const cors = require('cors');

const express = require('express');
const app = express()


const pool = require('./pgdb');

app.use(cors());
app.use(express.json()) 

app.route('/activity')
    .get(async (req,res)=>{
    console.log("REQUESTING ACTIVITIES")
    const q = await pool.query('SELECT name FROM activity');

    res.send(q.rows);
    })
    .post(async(req,res)=>{
        console.log("POST TO ACTIVITIES");
        console.log(req.body);
        // const q = await pool.query(`INSERT INTO category (title, caVALUES `);
        res.send(200);
    });

app.route('/categories')
    .get(async (req,res)=>{
        console.log("REQUESTING CATEGORIES");
        const q = await pool.query('SELECT name FROM category');
        res.send(q.rows);
    })
    .post(async(req,res)=>{
        console.log("POST TO CATEGORIES");
        console.log(req.body);
        // const q = await pool.query(`INSERT INTO category (title, caVALUES `);
        res.send(200);
    });

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});