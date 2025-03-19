const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const checkDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/consultorio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB');

        // Verificar pacientes existentes
        const patients = await Patient.find();
        console.log('Pacientes encontrados:', patients.length);

        if (patients.length === 0) {
            // Crear un paciente de prueba
            const testPatient = new Patient({
                name: 'Paciente de Prueba',
                age: 30,
                gender: 'M',
                phone: '555-1234',
                email: 'test@example.com',
                address: 'Calle de Prueba 123'
            });

            await testPatient.save();
            console.log('Paciente de prueba creado:', testPatient);
        } else {
            console.log('Pacientes en la base de datos:', JSON.stringify(patients, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkDatabase();
