const express = require('express');
const mySql = require('mysql');
const ex_hbs = require('express-handlebars');
const ejs = require('ejs');
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Creating Server =>
const app = express();
const port = process.env.PORT || 5000;

// MiddleWares
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


//Template Engines 
app.engine("hbs", ex_hbs({ extname: '.hbs' }))
app.set('view engine', 'hbs');
app.set('view engine', 'ejs');

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if(err){
        console.log(err);
        throw err;
    }
    else{
        console.log('Database connected successfully');
    }
})

// Routers prefix setup =>
const homeRouter = require('./server/routers/home.router')
const authRouter = require('./server/routers/auth.router')
app.use('/', homeRouter);
app.use('/v1/auth', authRouter);

// Running Server => 
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
})