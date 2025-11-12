const mongoose = require('mongoose');
require('dotenv').config();

const conexion = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" Conectado correctamente a MongoDB Atlas");
  } catch (error) {
    console.error(" Error al conectar a la base de datos:", error.message);
    throw new Error("No se puede conectar a la base de datos");
  }
};

module.exports = { conexion };
