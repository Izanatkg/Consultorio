const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const authMiddleware = require('../middleware/auth');

// Proteger rutas
router.use(authMiddleware);

// Ruta de exportación
router.get('/patients', exportController.exportPatients);

module.exports = router;