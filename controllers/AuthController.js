import Usuario from "../models/UsuarioModel.js";
import argon2 from "argon2";


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
            return res.status(403).json({ msg: "Tu cuenta no ha sido confirmada por el administrado" })
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

