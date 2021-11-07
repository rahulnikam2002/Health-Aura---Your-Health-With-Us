const router = require('express').Router();
const adminController = require("../controllers/admin.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')
const { isAdmin } = require('../../auth/check.isadmin')

router.get('/', isAdmin, adminController.adminDashboard);

module.exports = router;