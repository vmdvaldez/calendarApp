const express = require('express');
const app = express()

const pool = require('./pgdb');

const port = 3000
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});