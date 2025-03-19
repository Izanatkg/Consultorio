const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        console.log('\n=== Auth Middleware ===');
        console.log('Headers recibidos:', req.headers);
        
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No se proporcionó token');
            return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
        }

        console.log('Token a verificar:', token);
        
        try {
            // Verify token
            const decoded = jwt.verify(token, 'tu_secreto_jwt');
            console.log('Token decodificado:', decoded);
            
            // Get user from token
            const user = await User.findById(decoded.userId);
            if (!user) {
                console.log('Usuario no encontrado para el token');
                return res.status(401).json({ message: 'No autorizado - Usuario no encontrado' });
            }
            console.log('Usuario encontrado:', user._id);

            req.user = user;
            req.token = token;
            next();
        } catch (jwtError) {
            console.log('Error al verificar el token:', jwtError.message);
            return res.status(401).json({ message: 'No autorizado - Token inválido' });
        }
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(401).json({ message: 'Error de autenticación' });
    }
};
