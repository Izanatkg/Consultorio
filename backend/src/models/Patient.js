const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F', 'Otro']
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    medicalHistory: {
        type: String,
        required: false
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    nextAppointment: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);