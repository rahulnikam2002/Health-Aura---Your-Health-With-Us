const router = require('express').Router();
const authController = require("../controllers/auth.controller")

router.get('/login', authController.loginPage);

router.get('/register', authController.registerPage)
router.post('/register', authController.registerUser)

module.exports = router;