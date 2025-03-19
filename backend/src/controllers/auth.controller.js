const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        console.log('=== Registro de usuario ===');
        const { username, password } = req.body;
        console.log('Username recibido:', username);

        // Verificar si el usuario ya existe
        let user = await User.findOne({ username });
        if (user) {
            console.log('Usuario ya existe:', username);
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        user = new User({
            username,
            password
        });

        // Guardar usuario
        await user.save();
        console.log('Usuario creado:', user._id);

        // Generar token
        const token = jwt.sign(
            { userId: user._id },
            'tu_secreto_jwt',
            { expiresIn: '24h' }
        );
        console.log('Token generado para usuario:', user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        console.log('=== Login de usuario ===');
        const { username, password } = req.body;
        console.log('Intento de login para:', username);

        // Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Usuario no encontrado:', username);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Contraseña incorrecta para usuario:', username);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: user._id },
            'tu_secreto_jwt',
            { expiresIn: '24h' }
        );
        console.log('Login exitoso para usuario:', user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};
