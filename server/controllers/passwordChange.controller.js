const mySql = require('mysql')
const nodeMailer = require('nodemailer')
const { genSaltSync, compareSync, hashSync } = require('bcrypt')
require('dotenv').config()


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


exports.showOtpPage = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected')
        const userEmail = req.query.userEmail;
        console.log(userEmail)

        /*
        Steps todo here =>
        1. Import NodeMailer
        2. SetUp NodeMailer
        3. Send OTP to user provided email
        4. store sended OTP on DB
        5. render otp.hbs 
        */
        connection.query('SELECT * FROM healthaura_users where userEmail = ?', [userEmail], (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                if (data.length == 0) {
                    res.render('change-password.hbs', { title: 'Change Password', message: 'Email not found' })
                }
                else {

                    const OTP = Math.floor(1000 + Math.random() * 9000);

                    let transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.ADMIN_EMAIL,
                            pass: process.env.ADMIN_PASSWORD
                        }
                    })

                    let emailTemplate = {
                        from: `"Rahul Nikam" <codewithrahulnikam@gmail.com>`,
                        to: `${userEmail}`,
                        subject: `Verification code is ${OTP}`,
                        text: "",
                        html: `${OTP}`
                    }

                    // Generating HASH OTP
                    let mewOTP = OTP.toString();
                            let salt = genSaltSync(10);
                            let hashedOTP = hashSync(mewOTP, salt)

                    let sendEmail = transporter.sendMail(emailTemplate, (err, success) => {
                        if(err){
                            console.log(err)
                        }
                        else{

                            connection.query('UPDATE healthaura_users SET userOTP = ? WHERE userEmail = ?', [hashedOTP, userEmail],(err, successful) => {
                                if(err){
                                    res.render('change-password.hbs', { title: 'Change Password', message: 'Some error occurred please try again' })
                            
                                }
                                else{
                                    res.render('otp.hbs', { title: 'Change Password', userEmail: userEmail })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}


exports.userOTP = (req,res) => {
    pool.getConnection((err,connection) => {
        if(err) throw err;
        let userEmail = req.params.userEmail;
        let userEnteredOTP = req.body.userOTP;

        console.log(userEmail + " " + userEnteredOTP);

        connection.query('SELECT userOTP FROM healthaura_users WHERE userEmail = ?', [userEmail], (err,data) => {
            // const checkPassword = compareSync(userPassword, data[0].userPassword);
            if(err){
                res.render('change-password.hbs', { title: 'Change Password', message: 'Some error occurred please try again' })
            }
            const checkOTP = compareSync(userEnteredOTP, data[0].userOTP);
            if(checkOTP){
            
                res.render('main-pass-change.hbs', {userEmail: userEmail, title: 'Change Password'})
            }
            else{
                res.render('otp.hbs', { title: 'Change Password', userEmail: userEmail, message: 'Incorrect OTP' })
            }
        })
    })
}
