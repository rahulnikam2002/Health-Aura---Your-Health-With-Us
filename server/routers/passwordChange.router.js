const router = require('express').Router()
const passwordController = require('../controllers/passwordChange.controller')
const { tokenValidation } = require('../../auth/token.validation')

router.get('/change-password', passwordController.changePassPage)

module.exports = router;