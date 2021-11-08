const router = require('express').Router();
const adminController = require("../controllers/admin.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')
const { isAdmin } = require('../../auth/check.isadmin')

router.get('/', isAdmin, adminController.adminDashboard);
router.get('/add-new-hospital', isAdmin, adminController.addNewHospitalPage);
router.post('/add-new-hospital', isAdmin, adminController.addNewHospital);


module.exports = router;