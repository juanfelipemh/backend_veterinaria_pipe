import Usuario from "../models/UsuarioModel.js";
import correoRegistro from "../helper/emailRegistro.js";
// import generarJWT from "../helper/generarJWT.js";
import argon2 from "argon2";
import generarId from "../helper/generarId.js";

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
        const usuario = new Usuario({
            identificacion: identificacion,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            correo: correo,
            clave: encriptarClave
        });
        const usuarioGuardado = await usuario.save();
        // Enviar email confirmacion cuenta
        correoRegistro({
            correo,
            nombre,
            apellido,
            token: usuarioGuardado.token
        })
        res.status(201).json({ usuarioGuardado })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const confirmarCuenta = async (req, res) => {
    // Recupero tokeen de la URL 
    const { token } = req.params;
    const confirmarUsuario = await Usuario.findOne({
        where: {
            token: token
        }
    });
    if (!confirmarUsuario) {
        return res.status(404).json({ msg: "Token no válido porque no corresponde al usuario que se está confirmando..." })
    };
    try {
        confirmarUsuario.token = null,
            confirmarUsuario.confirmado = true
        await confirmarUsuario.save();
        res.json({
            msg: "Usuario confirmado correctamente"
        })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const ingresar = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                correo: req.body.correo
            }
        });
        if (!usuario) {
            return res.status(403).json({ msg: "Usuario no existe" })
        }
        if (!usuario.confirmado) {
            return res.status(403).json({ msg: "Tu cuenta no ha sido confirmada" })
        }
        const claveCorrecta = await argon2.verify(usuario.clave, req.body.clave)
        if (!claveCorrecta) {
            return res.status(400).json({ msg: "Contraseña incorrecta" })
        }
        req.session.usuarioId = usuario.UUID;
        const UUID = usuario.UUID;
        const nombre = usuario.nombre;
        const apellido = usuario.apellido;
        const correo = usuario.correo;
        const rol = usuario.rol;
        res.status(200).json({ UUID, nombre, apellido, correo, rol })
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export const CerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({ msg: "No se puede cerrar sesión" })
        }
        res.status(200).json({ msg: "Sesión cerrada" })
    })
}

// Esta función busca identificar el usuario que se loggea para separar la información de cada uno. Es importante instalar el "connect-session-sequelize" porque cada que se reinicie el servidor, se perderían los datos de la conexión con la base de datos, y esto siempre debe estar en vivo. Por buenas prácticas es mejor hacerlo así. Muy importante hacerlo para que pueda identificar si es usuario o admin
export const miSesion = async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.status(401).json({ msg: "Inicie sesión en su cuenta" })
        }
        const usuario = await Usuario.findOne({
            attributes: ["UUID", "nombre", "apellido", "correo", "rol"],
            where: {
                UUID: req.session.usuarioId
            }
        });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const olvideClave = async (req, res) => {
    const { correo } = req.body;
    const existeUsuario = await Usuario.findOne({
        where: {
            correo: req.body.correo
        }
    });
    if(!existeUsuario){
        return res.status(400).json({msg: "Usuario no existe"})
    }
    try {
        existeUsuario.token = generarId();
        await existeUsuario.save();
        // enviar instrucciones para cambio clave

    } catch (error) {
        res.status(404).json(error.message)
    }
}

export const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({
        where: {
            token: id.params.token
        }
    })
    if(tokenValido){
        res.json({msg: "Usuario válido"})
    } else {
        return res.status(400).json({msg: "Token no válido"})
    }
}

export const nuevaClave = async (req, res) => {
    const { token } = req.params;
    const { clave } = req.body;
    const usuario = await Usuario.findOne({
        where: {
            token: req.params.token
        }
    })
    if(!usuario){
        return res.status(400).json({msg: "Hubo un error estableciendo la nueva contraseña"})
    }
    try {
        usuario.token = null;
        usuario.clave = clave;
        await usuario.save();
        res.json({msg: "Contraseña reestablecida correctamente"})
    } catch (error) {
        return res.status(404).json({msg: error.message})
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
