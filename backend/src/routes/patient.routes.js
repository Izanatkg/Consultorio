const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middleware/auth');

// Log para debugging
router.use((req, res, next) => {
    console.log('\n=== Patient Routes ===');
    console.log('URL:', req.url);
    console.log('Método:', req.method);
    next();
});

// Rutas protegidas con autenticación
router.use(authMiddleware);

// CRUD de pacientes
router.get('/', patientController.getPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;
