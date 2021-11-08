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
    res.render('dashboard.hbs', { title: 'Dashboard | HealthAura' });
}


exports.addNewHospitalPage = (req, res) => {
    res.render('add-hospital.hbs', { title: "Add New Hospital | HealthAura" })
}

exports.addNewHospital = (req, res) => {
    const { hospitalName, hospitalPhone, hospitalCity, hospitalAddress, hospitalType, hospitalIframe, hospitalTags, hospitalAbout } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {
            
            console.log('Done')      
        }
    })
}