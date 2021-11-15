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

exports.allHospitalListing = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            let userToken = req.cookies.userToken;
            if (userToken) {
                verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                            if (err) {
                                res.render('hospital-listing.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                            }
                            else {
                                res.render('hospital-listing.hbs', { allHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                            }
                        })

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
                                        connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                                            }
                                            else {
                                                res.render('hospital-listing.hbs', { allHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                                            }
                                        })

                                    }
                                    else {
                                        connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                                            }
                                            else {
                                                res.render('hospital-listing.hbs', { allHospitalsData, validUser, title: "Hospitals | HealthAura", validUser, authenticated: true })
                                            }
                                        })
                                    }
                                })
                            }
                        })

                    }
                })
            }
            else {

                connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                    if (err) {
                        res.render('hospital-listing.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refresh" })
                    }
                    else {
                        res.render('hospital-listing.hbs', { allHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                    }
                })
            }
        }
    })
}


exports.singleHospitalPage = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            let userToken = req.cookies.userToken;
            if (userToken) {
                verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        connection.query('SELECT * FROM healthaura_hospitals WHERE hospitalName = ?',[req.params.title], (err, singleHospitalsData) => {
                            if (err) {
                                res.render('single-hospital.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                            }
                            else {
                                res.render('single-hospital.hbs', { singleHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                            }
                        })

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
                                        connection.query('SELECT * FROM healthaura_hospitals', (err, singleHospitalsData) => {
                                            if (err) {
                                                res.render('single-hospital.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                                            }
                                            else {
                                                res.render('single-hospital.hbs', { singleHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                                            }
                                        })

                                    }
                                    else {
                                        connection.query('SELECT * FROM healthaura_hospitals WHERE hospitalName = ?',[req.params.title], (err, singleHospitalsData) => {
                                            if (err) {
                                                res.render('single-hospital.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refress" })
                                            }
                                            else {
                                                res.render('single-hospital.hbs', { singleHospitalsData, validUser, title: "Hospitals | HealthAura", validUser, authenticated: true })
                                            }
                                        })
                                    }
                                })
                            }
                        })

                    }
                })
            }
            else {
                connection.query('SELECT * FROM healthaura_hospitals WHERE hospitalName = ?',[req.params.title], (err, singleHospitalsData) => {
                    if (err) {
                        res.render('single-hospital.hbs', { title: "Hospitals | HealthAura", message: "Something went wrong try to refresh" })
                    }
                    else {
                        res.render('single-hospital.hbs', { singleHospitalsData, title: "Hospitals | HealthAura", notAuthenticated: true })
                    }
                })
            }
        }
    })
}
