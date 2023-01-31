import Mascota from "../models/MascotaModel.js";
import Usuario from "../models/UsuarioModel.js";
import { Op } from "sequelize";

export const obtenerMascotas = async (req, res) => {
    try {
        let respuesta;
        if (req.rol === "admin") {
            respuesta = await Mascota.findAll({
                attributes: ["UUID", "nombre", "edad", "descripcion", "foto"],
                include: [{
                    model: Usuario,
                    attributes: ["nombre", "correo"]
                }]
            })
        } else {
            respuesta = await Mascota.findAll({
                attributes: ["UUID", "nombre", "edad", "descripcion", "foto"],
                where: {
                    usuarioId: req.usuarioId
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre", "correo"]
                }]
            })
        }
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const obtenerUnaMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!mascota){
            return res.status(404).json({msg: "Mascota no encontrada"})
        }
        let respuesta;
        if(req.rol === "admin"){
            respuesta = await Mascota.findOne({
                attributes: ["id", "UUID", "nombre", "edad", "descripcion", "foto"],
                where: {
                    id: mascota.id
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre", "correo"]
                }]
            })
        } else {
            respuesta = await Mascota.findOne({
                attributes: ["id", "UUID", "nombre", "edad", "descripcion", "foto"],
                where: {
                    [Op.and]: [{ id: mascota.id }, { usuarioId: req.usuarioId }]
                },
                include: [{
                    model: Usuario,
                    attributes: ["nombre", "correo"]
                }]
            })
        }
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// Validar implementación cloudinary
export const agregarMascotas = async (req, res) => {
    try {
        const { nombre, edad, descripcion, foto } = req.body;
        const nuevaMasctoa = await Mascota.create({
            nombre: nombre,
            edad: edad,
            descripcion: descripcion,
            foto: foto,
            usuarioId: req.usuarioId
        })
        res.status(201).json(nuevaMasctoa)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const actualizarMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findOne({
            where: {
                UUID: req.params.id
            }
        });
        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no encontrada" })
        };
        const { nombre, edad, descripcion, foto } = req.body;
        if(req.rol === "admin"){
            await Mascota.update({
                nombre: nombre,
                edad: edad,
                descripcion: descripcion,
                foto: foto
            }, { where: {
                id: mascota.id
            }})
        } else {
            if(req.usuarioId !== mascota.usuarioId){
                return res.status(403).json({msg: "Acceso denegado. Esta mascota no te pertenece"})
            }
            await Mascota.update({
                nombre: nombre,
                edad: edad,
                descripcion: descripcion,
                foto: foto
            }, { where: {
                [Op.and]: [{id: mascota.id}, {usuarioId: req.usuarioId}] 
            }});
        }
        res-status(200).json({msg: "Mascota actualizada"})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const eliminarMascota = async (req, res ) => {
    try {
        const mascota = await Mascota.findOne({
            where: {
                UUID: req.params.id
            }
        });
        if(!mascota){
            return res.status(404).json({msg: "Mascota no encontrada"})
        };
        if(req.rol === "admin"){
            await Mascota.destroy({
                where: {
                    id: mascota.id
                }
            })
        } else {
            if(req.usuarioId !== mascota.usuarioId){
                return res.status(403).json({msg: "Acceso denegado. Esta mascota no te pertenece"})
            }
            await Mascota.destroy({
                where: {
                    [Op.and]: [{id: mascota.id}, {usuarioId: req.usuarioId}]
                }
            })
        }
        res.status(200).json({msg: "Mascota eliminada"})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}