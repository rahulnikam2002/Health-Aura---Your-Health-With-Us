const router = require('express').Router();
const adminController = require("../controllers/admin.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')
const { isAdmin } = require('../../auth/check.isadmin')


const multer = require('multer');
const path = require("path");


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage })



router.get('/', isAdmin, adminController.adminDashboard);
router.get('/add-new-hospital', isAdmin, adminController.addNewHospitalPage);
router.get('/all-hospitals', isAdmin, adminController.allHospitalPage);

const cpUpload = upload.fields([{ name: 'multipleImgs', maxCount: 5 }, { name: 'featuredImg'}])

router.post('/add-new-hospital', isAdmin, cpUpload, adminController.addNewHospital);


router.get('/all-users', isAdmin, adminController.allUsersPage)

module.exports = router;



