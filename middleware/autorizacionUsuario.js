import Mascota from "../models/MascotaModel.js";
import Usuario from "../models/UsuarioModel.js";

// Valida usuario en sesión
export const verificarUsuario = async (req, res, next) => {

    if(!req.session.usuarioId){
        return res.status(401).json({msg: "Inicie sesión en su cuenta"})
    }
    const usuario = await Usuario.findOne({
        where: {
            UUID: req.session.usuarioId
        }
    });
    if(!usuario){
        return res.status(404).json({msg: "Usuario no encontrado"})
    }  
    req.usuarioId = usuario.id;
    req.rol = usuario.rol;
    next();
}; 



// Rutas privadas: Solo accede el administrador
export const administrador = async (req, res, next) => {
    const usuario = await Usuario.findOne({
        where: {
            UUID: req.session.usuarioId
        }
    });
    if(!usuario){
        return res.status(404).json({msg: "Usuario no encontrado"})
    }
    if(usuario.rol !== "admin"){
        return res.status(404).json({msg: "No tiene permisos de administrador"})
    }
    next();
}

/*
// Se agrega esta validación para que solamente el usuario dueño de los datos personales los pueda modificar. No el administrador de la plataforma puede alterar datos que no son personales por manejo de datos. El administrador puede alterar la información desde la base de datos o puede eliminar el usuario si así lo requiere
export const usuario = async (req, res, next) => {
    const { id } = req.params;
    const usuario = await Usuario.findOne({
        where: {
            UUID: req.session.usuarioId
        }
    });
    if(!usuario){
        return res.status(404).json({msg: "Usuario no encontrado"})
    }
    if(usuario.rol !== "user"){
        return res.status(404).json({msg: "Modificando datos"})
    } 
    if(usuario.UUID !== id){
        return res.status(404).json({msg: "Información no puede ser modificada o consultada por usuarios externos"})
    } 
    next();
}
*/

export const mascota = async (req, res, next) => {    
    const mascota = await Mascota.findOne({
        where: {
            UUID: req.session.usuarioId
        }
    });
    if(!mascota){
        return res.status(404).json({msg: "Mascota no encontrado"})
    }
    if(mascota.UUID !== req.body.id){
        return res.status(404).json({msg: "Información no puede ser modificada o consultada por usuarios externos"})
    } 
    next();
}
