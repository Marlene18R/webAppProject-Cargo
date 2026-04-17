const express = require('express');
const {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} = require('../controllers/schoolController');
const { verifyToken } = require('../middleware/auth');
const { validateSchool } = require('../middleware/validation');
const router = express.Router();

router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.post('/', verifyToken, validateSchool, createSchool);
router.put('/:id', verifyToken, validateSchool, updateSchool);
router.delete('/:id', verifyToken, deleteSchool);

module.exports = router;