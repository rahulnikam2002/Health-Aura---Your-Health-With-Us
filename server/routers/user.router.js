const router = require('express').Router();
const userController = require("../controllers/user.controller")
const { tokenValidation } = require('../../auth/token.validation')
const { checkLogin } = require('../../auth/check.login')


router.get('/',tokenValidation, userController.userProfilePage)

router.get('/update/userdata/:userName/city', tokenValidation, userController.updateUserCity);
router.get("/contact-admin/send/message", tokenValidation, userController.sendMsgToAdmin)
router.get("/report/bug", tokenValidation, userController.reportBugEmail)

module.exports = router;