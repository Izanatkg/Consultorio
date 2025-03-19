const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createTestUser = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/consultorio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB');

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username: 'admin' });
        if (existingUser) {
            console.log('El usuario admin ya existe');
            return;
        }

        // Crear usuario de prueba
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = new User({
            username: 'admin',
            password: hashedPassword
        });

        await user.save();
        console.log('Usuario admin creado exitosamente');
        console.log('Username: admin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createTestUser();
