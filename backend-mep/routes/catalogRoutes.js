const express = require('express');
const {
  getMunicipalities,
  getDonationTypes,
  getEducationalLevels,
  getDashboardStats,
  getGlobalProgress,
} = require('../controllers/catalogController');
const router = express.Router();

router.get('/municipalities', getMunicipalities);
router.get('/donation-types', getDonationTypes);
router.get('/educational-levels', getEducationalLevels);
router.get('/dashboard/stats', getDashboardStats);
router.get('/global-progress', getGlobalProgress);

module.exports = router;