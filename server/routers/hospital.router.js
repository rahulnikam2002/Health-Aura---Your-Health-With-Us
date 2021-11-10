const router = require('express').Router();
const hospitalController = require("../controllers/hospital.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')
const { isAdmin } = require('../../auth/check.isadmin')


router.get('/', hospitalController.allHospitalListing);
router.get('/:title', hospitalController.singleHospitalPage);




module.exports = router;



