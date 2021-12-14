const router = require('express').Router();
const adminDoctorController = require("../controllers/admin.doctor.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')
const { isAdmin } = require('../../auth/check.isadmin')
const multer = require('multer');
const path = require("path");

let storage = multer.diskStorage({
    destination: function(req,file,callBack) {
        callBack(null, 'public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

let upload = multer({ storage: storage })

// let doctorImageUpload = upload.single('featuredImg');

router.get('/add/doctor', isAdmin, adminDoctorController.addDoctorPage);
router.post('/add/doctor', isAdmin, upload.single('featuredImg'), adminDoctorController.addDoctor);


module.exports = router;