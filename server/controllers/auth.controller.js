// const { hashSync, genSaltSync, compareSync } = require('bcrypt');
// const { sign } = require('jsonwebtoken');
// require('dotenv').config();

const { hashSync, genSaltSync, compareSync } = require('bcrypt');
const mySql = require('mysql');
const { sign } = require('jsonwebtoken')


// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const validator = require('validator')

exports.loginPage = (req, res) => {
    res.render('login.hbs', { title: 'HealthAura - Login' })
}

exports.registerPage = (req, res) => {
    res.render('register.hbs', { title: 'HealthAura - Join the family' })
}


// Registration
exports.registerUser = (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    const checkEmail = validator.isEmail(userEmail);
    const checkPassword = validator.isStrongPassword(userPassword);

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            connection.query('SELECT userEmail FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, data) => {
                if (data.length != 0) {
                    res.render('register.hbs', { message: 'Email already exists, Try to login' })
                }
                else {
                    if (checkEmail) {
                        if (checkPassword) {
                            let salt = genSaltSync(10);
                            let hashedPassword = hashSync(userPassword, salt)

                            connection.query('INSERT INTO healthaura_users SET userName = ?, userEmail = ?, userPassword =?', [userName, userEmail, hashedPassword], (err, registeredUser) => {
                                if (err) {
                                    res.render('register.hbs', { messgae: 'Something went wrong, Please try again, Sorry for inconvenience' });
                                }
                                else {
                                    const userToken = sign({ result: userEmail }, process.env.SECRET_KEY, {
                                        expiresIn: '24h'
                                    });

                                    res.cookie('userToken', userToken, {
                                        expires: new Date(Date.now() + 86400 * 1000), //31536000000
                                        httpOnly: true
                                    })
                                    res.redirect('/');
                                }
                            })
                        }
                        else {
                            res.render('register.hbs', { message: 'Password must contain at least 1 Capital Character, 1 small Character, 1 Number and 1 Symbol' })
                        }
                    }
                    else {
                        res.render('register.hbs', { message: 'Invalid Email' })
                    }
                }
            })
        }
    })



}



exports.loginUser = (req, res) => {
    const { userEmail, userPassword } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, data) => {
                if (err) {
                    res.render('login.hbs', { message: 'Email or Password is Incorrect, Try again' })
                }
                if (data.length == 0) {
                    res.render('login.hbs', { message: `Email Doesn't exist, Try to register` })
                }
                else {
                    const checkPassword = compareSync(userPassword, data[0].userPassword);
                    if (checkPassword) {
                        const userToken = sign({ result: data[0].userEmail }, process.env.SECRET_KEY, {
                            expiresIn: '24h'
                        });

                        res.cookie('userToken', userToken, {
                            expires: new Date(Date.now() + 86400 * 1000), //31536000000
                            httpOnly: true
                        })
                        res.redirect('/');
                    }
                    else {
                        res.render('login.hbs', { message: `Email or Password is Incorrect, Try again` })
                    }
                }
            })
        }
    })
}


exports.logoutUser = (req, res) => {
    res.clearCookie("userToken");
    res.redirect("/");
}