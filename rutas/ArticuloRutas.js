const express = require("express");
const router = express.Router();
const ArticuloController = require("../controladores/ArticuloControlador");
const multer = require('multer');

// Configuración de almacenamiento para multer
const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './img/articulos/');
    },
    filename: function(req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({ storage: almacenamiento });

// ✅ RUTAS CORREGIDAS
router.get("/ruta-de-pruebas", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);        // ✅ CORREGIDO: "articulos"
router.get("/articulo/:id", ArticuloController.mostrarUno);           // ✅ CORREGIDO: "articulo"
router.delete("/articulo/:id", ArticuloController.borrar);            // ✅ CORREGIDO: "articulo"
router.put("/articulo/:id", ArticuloController.editar);
router.post("/subir-imagen/:id", subidas.single("archivo0"), ArticuloController.subirImagen);
router.get("/imagen/:fichero", ArticuloController.mostrarImagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;