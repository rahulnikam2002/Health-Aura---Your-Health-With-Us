const mySql = require('mysql')
const nodeMailer = require('nodemailer')
const { genSaltSync, compareSync, hashSync } = require('bcrypt')
const validator = require('validator')
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
                        subject: `Verification code for changing password`,
                        text: "",
                        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:90%;padding:20px 0">
                          <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">HealthAura</a>
                          </div>
                          <p style="font-size:1.1em">Hi,</p>
                          <p>Below is your 4 digit verification code for changing password, Make sure you do not share this OTP with anyone.</p>
                          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                          <p style="font-size:0.9em;">Regards,<br />HealthAura</p>
                          <hr style="border:none;border-top:1px solid #eee" />
                          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>HealthAura</p>
                            <p>Ratnagiri, Maharashtra</p>
                            <p>India</p>
                          </div>
                        </div>
                      </div>`
                    }

                    // Generating HASH OTP
                    let mewOTP = OTP.toString();
                    let salt = genSaltSync(10);
                    let hashedOTP = hashSync(mewOTP, salt)

                    let sendEmail = transporter.sendMail(emailTemplate, (err, success) => {
                        if (err) {
                            console.log(err)
                        }
                        else {

                            connection.query('UPDATE healthaura_users SET userOTP = ? WHERE userEmail = ?', [hashedOTP, userEmail], (err, successful) => {
                                if (err) {
                                    res.render('change-password.hbs', { title: 'Change Password', message: 'Some error occurred please try again' })

                                }
                                else {
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


exports.userOTP = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        let userEmail = req.params.userEmail;
        let userEnteredOTP = req.body.userOTP;

        console.log(userEmail + " " + userEnteredOTP);

        connection.query('SELECT userOTP FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, data) => {
            // const checkPassword = compareSync(userPassword, data[0].userPassword);
            if (err) {
                res.render('change-password.hbs', { title: 'Change Password', message: 'Some error occurred please try again' })
            }
            const checkOTP = compareSync(userEnteredOTP, data[0].userOTP);
            if (checkOTP) {

                res.render('main-pass-change.hbs', { userEmail: userEmail, title: 'Change Password' })
            }
            else {
                res.render('otp.hbs', { title: 'Change Password', userEmail: userEmail, message: 'Incorrect OTP' })
            }
        })
    })
}


exports.userNewPassword = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        let userEmail = req.params.userEmail;
        let userPassword = req.body.userNewPassword;
        let strongPass = validator.isStrongPassword(userPassword);
        if (strongPass) {
            let salt = genSaltSync(10);
            let newHashedPassword = hashSync(userPassword, salt);
            connection.query('UPDATE healthaura_users SET userPassword = ? WHERE userEmail = ?', [newHashedPassword, userEmail], (err, successful) => {
                if (err) {
                    res.render('change-password.hbs', { title: 'Change Password', message: 'Some error occurred please try again' })
                }
                else {
                    res.clearCookie('userToken')
                    res.render('success-pass-change-page.hbs')
                }
            })
        }
        else {
            res.render('main-pass-change.hbs', { userEmail: userEmail, title: 'Change Password', message: 'Enter a strong password' })
        }
    })
}