import nodemailer from "nodemailer";

// Creando conexión con servidor correo
const emailOlvideClave = async (datos) => {
    const conexion = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            // type: "OAuth2", // Para gmail
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { correo, nombre, apellido, token } = datos;

    // Parametros para enviar el correo 
    const mensajeCorreo = await conexion.sendMail({
        from: "Veterinaria Mascota Feliz",
        to: correo,
        subject: "Reestablecer la contraseña",
        text: "Restablecer tu contraseña",
        html: `
            <h2>Cambio contrase{a</h2>
            <p>Hola ${nombre} ${apellido}</p>
            <p>Has solicitado el cambio de tu contraseña</p>
            <p>Presiona el siguiente enlace para generar una nueva contraseña: </p>

            <a href="${process.env.PORT_CONFIRM}/usuarios/olvideClave/${token}">Restablecer la contraseña</a>

            <p>PSi tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
    })
}

export default emailOlvideClave;