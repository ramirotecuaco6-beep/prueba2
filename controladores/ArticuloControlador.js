const fs= require('fs')
const path=  require('path')
const {validarArticulo} = require('../helpers/Validar')
const Articulo = require("../modelos/Articulo");
const { error } = require('console');

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador"
    });
};

const curso = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando ");
    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "Manuel Hernandez Herrera",
            url: "manuelhernandezweb.com.mx/master-react-pro"
        },
        {
            curso: "Master en React Native",
            autor: "Manuel Hernandez Herrera",
            url: "manuelhernandezweb.com.mx/master-react-native"
        }
    ]);
};

//// Método de creación

const crear = async (req, res) => {
    try {
        let parametros = req.body;

        if (!parametros.titulo || !parametros.contenido) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Faltan datos por enviar"
            });
        }

        await validarArticulo(parametros);

        const articulo = new Articulo(parametros);
        const articuloGuardado = await articulo.save();

        return res.status(200).json({
            status: "OK",
            articulo: articuloGuardado,
            mensaje: "Artículo creado con éxito"
        });
    } catch (error) {
        console.error("Error al guardar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "No se pudo guardar el artículo"
        });
    }
};


/* Metodo para conseguir articulos */
const listar = async (req, res) => {
    // Simular una espera de 5 segundos
    setTimeout(async () => {
        try {
            // Realizar la consulta de los artículos y limitar el número de resultados
            const articulos = await Articulo.find({}).sort({ fecha: -1 }).exec();
            
            // Verificar si no se encontraron artículos
            if (!articulos || articulos.length === 0) {
                return res.status(404).json({
                    status: "Error",
                    mensaje: "No se encontraron artículos"
                });
            }

            // Devolver los artículos encontrados
            return res.status(200).json({
                status: "OK",
                parametro: req.params.ultimos, 
                contador: articulos.length,
                articulos: articulos
            });
        } catch (error) {
            // Manejar cualquier error que ocurra
            console.error("Error al obtener los artículos:", error);
            return res.status(500).json({
                status: "Error",
                mensaje: "Hubo un problema al obtener los artículos"
            });
        }
    }, 1000);
};


/*metodo pasa solo mostrar un elemento de la base datos */

const mostrarUno = async (req, res) => {
    try {
        // Recoger un ID por la URL
        let id = req.params.id;

        // Buscar el artículo por su ID
        const articulo = await Articulo.findById(id);

        // Si no se encuentra el artículo
        if (!articulo) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se ha encontrado el artículo"
            });
        }

        // Si se encuentra el artículo, devolverlo
        return res.status(200).json({
            status: "OK",
            articulo: articulo
        });
    } catch (error) {
        console.error("Error al buscar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al buscar el artículo"
        });
    }
};

/*Metodo de borrar elementos */
const borrar = async (req, res) => {
    try {
        let articulo_id = req.params.id;

        // Buscar y borrar el artículo por su ID
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        // Si no se encuentra el artículo
        if (!articuloBorrado) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontró el artículo para borrar"
            });
        }

        // Si se encuentra y se borra el artículo correctamente
        return res.status(200).json({
            status: "OK",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado con éxito"
        });
    } catch (error) {
        console.error("Error al borrar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al borrar el artículo"
        });
    }
};



/*Metodo para editar datos */
const editar = async (req, res) => {
    try {
        // Recoger id del artículo a editar
        let articulo_id = req.params.id;
        
        // Recoger datos del body 
        let parametros = req.body;
        
        /* Validar datos */
        validarArticulo(res, parametros)
        // Buscar y actualizar el artículo
        const articuloActualizado = await Articulo.findOneAndUpdate({ _id: articulo_id }, req.body, { new: true });

        // Si no se encuentra el artículo
        if (!articuloActualizado) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }

        // Si se encuentra y se actualiza el artículo correctamente
        return res.status(200).json({
            status: "OK",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al editar el artículo:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un error al editar el artículo"
        });
    }
};


/*Metodo para subir imagen  */

const subirImagen = async (req, res) => {
    try {
        // Verificar si el archivo se ha cargado correctamente
        if (!req.file) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Petición inválida: No se ha proporcionado ningún archivo"
            });
        }

        // Obtener el nombre del archivo y su extensión
        const nombreArchivo = req.file.originalname;
        const archivoSplit = nombreArchivo.split(".");
        const extension = archivoSplit[archivoSplit.length - 1];

        // Verificar si la extensión del archivo es válida
        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
            // Borrar el archivo no válido
            fs.unlink(req.file.path, (error) => {
                if (error) {
                    console.error("Error al borrar el archivo:", error);
                }
            });
            // Responder con un mensaje de error
            return res.status(400).json({
                status: "Error",
                mensaje: "La extensión del archivo no es válida"
            });
        } else {
            // Recoger el ID del artículo a editar
            const articulo_id = req.params.id;

            // Buscar el artículo por su ID
            const articulo = await Articulo.findById(articulo_id);

            // Verificar si se encontró el artículo
            if (!articulo) {
                return res.status(404).json({
                    status: "Error",
                    mensaje: "No se encontró el artículo para actualizar"
                });
            }

            // Actualizar el artículo con la nueva imagen
            articulo.imagen = req.file.filename;

            // Guardar el artículo actualizado en la base de datos
            const articuloActualizado = await articulo.save();

            // Devolver respuesta con el artículo actualizado
            return res.status(200).json({
                status: "OK",
                articulo: articuloActualizado,
                mensaje: "Artículo actualizado con éxito"
            });
        }
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al subir la imagen"
        });
    }
};

const mostrarImagen = async (req, res) => {
    try {
        let fichero = req.params.fichero;
        let ruta_fisica = './img/articulos/' + fichero;

        // Comprobar si el archivo existe
        fs.stat(ruta_fisica, (error, stats) => {
            if (error || !stats.isFile()) {
                return res.status(404).json({
                    status: "Error",
                    mensaje: "No se encontró la imagen"
                });
            } else {
                // Si el archivo existe, enviarlo como respuesta
                return res.sendFile(path.resolve(ruta_fisica));
            }
        });
    } catch (error) {
        console.error("Error al mostrar la imagen:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al mostrar la imagen"
        });
    }
};

const buscador = async (req, res) => {
    try {
        // Extraer la cadena de búsqueda
        let busqueda = req.params.busqueda;

        // Realizar la búsqueda utilizando expresiones regulares insensibles a mayúsculas y minúsculas
        const articulosEncontrados = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } },
            ]
        }).sort({ fecha: -1 }).exec();

        // Verificar si se encontraron artículos
        if (!articulosEncontrados || articulosEncontrados.length === 0) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontraron artículos"
            });
        }

        // Devolver los artículos encontrados
        return res.status(200).json({
            status: "OK",
            articulos: articulosEncontrados,
            mensaje: "Artículos encontrados"
        });
    } catch (error) {
        console.error("Error al buscar artículos:", error);
        return res.status(500).json({
            status: "Error",
            mensaje: "Hubo un problema al buscar artículos"
        });
    }
};


module.exports = {
    prueba,
    curso,
    crear,
    listar,
    mostrarUno,
    borrar,
    editar,
    subirImagen,
    mostrarImagen,
    buscador
};