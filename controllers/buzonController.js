import { json } from "express";
import Buzon from "../models/buzonModel.js";

export const verBuzon = async (req, res) => {
    try {
        const respuesta = await Buzon.findAll({
            attributes: ["UUID", "nombres", "apellidos", "telefono", "correo", "descripcion"]
        })
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const crearBuzon = async (req, res) => {
    try {
        const { nombres, apellidos, telefono, correo, descripcion }  = req.body;
        const respuesta = await Buzon.create({
            nombres: nombres,
            apellidos: apellidos,
            telefono: telefono,
            correo: correo,
            descripcion: descripcion
        })
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const limpiarBuzon = async (req, res) => {
    try {
        const buzon = await Buzon.findOne({
            where: {
                UUID: req.params.id
            }
        })
        if(!buzon){
            return res.status(404).json({msg: "Buzon no existe"})
        }
        await Buzon.destroy({
            where: {
                id: buzon.id
            }
        })
        res.status(200).json({msg: "Buzon eliminado"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}