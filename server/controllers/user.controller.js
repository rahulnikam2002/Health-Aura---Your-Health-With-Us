const mySql = require('mysql')
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



exports.userProfilePage = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            throw err;
        }
        else {

            let userToken = req.cookies.userToken;
            verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    res.redirect('/')
                }
                else {
                    userEmail = decoded.result;
                    connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err,User) => {
                        userImg = User[0].userImg;
                        userCity = User[0].userCity;
                        pageTitle = User[0].userName;
                        console.log(userImg)
                        if(userImg.length == 0){
                            if(userCity.length == 0){
                                res.render('user-profile.hbs', {User, authenticated:true, noProfilePic: true, noCity:true, title: `${pageTitle} | HealthAura`})
                            }
                            res.render('user-profile.hbs', {User, authenticated:true, noProfilePic: true, userCity:true, title: `${pageTitle} | HealthAura`})
                        }
                        else{
                            if(userCity.length == 0){
                                res.render('user-profile.hbs', {User, authenticated:true, profilePic: true, noCity:true, title: `${pageTitle} | HealthAura`})
                            }
                            res.render('user-profile.hbs', {User, authenticated:true, profilePic: true, userCity:true, title: `${pageTitle} | HealthAura`})
                        }
                    })

                }
            })
        }
    })
}