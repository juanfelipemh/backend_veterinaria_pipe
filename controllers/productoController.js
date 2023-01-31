import Producto from "../models/ProductoModel.js";


export const obtenerProducto = async (req, res) => {
    try {
        const respuesta = await Producto.findAll({
            attributes: ["id", "UUID", "titulo", "descripcion", "precio"]
        })
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const obtenerUnProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!producto){
            return res.status(404).json({msg: "Producto no existe"})
        }
        const respuesta = await Producto.findOne({
            attributes: ["id", "UUID", "titulo", "descripcion", "precio"],
            where: {
                id: producto.id
            }
        })
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const crearProducto = async (req, res) => {
    try {
        const { titulo, descripcion, precio } = req.body;
        const nuevoProducto = await Producto.create({
            titulo: titulo,
            descripcion: descripcion,
            precio: precio,
            usuarioId: req.usuarioId
        })
        res.status(201).json(nuevoProducto)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!producto){
            return res.status(404).json({msg: "Producto no existe"})
        };
        const { titulo, descripcion, precio } = req.body;
        await Producto.update({
            titulo: titulo,
            descripcion: descripcion,
            precio: precio
        }, {where: {
            id: producto.id
        }})
        res.status(200).json({msg: "Producto actualizado"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!producto){
            return res.status(404).json({msg: "Producto no existe"})
        };
        await Producto.destroy({
            where: {
            id: producto.id
        }})
        res.status(200).json({msg: "Producto eliminado"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}