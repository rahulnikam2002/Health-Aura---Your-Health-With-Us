const mySql = require("mysql");
const { verify } = require("jsonwebtoken");
require("dotenv").config();

// DataBase Configuration and Connecting =>
const pool = mySql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.addDoctorPage = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("select * from healthaura_doctors", (err, allDoctors) => {
      if (err) {
        res.redirect("/dashboard/all-hospitals");
      } else {
        const userToken = req.cookies.userToken;
        if (userToken) {
          verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
              res.redirect("/auth/login/");
            } else {
              let userEmail = decoded.result;
              connection.query(
                `SELECT * FROM healthaura_users WHERE userEmail = ?`,
                [userEmail],
                (err, admin) => {
                  if (err) {
                    res.redirect("/");
                    console.log(err);
                  } else {
                    // const hospitalNameFromDB = hospitalData[0].hospitalName;
                    connection.query(
                      "SELECT * FROM healthaura_doctors",
                      (err, allDoctorsData) => {
                        console.log(admin[0].userImg);
                        let userProfileImg = admin[0].userImg;
                        if (userProfileImg.length == 0) {
                          res.render("add-doctor.hbs", {
                            allDoctors,
                            allDoctorsData,
                            admin,
                            title: "Add New Doctor | HealthAura",
                            noProfileImg: true,
                          });
                        } else {
                          res.render("add-doctor.hbs", {
                            allDoctors,
                            allDoctorsData,
                            admin,
                            title: "Add New Doctor | HealthAura",
                            ProfileImg: true,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    });
  });
};

exports.addDoctor = (req, res) => {
  const {
    doctorName,
    doctorPhone,
    doctorAddress,
    doctorCity,
    mainSpeciality,
    totalPatients,
    totalExperience,
    totalRating,
    doctorBiography,
    specialities,
  } = req.body;
  const doctorImage = req.file.filename;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO healthaura_doctors SET doctorName = ?, mainSpeciality = ?, doctorCity = ?, doctorNumber = ?, totalPatients = ?, totalExperience = ?, totalRating = ?, doctorBiography = ?, specialities = ?, doctorAddress = ?, doctorImage = ?",
      [
        doctorName,
        mainSpeciality,
        doctorCity,
        doctorPhone,
        totalPatients,
        totalExperience,
        totalRating,
        doctorBiography,
        specialities,
        doctorAddress,
        doctorImage,
      ],
      (err, doctorAdded) => {
        if (err) {
          res.render("add-doctor.hbs", {
            message: "Something went wrong! Please try again.",
          });
        } else {
          res.redirect("/dashboard/doctor/all-doctors");
        }
      }
    );
  });
};

exports.allDoctorsPage = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM healthaura_doctors", (err, allDoctors) => {
      if (err) {
        res.render("dashboard-all-doctors.hbs", {
          title: "All doctors | HealthAura",
          message: "Something went wrong",
        });
      } else {
        res.render("dashboard-all-doctors.hbs", { allDoctors,
          title: "All doctors | HealthAura",
        });
      }
    });
  });
};

exports.deleteDoctor = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM healthaura_doctors WHERE id = ?", [req.params.id], (err, deletedDoctor) => {
      if (err) {
        res.render("dashboard-all-doctors.hbs", {
          title: "All doctors | HealthAura",
          message: "Something went wrong",
        });
      } else {
        res.redirect("/dashboard/doctor/all-doctors");
      }
    });
  });
};

exports.editDoctor = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM healthaura_doctors WHERE doctorName = ?", [req.params.doctorName], (err, singleDoctorInfo) => {
      if (err) {
        res.render("edit-doctor.hbs", {
          title: "All doctors | HealthAura",
          message: "Something went wrong",
        });
      } else {
        res.render("edit-doctor.hbs", {singleDoctorInfo,
          title: `Editing ${req.params.doctorName} | HealthAura`
        });
      }
    });
  });
};


exports.updatingDoctor = (req, res) => {
    const {
      doctorName,
      doctorPhone,
      doctorAddress,
      doctorCity,
      mainSpeciality,
      totalPatients,
      totalExperience,
      totalRating,
      doctorBiography,
      specialities,
    } = req.body;
    const doctorImage = req.file.filename;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "UPDATE healthaura_doctors SET doctorName = ?, mainSpeciality = ?, doctorCity = ?, doctorNumber = ?, totalPatients = ?, totalExperience = ?, totalRating = ?, doctorBiography = ?, specialities = ?, doctorAddress = ?, doctorImage = ? WHERE id = ?",
        [
          doctorName,
          mainSpeciality,
          doctorCity,
          doctorPhone,
          totalPatients,
          totalExperience,
          totalRating,
          doctorBiography,
          specialities,
          doctorAddress,
          doctorImage,
          req.params.id
        ],
        (err, doctorAdded) => {
          if (err) {
            res.render("add-doctor.hbs", {
              message: "Something went wrong! Please try again.",
            });
          } else {
            res.redirect ("/dashboard/doctor/all-doctors");
          }
        }
      );
    });
  };
  