const mySql = require('mysql');
const { verify } = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// exports.doctorListingPage = (req,res) => {
//     pool.getConnection((err,connection) => {
//         if(err) throw err;
//         res.render('doctors-listing.hbs', {title: 'Doctors | HealthAura'})
//     })
// }


exports.doctorListingPage = (req, res) => {
    const resultPerPage = 10;

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
                        connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                            if (err) {
                                res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                            }
                            else {
                                if (allDoctorsData.length == 0) {
                                    res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    const numOfResults = allDoctorsData.length;
                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                    let page = req.query.page ? Number(req.query.page) : 1;

                                    const startingLimit = (page - 1) * resultPerPage;
                                    connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                        if (err) {
                                            res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                        }
                                        else {
                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                            if (endingLink < (page + 4)) {
                                                iterator -= (page + 4) - numberOfPages;
                                            }
                                            res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, notAuthenticated: true, noProfilePic: true, noCity: true, fullData: true, page, iterator, endingLink, numberOfPages })

                                        }
                                    })



                                }
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
                                        connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                            if (err) {
                                                res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                            }
                                            else {
                                                if (allDoctorsData.length == 0) {
                                                    res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allDoctorsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;

                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                                        if (err) {
                                                            res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, noCity: true, validUser, fullData: true, page, iterator, endingLink, numberOfPages })

                                                        }
                                                    })




                                                }
                                            }
                                        })

                                    }
                                    else {
                                        userImg = validUser[0].userImg;
                                        userCity = validUser[0].userCity;
                                        if (userImg.length == 0) {
                                            if (userCity.length == 0) {
                                                connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                                    if (err) {
                                                        res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                    }
                                                    else {
                                                        if (allDoctorsData.length == 0) {
                                                            res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                        }
                                                        else {
                                                            const numOfResults = allDoctorsData.length;
                                                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                            let page = req.query.page ? Number(req.query.page) : 1;

                                                            const startingLimit = (page - 1) * resultPerPage;
                                                            connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                                                if (err) {
                                                                    res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                                }
                                                                else {
                                                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                                    if (endingLink < (page + 4)) {
                                                                        iterator -= (page + 4) - numberOfPages;
                                                                    }
                                                                    res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, noCity: true, validUser, fullData: true, page, iterator, endingLink, numberOfPages })

                                                                }
                                                            })


                                                        }
                                                    }
                                                })
                                            }
                                            else {
                                                connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                                    if (err) {
                                                        res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                    }
                                                    else {
                                                        if (allDoctorsData.length == 0) {
                                                            res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                        }
                                                        else {
                                                            const numOfResults = allDoctorsData.length;
                                                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                            let page = req.query.page ? Number(req.query.page) : 1;

                                                            const startingLimit = (page - 1) * resultPerPage;
                                                            connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                                                if (err) {
                                                                    res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                                }
                                                                else {
                                                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                                    if (endingLink < (page + 4)) {
                                                                        iterator -= (page + 4) - numberOfPages;
                                                                    }
                                                                    res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, authenticated: true, noProfilePic: true, userCity: true, validUser, fullData: true, page, iterator, endingLink, numberOfPages })


                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                        else {
                                            connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                                if (err) {
                                                    res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                }
                                                else {
                                                    if (allDoctorsData.length == 0) {
                                                        res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, authenticated: true, profilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                    }
                                                    else {
                                                        const numOfResults = allDoctorsData.length;
                                                        const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                        let page = req.query.page ? Number(req.query.page) : 1;

                                                        const startingLimit = (page - 1) * resultPerPage;
                                                        connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                                            if (err) {
                                                                res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                                            }
                                                            else {
                                                                let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                                if (endingLink < (page + 4)) {
                                                                    iterator -= (page + 4) - numberOfPages;
                                                                }
                                                                res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, authenticated: true, profilePic: true, userCity: true, validUser, fullData: true, page, iterator, endingLink, numberOfPages })



                                                            }
                                                        })



                                                    }
                                                }
                                            })
                                        }

                                        // connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                        //     if (err) {
                                        //         res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                        //     }
                                        //     else {
                                        //         res.render('doctors-listing.hbs', { allDoctorsData, validUser, title: "Doctors | HealthAura", validUser, authenticated: true })
                                        //     }
                                        // })
                                    }
                                })
                            }
                        })

                    }
                })
            }
            else {

                connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                    if (err) {
                        res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refresh" })
                    }
                    else {
                        connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                            if (err) {
                                res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                            }
                            else {
                                if (allDoctorsData.length == 0) {
                                    res.render('doctors-listing.hbs', { title: `Doctors | HealthAura`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    const numOfResults = allDoctorsData.length;
                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                    let page = req.query.page ? Number(req.query.page) : 1;

                                    const startingLimit = (page - 1) * resultPerPage;
                                    connection.query(`SELECT * FROM healthaura_doctors LIMIT ${startingLimit},${resultPerPage}`, (err, allDoctorsData) => {
                                        if (err) {
                                            res.render('doctors-listing.hbs', { title: "Doctors | HealthAura", message: "Something went wrong try to refress" })
                                        }
                                        else {
                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                            if (endingLink < (page + 4)) {
                                                iterator -= (page + 4) - numberOfPages;
                                            }
                                            res.render('doctors-listing.hbs', { allDoctorsData, title: `Doctors | HealthAura`, notAuthenticated: true, noProfilePic: true, noCity: true, fullData: true, page, iterator, endingLink, numberOfPages })




                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        }
    })
}
