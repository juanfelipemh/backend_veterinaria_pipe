import Producto from "../models/ProductoModel.js";
import Mascota from "../models/MascotaModel.js";
import Afiliacion from "../models/AfiliacionModel.js";
import Usuario from "../models/UsuarioModel.js";
import { Model, Op } from "sequelize";

export const obtenerSolicitudes = async (req, res) => {
    try {
        let respuesta;
        if (req.rol === "admin") {
            respuesta = await Afiliacion.findAll({
                attributes: ["UUID", "mascotaId", "productoId", "descripcion", "fechaRevision", "confirmado"],
                include: [{
                    model: Usuario,
                    attributes: ["nombre"]
                }]
            })
        } else {
            respuesta = await Afiliacion.findAll({
                attributes: ["UUID", "mascotaId", "productoId", "descripcion", "fechaRevision", "confirmado"],
                where: {
                    usuarioId: req.usuarioId
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre"]
                }]
            })
        }
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const obtenerUnaSolicitudes = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if (!afiliacion) {
            return res.status(404).json({ msg: "Afiliación no existe" })
        }
        let respuesta;
        if (req.rol === "admin") {
            respuesta = await Afiliacion.findOne({
                attributes: ["UUID", "mascotaId", "productoId", "descripcion", "fechaRevision"],
                where: {
                    id: afiliacion.id
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre"]
                }]
            })
        } else {
            respuesta = await Afiliacion.findOne({
                attributes: ["UUID", "mascotaId", "productoId", "descripcion", "fechaRevision"],
                where: {
                    [Op.and]: [{ id: afiliacion.id }, { usuarioId: req.usuarioId }]
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre"]
                }]
            })
        }
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const crearAfiliacion = async (req, res) => {
    try {
        const mascota = await Mascota.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no existe" })
        }

        const { mascotaId, productoId, descripcion, fechaRevision } = req.body;
        const afiliacion = await Afiliacion.create({
            mascotaId: mascotaId,
            productoId: productoId,
            descripcion: descripcion,
            fechaRevision: fechaRevision,
            usuarioId: req.usuarioId
        })
        res.status(200).json(afiliacion)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const aprobarAfiliacion = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if (!afiliacion) {
            return res.status(404).json({ msg: "Afiliación no existe" })
        }
        const { descripcion, fechaRevision } = req.body;
        await Afiliacion.update({
            confirmado: true,
            descripcion: descripcion,
            fechaRevision: fechaRevision
        }, {
            where: {
                id: afiliacion.id
            }
        })
        res.status(200).json({ msg: "Afiliación aprobada" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const modificarAfiliacion = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if (!afiliacion) {
            return res.status(404).json({ msg: "Afiliación no existe" })
        }
        if(afiliacion.confirmado === true) {
            
            return res.status(404).json({ msg: "Afiliación confirmada. No puede ser modificada" })
        } else {
            const { mascotaId, productoId, descripcion, fechaRevision } = req.body;
            const respuesta = await Afiliacion.update({
                mascotaId: mascotaId,
                productoId: productoId,
                descripcion: descripcion,
                fechaRevision: fechaRevision,
            }, {
                attributes: ["UUID", "mascotaId", "productoId", "descripcion", "fechaRevision", "confirmado"],
                where: {    
                    id: afiliacion.id
                }
            })
            res.status(200).json(respuesta)
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const eliminarAfiliaciones = async (req, res) => {
    try {
        const afiliacion = await Afiliacion.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!afiliacion){
            return res.status(404).json({msg: "Afiliación no existe"})
        }
        await Afiliacion.destroy({
            where: {
                id: afiliacion.id
            }
        })
        res.status(200).json({msg: "Afiliación eliminada"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}