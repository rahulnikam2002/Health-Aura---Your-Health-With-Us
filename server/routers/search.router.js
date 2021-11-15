const router = require('express').Router()
const searchController = require('../controllers/search.controller.js')

router.get('/hospital/city', searchController.searchHospitalByCity);
router.get('/hospital/hospital', searchController.searchHospital);
router.get('/advance-search', searchController.advanceSearch);

module.exports = router;