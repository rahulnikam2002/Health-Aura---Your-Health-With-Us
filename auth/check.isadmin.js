const { verify } = require('jsonwebtoken')
const mySql = require('mysql');

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

exports.isAdmin = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        let userToken = req.cookies.userToken;
        if (userToken) {
            verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    res.redirect('/');  // Redirecting to homepage...
                }
                else {
                    let userEmail = decoded.result;

                    connection.query('SELECT role FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, userRole) => {
                        if (err) {
                            res.redirect('/')  // Redirecting to homepage...
                        }
                        else {
                            if (userRole[0].role == 'admin') {
                                next()
                            }
                            else {
                                res.redirect('/')
                            }
                        }
                    })
                }
            })
        }
        else {
            res.redirect('/');
        }
    })
}