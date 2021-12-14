
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





exports.addDoctorPage = (req,res) => {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query('select * from healthaura_doctors', (err, allDoctors) => {
                if(err){
                    res.redirect('/dashboard/all-hospitals')
                }
                else{
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
                                    // const hospitalNameFromDB = hospitalData[0].hospitalName;
                                    connection.query('SELECT * FROM healthaura_doctors', (err, allDoctorsData) => {
                                        console.log(admin[0].userImg)
                                        let userProfileImg = admin[0].userImg;
                                        if (userProfileImg.length == 0) {
                                            res.render('add-doctor.hbs', { allDoctors, allDoctorsData, admin, title: "View all Hospital | HealthAura", noProfileImg: true })
                                        }
                                        else {
                                            
                                            res.render('add-doctor.hbs', { allDoctors, allDoctorsData, admin, title: "View all Hospital | HealthAura", ProfileImg: true })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                }
            })
        })
}

exports.addDoctor = (req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log(req.file);
    })
}