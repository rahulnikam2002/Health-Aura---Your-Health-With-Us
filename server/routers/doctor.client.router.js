const router = require('express').Router();
const clientDoctorController = require('../controllers/client.doctor.controllers')

router.get('/', clientDoctorController.doctorListingPage);
router.get('/:id/:doctorName', clientDoctorController.singleDoctorPage);
router.get('/search', clientDoctorController.searchDoctor);

module.exports = router;