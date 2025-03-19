const Patient = require('../models/Patient');

// Crear un nuevo paciente
exports.createPatient = async (req, res) => {
    try {
        console.log('=== Creando nuevo paciente ===');
        console.log('Datos recibidos:', req.body);

        // Validación manual de campos requeridos
        const requiredFields = {
            name: 'nombre',
            age: 'edad',
            gender: 'género',
            phone: 'teléfono'
        };

        const missingFields = [];
        for (const [field, fieldName] of Object.entries(requiredFields)) {
            if (!req.body[field]) {
                missingFields.push(fieldName);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
            });
        }

        // Validar el género
        const validGenders = ['M', 'F', 'Otro'];
        if (!validGenders.includes(req.body.gender)) {
            return res.status(400).json({
                message: 'El género debe ser uno de los siguientes valores: M, F, Otro'
            });
        }

        // Validar la edad
        const age = parseInt(req.body.age);
        if (isNaN(age) || age < 0 || age > 150) {
            return res.status(400).json({
                message: 'La edad debe ser un número válido entre 0 y 150'
            });
        }
        req.body.age = age; // Asegurar que la edad sea un número

        const patient = new Patient(req.body);
        const savedPatient = await patient.save();
        console.log('Paciente creado exitosamente:', savedPatient);
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(400).json({ 
            message: 'Error al crear el paciente',
            error: error.message 
        });
    }
};

// Obtener todos los pacientes
exports.getPatients = async (req, res) => {
    try {
        console.log('\n=== GET /api/patients ===');
        console.log('Usuario autenticado:', req.user?._id);
        
        const patients = await Patient.find().lean();
        console.log(`Se encontraron ${patients?.length} pacientes`);
        
        res.json(patients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener un paciente por ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un paciente
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.json(patient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un paciente
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};