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

                            }
                            else {

                                userImg = validUser[0].userImg;
                                userCity = validUser[0].userCity;
                                console.log(userImg)
                                if (userImg.length == 0) {
                                    if (userCity.length == 0) {
                                        res.render('home.hbs', { validUser, authenticated: true, noProfilePic: true, noCity: true, title: `HealthAura | Complete Health Care System` })
                                    }
                                    res.render('home.hbs', { validUser, authenticated: true, noProfilePic: true, userCity: true, title: `HealthAura | Complete Health Care System` })
                                }
                                else {
                                    if (userCity.length == 0) {
                                        res.render('home.hbs', { validUser, authenticated: true, profilePic: true, noCity: true, title: `HealthAura | Complete Health Care System` })
                                    }
                                    res.render('home.hbs', { validUser, authenticated: true, profilePic: true, userCity: true, title: `HealthAura | Complete Health Care System` })
                                }
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