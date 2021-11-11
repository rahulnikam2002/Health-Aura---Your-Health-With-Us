const router = require('express').Router();
const userController = require("../controllers/user.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')


router.get('/',tokenValidation, userController.userProfilePage)

module.exports = router;