import Usuario from "../models/UsuarioModel.js";
import argon2 from "argon2";


export const registrar = async (req, res) => {
  
    const { identificacion, nombre, apellido, telefono, correo, clave, confirmarClave } = req.body;

    // Validar usuario duplicado y contraseñra
    const existeUsuario = await Usuario.findOne({
        where: {
            correo: req.body.correo
        }
    });
    if (existeUsuario) {
        const error = new Error("Correo ya registrado")
        return res.status(400).json({ msg: error.message })
    };
    if (clave !== confirmarClave) {
        return res.status(400).json({ msg: "Contraseñas no coinciden" })
    }
    const encriptarClave = await argon2.hash(clave);

    // Creación usuario: Registro
    try {
        await Usuario.create({
            identificacion: identificacion,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            correo: correo,
            clave: encriptarClave,
        });
        res.status(201).json({msg: "Usuario registrado"})
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await Usuario.findAll({
            attributes: ["UUID", "nombre", "apellido", "correo", "rol", "confirmado"]
        })
        res.status(200).json(resultado)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const obtenerUnUsuario = async (req, res) => {
    try {
        const respuesta = await Usuario.findOne({
            attributes: ["UUID", "nombre", "apellido", "correo", "rol", "confirmado"],
            where: {
                UUID: req.params.id
            }
        });
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const actualizarUsuario = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            UUID: req.params.id
        }
    });
    if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" })
    }
    const { identificacion, nombre, apellido, telefono, clave, confirmarClave } = req.body;
    // validar cambio de contraseña
    let hashClave;
    if (clave === "" || clave === null) {
        hashClave = usuario.clave;
    } else {
        hashClave = await argon2.hash(clave)
    }
    if (clave !== confirmarClave) {
        return res.status(400).json({ msg: "Contraseñas no coinciden" })
    };
    try {
        await Usuario.update({
            identificacion: identificacion,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            clave: hashClave
        },{
            where: {
                id: usuario.id
            }
        });
        res.status(200).json({msg: "Usuario actualizado correctamente"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }



}

export const eliminarUsuario = async (req, res) => {
    const usuario = await Usuario.findOne({
        where: {
            UUID: req.params.id
        }
    });
    if(!usuario){
        return res.status(404).json({msg: "Usuario no encontrado"})
    };
    try {
        await Usuario.destroy({
            where: {
                id: usuario.id
            }
        });
        res.status(200).json({msg: "Usuario eliminado"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}


