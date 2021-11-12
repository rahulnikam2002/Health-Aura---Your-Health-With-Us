const mySql = require('mysql')


let pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})




exports.changePassPage = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected')
        res.render('change-password.hbs', { title: 'Change Password' })
    })
}