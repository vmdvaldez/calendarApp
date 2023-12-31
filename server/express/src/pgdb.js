const dotenv = require('dotenv').config({path:'db.env'});

const {Pool} = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSOWRD,
    database: process.env.PG_DATABASE
});


module.exports = {
    query: (text, param) =>  pool.query(text,param)
};