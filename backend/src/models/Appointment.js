const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Programada', 'Completada', 'Cancelada'],
        default: 'Programada'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Exportar el modelo
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
