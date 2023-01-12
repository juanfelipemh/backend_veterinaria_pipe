import nodemailer from "nodemailer";

// Creando conexión con servidor correo
const correoRegistro = async (datos) => {
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
        subject: "Confirmación de cuenta",
        text: "Comprueba tu cuenta de Veterinaria Mascota Feliz",
        html: `
            <h2>Confirmacón Cuenta</h2>
            <p>Hola ${nombre} ${apellido}</p>
            <p>Tu cuenta ya está lista para ser usada, pero antes de ingresar debes comprobar que eres tu quien está tratando de acceder a ella.</p>
            <p>Para comprar presiona el siguiente enlace: </p>

            <a href="${process.env.PORT_CONFIRM}/usuarios/confirmar/${token}">Comprobar Cuenta</a>

            <p>PSi tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
    })
}

export default correoRegistro;