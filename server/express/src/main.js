const cors = require('cors');

const express = require('express');
const app = express()

const pool = require('./pgdb');

app.use(cors());

app.get('/activity', async (req,res)=>{

    const q = await pool.query('SELECT name FROM activity');

    res.send(q.rows);
})


const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});