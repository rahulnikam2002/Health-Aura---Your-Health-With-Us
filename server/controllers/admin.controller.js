const mySql = require('mysql');
const { verify } = require('jsonwebtoken');
require('dotenv').config()


// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});






exports.adminDashboard = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        else {
            const userToken = req.cookies.userToken;
            if (userToken) {
                verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        res.redirect('/auth/login/')
                    }
                    else {
                        let userEmail = decoded.result;
                        connection.query(`SELECT * FROM healthaura_users WHERE userEmail = ?`, [userEmail], (err, admin) => {
                            if (err) {
                                res.redirect('/')
                                console.log(err)
                            }
                            else {
                                console.log(admin[0].userImg)
                                let userProfileImg = admin[0].userImg;
                                if (userProfileImg.length == 0) {
                                    res.render('dashboard.hbs', { admin, title: "Dashborad | HealthAura", noProfileImg: true })
                                }
                                else {
                                    res.render('dashboard.hbs', { admin, title: "Dashborad | HealthAura", ProfileImg: true })
                                }
                            }
                        })
                    }
                })
            }
            else {
                res.redirect('/v1/auth/login/')
            }

        }
    })
}


exports.addNewHospitalPage = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        else {
            connection.query(`SELECT * FROM healthaura_users WHERE role = "admin"`, (err, adminData) => {
                const userToken = req.cookies.userToken;
                if (userToken) {
                    verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                        if (err) {
                            res.redirect('/auth/login/')
                        }
                        else {
                            let userEmail = decoded.result;
                            connection.query(`SELECT * FROM healthaura_users WHERE userEmail = ?`, [userEmail], (err, admin) => {
                                if (err) {
                                    res.redirect('/')
                                    console.log(err)
                                }
                                else {
                                    console.log(admin[0].userImg)
                                    let userProfileImg = admin[0].userImg;
                                    if (userProfileImg.length == 0) {
                                        res.render('add-hospital.hbs', { admin, title: "Add New Hospital | HealthAura", noProfileImg: true })
                                    }
                                    else {
                                        res.render('add-hospital.hbs', { admin, title: "Add New Hospital | HealthAura", ProfileImg: true })
                                    }
                                }
                            })
                        }
                    })
                }
                else {
                    res.redirect('/v1/auth/login/')
                }
            })
        }
    })
}

exports.addNewHospital = (req, res) => {
    const { hospitalName, hospitalPhone, hospitalCity, hospitalAddress, hospitalType, hospitalIframe, hospitalTreatments, hospitalAbout, hospitalMeta } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            let userAddedImgs = req.files;
            let hospitalFeaturedImg = userAddedImgs.featuredImg[0].filename;
            let imgString = "";
            for (let i = 0; i < userAddedImgs.multipleImgs.length; i++) {
                imgString = `${imgString}` + `${userAddedImgs.multipleImgs[i].filename},`
            }
            let multipleHospital = imgString;

            connection.query('insert into healthaura_hospitals set hospitalName = ?, phoneNumber = ?, hospitalLocation = ?, city = ?, hospitalType = ?, hospitalIframe = ?, treatments = ?, hospitalAbout = ?, hospitalImgs = ?, featuredImg = ?, hospitalMeta', [hospitalName, hospitalPhone, hospitalAddress, hospitalCity, hospitalType, hospitalIframe, hospitalTreatments, hospitalAbout, multipleHospital, hospitalFeaturedImg, hospitalMeta], (err, hospital) => {
                if (err) {
                    res.render('add-hospital.hbs', { message: "Error occurred while adding the hospital try again" })
                    console.log(err);
                }
                else {

                    res.render('add-hospital.hbs')
                }
            })
        }
    })
}



// Show all Hospitals Page
exports.allHospitalPage = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        else {
            const userToken = req.cookies.userToken;
            if (userToken) {
                verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        res.redirect('/auth/login/')
                    }
                    else {
                        let userEmail = decoded.result;
                        connection.query(`SELECT * FROM healthaura_users WHERE userEmail = ?`, [userEmail], (err, admin) => {
                            if (err) {
                                res.redirect('/')
                                console.log(err)
                            }
                            else {
                                connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                                    console.log(admin[0].userImg)
                                    let userProfileImg = admin[0].userImg;
                                    if (userProfileImg.length == 0) {
                                        res.render('dashboard-all-hospital-page.hbs', { allHospitalsData, admin, title: "View all Hospital | HealthAura", noProfileImg: true })
                                    }
                                    else {
                                        res.render('dashboard-all-hospital-page.hbs', { allHospitalsData, admin, title: "View all Hospital | HealthAura", ProfileImg: true })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.redirect('/v1/auth/login/')
            }
        }
    })
}