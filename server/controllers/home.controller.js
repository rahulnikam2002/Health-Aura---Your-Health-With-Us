const cookieParser = require('cookie-parser');
const { verify } = require('jsonwebtoken');
const mySql = require('mysql');
require('dotenv').config();

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

exports.homePage = (req, res) => {
    let userToken = req.cookies.userToken;
    if (userToken) {
        verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.render('home.hbs', { notAuthenticated: true })
                console.log('notAuthenticated 1st')
            }
            else {
                let userEmail = decoded.result;
                pool.getConnection((err, connection) => {
                    if (err) {
                        console.log(err);
                        throw err;

                    }
                    else {
                        connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, validUser) => {
                            if (err) {
                                res.render('home.hbs')
                                console.log('notAuthenticated 2nd')

                            }
                            else {
                                console.log(validUser)
                                res.render('home.hbs', { validUser, authenticated: true });
                            }
                        })
                    }
                })

            }
        })
    }
    else {
        res.render('home.hbs', { notAuthenticated: true })
                                console.log('notAuthenticated 3rd')

    }

}
