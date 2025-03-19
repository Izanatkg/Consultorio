const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Crear una nueva cita
exports.createAppointment = async (req, res) => {
    try {
        console.log('=== Creando nueva cita ===');
        console.log('Datos recibidos:', req.body);

        const { patientId, date, time, reason } = req.body;

        // Verificar que el paciente existe
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const appointment = new Appointment({
            patient: patientId,
            date,
            time,
            reason,
            status: 'Programada'
        });

        const savedAppointment = await appointment.save();
        
        // Poblar los datos del paciente en la respuesta
        const populatedAppointment = await Appointment.findById(savedAppointment._id)
            .populate('patient', 'name phone email');

        console.log('Cita creada exitosamente:', populatedAppointment);
        res.status(201).json(populatedAppointment);
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(400).json({ 
            message: 'Error al crear la cita',
            error: error.message 
        });
    }
};

// Obtener todas las citas
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name phone email')
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una cita por ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name phone email');
        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una cita
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('patient', 'name phone email');

        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una cita
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener citas por paciente
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId })
            .populate('patient', 'name phone email')
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
