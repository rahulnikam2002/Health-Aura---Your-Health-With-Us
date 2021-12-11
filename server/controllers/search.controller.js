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

//By user Location (GPS)
exports.searchHospitalByCity = (req, res) => {
    const hospitalCity = req.query.city;
    const hospitalName = req.query.hospital;
    const treatment = req.query.treatment;
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
                        connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                            if (err) {
                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                            }
                            else {
                                if (allHospitalsData.length == 0) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    const numOfResults = allHospitalsData.length;
                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                    let page = req.query.page ? Number(req.query.page) : 1;
                                    const startingLimit = (page - 1) * resultPerPage;

                                    connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                            if (endingLink < (page + 4)) {
                                                iterator -= (page + 4) - numberOfPages;
                                            }
                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else {
                        let userEmail = decoded.result;
                        connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, validUser) => {
                            if (err) {
                                connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                    if (err) {
                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, validUser, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                    }
                                    else {
                                        if (allHospitalsData.length == 0) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                        }
                                        else {
                                            const numOfResults = allHospitalsData.length;
                                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                            let page = req.query.page ? Number(req.query.page) : 1;
                                            const startingLimit = (page - 1) * resultPerPage;

                                            connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                                if (err) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, validUser, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                }
                                                else {
                                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                    if (endingLink < (page + 4)) {
                                                        iterator -= (page + 4) - numberOfPages;
                                                    }
                                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, validUser, page, iterator, endingLink, numberOfPages, fullData: true })

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
                                        connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, noCity: true, validUser, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;
                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, noCity: true, validUser, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, authenticated: true, validUser, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })

                                                }
                                            }
                                        })
                                    }
                                    else {
                                        connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;
                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, noProfilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, authenticated: true, validUser, noProfilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                                else {
                                    connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, profilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            if (allHospitalsData.length == 0) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, profilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                            }
                                            else {
                                                const numOfResults = allHospitalsData.length;
                                                const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                let page = req.query.page ? Number(req.query.page) : 1;
                                                const startingLimit = (page - 1) * resultPerPage;
                                                connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                                    if (err) {
                                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, authenticated: true, profilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                    }
                                                    else {
                                                        let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                        if (endingLink < (page + 4)) {
                                                            iterator -= (page + 4) - numberOfPages;
                                                        }
                                                        res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, authenticated: true, validUser, profilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
            else {
                connection.query('select * from healthaura_hospitals where hospitalLocation like? or City like?', ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                    if (err) {
                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                    }
                    else {
                        if (allHospitalsData.length == 0) {
                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                        }
                        else {

                            const numOfResults = allHospitalsData.length;
                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                            let page = req.query.page ? Number(req.query.page) : 1;
                            const startingLimit = (page - 1) * resultPerPage;
                            connection.query(`select * from healthaura_hospitals where hospitalLocation like? or City like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalCity + '%', '%' + hospitalCity + '%'], (err, allHospitalsData) => {
                                if (err) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                    if (endingLink < (page + 4)) {
                                        iterator -= (page + 4) - numberOfPages;
                                    }
                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalCity}`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                }
                            })
                        }
                    }
                })
            }

        }
    })
}


//Search only by hospial name
exports.searchHospital = (req, res) => {
    const hospitalName = req.query.hospital;
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
                        connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                            if (err) {
                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                            }
                            else {
                                if (allHospitalsData.length == 0) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    const numOfResults = allHospitalsData.length;
                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                    let page = req.query.page ? Number(req.query.page) : 1;
                                    const startingLimit = (page - 1) * resultPerPage;
                                    connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                            if (endingLink < (page + 4)) {
                                                iterator -= (page + 4) - numberOfPages;
                                            }
                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else {
                        let userEmail = decoded.result;
                        connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, validUser) => {
                            if (err) {
                                connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                    if (err) {
                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, validUser, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                    }
                                    else {
                                        if (allHospitalsData.length == 0) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                        }
                                        else {

                                            const numOfResults = allHospitalsData.length;
                                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                            let page = req.query.page ? Number(req.query.page) : 1;
                                            const startingLimit = (page - 1) * resultPerPage;
                                            connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                                if (err) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, validUser, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                }
                                                else {
                                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                    if (endingLink < (page + 4)) {
                                                        iterator -= (page + 4) - numberOfPages;
                                                    }
                                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, validUser, page, iterator, endingLink, numberOfPages, fullData: true })
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
                                    if (userCity == 0) {
                                        connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, noCity: true, validUser, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;
                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, noCity: true, validUser, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, authenticated: true, validUser, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    else {
                                        connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {

                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;
                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, noProfilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, authenticated: true, validUser, noProfilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                                else {
                                    connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, profilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            if (allHospitalsData.length == 0) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, profilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                            }
                                            else {

                                                const numOfResults = allHospitalsData.length;
                                                const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                let page = req.query.page ? Number(req.query.page) : 1;
                                                const startingLimit = (page - 1) * resultPerPage;
                                                connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                                    if (err) {
                                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, authenticated: true, profilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                    }
                                                    else {
                                                        let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                        if (endingLink < (page + 4)) {
                                                            iterator -= (page + 4) - numberOfPages;
                                                        }
                                                        res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, authenticated: true, validUser, profilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
            else {
                connection.query('select * from healthaura_hospitals where hospitalName like?', ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                    if (err) {
                        res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                    }
                    else {
                        if (allHospitalsData.length == 0) {
                            res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                        }
                        else {

                            const numOfResults = allHospitalsData.length;
                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                            let page = req.query.page ? Number(req.query.page) : 1;
                            const startingLimit = (page - 1) * resultPerPage;
                            connection.query(`select * from healthaura_hospitals where hospitalName like? LIMIT ${startingLimit},${resultPerPage}`, ['%' + hospitalName + '%'], (err, allHospitalsData) => {
                                if (err) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                    if (endingLink < (page + 4)) {
                                        iterator -= (page + 4) - numberOfPages;
                                    }
                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${hospitalName}`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                }
                            })
                        }
                    }
                })
            }

        }
    })
}

// connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {

exports.advanceSearch = (req, res) => {
    const userEnteredCity = req.query.city;
    const userTreatment = req.query.treatment;
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
                        connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                            if (err) {
                                res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                            }
                            else {
                                if (allHospitalsData.length == 0) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    const numOfResults = allHospitalsData.length;
                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                    let page = req.query.page ? Number(req.query.page) : 1;

                                    const startingLimit = (page - 1) * resultPerPage;
                                    connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                            if (endingLink < (page + 4)) {
                                                iterator -= (page + 4) - numberOfPages;
                                            }
                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true });
                                        }
                                    })

                                }
                            }
                        })
                    }
                    else {
                        let userEmail = decoded.result;
                        connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, validUser) => {
                            if (err) {
                                connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                    if (err) {
                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, validUser, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                    }
                                    else {
                                        if (allHospitalsData.length == 0) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                        }
                                        else {
                                            const numOfResults = allHospitalsData.length;
                                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                            let page = req.query.page ? Number(req.query.page) : 1;

                                            const startingLimit = (page - 1) * resultPerPage;
                                            connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                                if (err) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                }
                                                else {
                                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                    if (endingLink < (page + 4)) {
                                                        iterator -= (page + 4) - numberOfPages;
                                                    }
                                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, validUser, page, iterator, endingLink, numberOfPages, fullData: true })
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
                                    if (userCity == 0) {
                                        connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, noProfilePic: true, noCity: true, validUser, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;

                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, validUser, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    else {
                                        connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                            if (err) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, noProfilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                            }
                                            else {
                                                if (allHospitalsData.length == 0) {
                                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, noProfilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                                }
                                                else {
                                                    const numOfResults = allHospitalsData.length;
                                                    const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                    let page = req.query.page ? Number(req.query.page) : 1;

                                                    const startingLimit = (page - 1) * resultPerPage;
                                                    connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                                        if (err) {
                                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                        }
                                                        else {
                                                            let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                            if (endingLink < (page + 4)) {
                                                                iterator -= (page + 4) - numberOfPages;
                                                            }
                                                            res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, validUser, noProfilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                                else {
                                    connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                        if (err) {
                                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, profilePic: true, validUser, userCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                        }
                                        else {
                                            if (allHospitalsData.length == 0) {
                                                res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, profilePic: true, userCity: true, message: 'No data found for this area, Try to search any nearby area', validUser })
                                            }
                                            else {
                                                const numOfResults = allHospitalsData.length;
                                                const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                                                let page = req.query.page ? Number(req.query.page) : 1;

                                                const startingLimit = (page - 1) * resultPerPage;
                                                connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                                    if (err) {
                                                        res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                                    }
                                                    else {
                                                        let iterator = (page - 5) < 1 ? 1 : page - 5;
                                                        let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                                        if (endingLink < (page + 4)) {
                                                            iterator -= (page + 4) - numberOfPages;
                                                        }

                                                        res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, authenticated: true, validUser, profilePic: true, userCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
            else {
                connection.query('SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE?', ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                    if (err) {
                        res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                    }
                    else {
                        if (allHospitalsData.length == 0) {
                            res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                        }
                        else {
                            const numOfResults = allHospitalsData.length;
                            const numberOfPages = Math.ceil(numOfResults / resultPerPage);
                            let page = req.query.page ? Number(req.query.page) : 1;

                            const startingLimit = (page - 1) * resultPerPage;
                            connection.query(`SELECT * FROM healthaura_hospitals WHERE City LIKE? AND treatments LIKE? LIMIT ${startingLimit},${resultPerPage}`, ['%' + userEnteredCity + '%', '%' + userTreatment + '%'], (err, allHospitalsData) => {
                                if (err) {
                                    res.render('hospital-listing.hbs', { title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, message: 'No data found for this area, Try to search any nearby area' })
                                }
                                else {
                                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                                    if (endingLink < (page + 4)) {
                                        iterator -= (page + 4) - numberOfPages;
                                    }
                                    res.render('hospital-listing.hbs', { allHospitalsData, title: `Hospitals | ${userEnteredCity} for ${userTreatment} treatment`, notAuthenticated: true, noProfilePic: true, noCity: true, page, iterator, endingLink, numberOfPages, fullData: true })
                                }
                            })
                        }
                    }
                })
            }

        }
    })

}


//