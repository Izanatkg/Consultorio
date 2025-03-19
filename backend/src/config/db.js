const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Verificar la conexión y mostrar información de la base de datos
        const db = mongoose.connection;
        const collections = await db.db.listCollections().toArray();
        console.log('\nInformación de la base de datos:');
        console.log('- Base de datos:', db.db.databaseName);
        console.log('- Colecciones:', collections.map(c => c.name));
        
        // Verificar la colección de pacientes
        const patientCollection = db.collection('patients');
        const patientCount = await patientCollection.countDocuments();
        console.log('- Número de pacientes:', patientCount);

        console.log('\nConexión a MongoDB Atlas establecida correctamente');
    } catch (error) {
        console.error('\nError al conectar a MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;