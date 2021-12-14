const router = require('express').Router();
const clientDoctorController = require('../controllers/client.doctor.controllers')

router.get('/', clientDoctorController.doctorListingPage)

module.exports = router;