const mySql = require('mysql');


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
        if(err){
            console.log(err)
        }
        else{
            connection.query(`SELECT * FROM healthaura_users WHERE role = "admin"`, (err, admin) => {
                if (err) {
                    res.redirect('/')
                    console.log(err)
                }
                else {
                   res.render('dashboard.hbs', { admin, title: "Dashborad | HealthAura" })
                }
            })
        }
    })
}


exports.addNewHospitalPage = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err){
            console.log(err)
        }
        else{
            connection.query(`SELECT * FROM healthaura_users WHERE role = "admin"`, (err, adminData) => {
                if (err) {
                    res.redirect('/')
                    console.log(err)
                }
                else {
                    res.render('add-hospital.hbs', {adminData, title: "Add New Hospital | HealthAura" })
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
            connection.query(`SELECT * FROM healthaura_users WHERE role = "admin"`, (err, admin) => {
                if (err) {
                    res.redirect('/')
                    console.log(err)
                }
                else {

                    connection.query('SELECT * FROM healthaura_hospitals', (err, allHospitalsData) => {
                        let adminData = admin;
                        res.render('dashboard-all-hospital-page.hbs', { allHospitalsData, adminData, title: 'All Hospitals | HealthAura' })

                    })
                }
            })
        }
    })
}