const router = require('express').Router()
const passwordController = require('../controllers/passwordChange.controller')
const { tokenValidation } = require('../../auth/token.validation')

router.get('/change-password', passwordController.changePassPage)
router.get('/password', passwordController.showOtpPage)
router.post('/password/:userEmail', passwordController.userOTP)
router.post('/new-password/:userEmail', passwordController.userNewPassword)

module.exports = router;