const mySql = require("mysql");
const { verify } = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodeMailer = require('nodeMailer');

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.userProfilePage = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      let userToken = req.cookies.userToken;
      verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.redirect("/");
        } else {
          userEmail = decoded.result;
          connection.query(
            "SELECT * FROM healthaura_users WHERE userEmail = ?",
            [userEmail],
            (err, User) => {
              userImg = User[0].userImg;
              userCity = User[0].userCity;
              pageTitle = User[0].userName;
              console.log(userImg);
              if (userImg.length == 0) {
                if (userCity.length == 0) {
                  res.render("user-profile.hbs", {
                    User,
                    authenticated: true,
                    noProfilePic: true,
                    noCity: true,
                    title: `${pageTitle} | HealthAura`,
                  });
                } else {
                  res.render("user-profile.hbs", {
                    User,
                    authenticated: true,
                    noProfilePic: true,
                    userCity: true,
                    title: `${pageTitle} | HealthAura`,
                  });
                }
              } else {
                if (userCity.length == 0) {
                  res.render("user-profile.hbs", {
                    User,
                    authenticated: true,
                    profilePic: true,
                    noCity: true,
                    title: `${pageTitle} | HealthAura`,
                  });
                } else {
                  res.render("user-profile.hbs", {
                    User,
                    authenticated: true,
                    profilePic: true,
                    userCity: true,
                    title: `${pageTitle} | HealthAura`,
                  });
                }
              }
            }
          );
        }
      });
    }
  });
};

exports.updateUserCity = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const userToken = req.cookies.userToken;
    if (userToken) {
      verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.redirect("/");
        }
        else{
            userEmail = decoded.result;
            connection.query('SELECT * FROM healthaura_users WHERE userEmail = ?', [userEmail], (err, userData) => {
                if(err){
                    res.redirect('/')
                }
                if(userData.length == 0){
                    res.redirect('/')
                }
                else{
                    // userData[0].userName
                    console.log(req.params.userName);

                    if(userData[0].userName == req.params.userName){
                        connection.query('update healthaura_users set userCity = ? where userName = ?', [req.query.userCity, userData[0].userName], (err,updatedUser) => {
                            if(err){
                                res.redirect('/')
                            }
                            else{
                                res.redirect('/user')
                            }
                        })
                    }
                    else{
                        res.redirect('/')
                    }
                }
            })
        }
      });
    } else {
      res.redirect("/");
    }
  });
};

exports.sendMsgToAdmin = (req,res) => {
  pool.getConnection((err,connection) => {
    if(err) throw err;
    const userToken = req.cookies.userToken;
    if(userToken){
    verify(userToken, process.env.SECRET_KEY, (err,decoded) => {
      if(err){
        res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:true, error: "Your Token has been expired, Try to login and than try again."})
            console.log(false)
      }
      else{
        const userEmail = decoded.result;
        connection.query("select * from healthaura_users where userEmail = ?", [userEmail], (err, userData) => {
          if(err){
            res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:true, error: "Your Token has been expired, Try to login and than try again."})
            console.log(false)
          }
          else{
            const userEmail = decoded.result;
            let transporter = nodeMailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
              }
            })
    
            let template = {
              from: `${userData[0].userName} <${userEmail}>`,
              to: 'codewithrahulnikam@gmail.com',
              subject: `${userData[0].userName} wants to contact you - HealthAura`,
              text: `${userData[0].userName} saying - ${req.query.userMessageToAdmin}`
            }

            const sendEmailToAdmin = transporter.sendMail(template, (err, successEmailSent) => {
              if(err){
                res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:"Your Token has been expired, Try to login and than try again."})
                console.log(false)
              }
              else{
                res.render("message-page.hbs", {title: "Contact Admin | HealthAura", successEmailSent:"Your message has been sent successfully to Admin, He will contact you soon!"})
                console.log(true)

              }
            })
          }
        })
      }
    })
    }
    else{
      res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:"Your Token has been experied, Try to login and than try again."})

    }
  })
}





exports.reportBugEmail = (req,res) => {
  pool.getConnection((err,connection) => {
    if(err) throw err;
    const userToken = req.cookies.userToken;
    if(userToken){
    verify(userToken, process.env.SECRET_KEY, (err,decoded) => {
      if(err){
        res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:true, error: "Your Token has been expired, Try to login and than try again."})
            console.log(false)
      }
      else{
        const userEmail = decoded.result;
        connection.query("select * from healthaura_users where userEmail = ?", [userEmail], (err, userData) => {
          if(err){
            res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:true, error: "Your Token has been expired, Try to login and than try again."})
            console.log(false)
          }
          else{
            const userEmail = decoded.result;
            let transporter = nodeMailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
              }
            })
    
            let template = {
              from: `${userData[0].userName} <${userEmail}>`,
              to: 'codewithrahulnikam@gmail.com',
              subject: `${userData[0].userName} Reported a bug - HealthAura`,
              text: `${userData[0].userName} saying - ${req.query.reportBugMsg}`
            }

            const sendEmailToAdmin = transporter.sendMail(template, (err, successEmailSent) => {
              if(err){
                res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:"Your Token has been expired, Try to login and than try again."})
                console.log(false)
              }
              else{
                res.render("message-page.hbs", {title: "Contact Admin | HealthAura", successEmailSent:"Your Repoerted bug message has been successfully sent to HealthAura developers team, This will be fixed as soon as possible."})
                console.log(true)

              }
            })
          }
        })
      }
    })
    }
    else{
      res.render("message-page.hbs", {title: "Contact Admin | HealthAura", error:"Your Token has been expired, Try to login and than try again."})

    }
  })
}