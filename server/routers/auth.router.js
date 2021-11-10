const router = require('express').Router();
const authController = require("../controllers/auth.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')

router.get('/login',checkLogin, authController.loginPage);
router.post('/login', authController.loginUser);

router.get('/register', checkLogin, authController.registerPage);
router.post('/register', authController.registerUser);

router.get('/logout', authController.logoutUser)

module.exports = router;