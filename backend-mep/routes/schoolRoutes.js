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

const { 
  getPropuestas, 
  addPropuesta, 
  updatePropuesta, 
  deletePropuesta 
} = require('../controllers/propuestaController');

router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.post('/', verifyToken, validateSchool, createSchool);
router.put('/:id', verifyToken, validateSchool, updateSchool);
router.delete('/:id', verifyToken, deleteSchool);

// Propuestas routes (nested under school ID)
router.get('/:id/propuestas', getPropuestas);
router.post('/:id/propuestas', verifyToken, addPropuesta);
router.put('/:id/propuestas/:idNecesidad', verifyToken, updatePropuesta);
router.delete('/:id/propuestas/:idNecesidad', verifyToken, deletePropuesta);

module.exports = router;