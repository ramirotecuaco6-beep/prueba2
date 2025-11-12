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
// Rutas
router.get("/ruta-de-pruebas", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
router.post("/crear", ArticuloController.crear);
router.get("/aticulos/:ultimos?", ArticuloController.listar);
router.get("/aticulo/:id", ArticuloController.mostrarUno);
router.delete("/aticulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);

// Ruta para subir la imagen
router.post("/subir-imagen/:id", subidas.single("archivo0"), ArticuloController.subirImagen);

/// Raura para mostrar imagen 
router.get("/imagen/:fichero", ArticuloController.mostrarImagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);




module.exports = router;
