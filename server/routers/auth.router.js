const router = require('express').Router();
const homeController = require("../controllers/auth.controller")

router.get('/login', homeController.loginPage);

module.exports = router;