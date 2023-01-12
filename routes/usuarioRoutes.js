import express from "express";
import { actualizarUsuario, CerrarSesion, comprobarToken, confirmarCuenta, eliminarUsuario, ingresar, miSesion, nuevaClave, obtenerUnUsuario, obtenerUsuarios, olvideClave, registrar } from "../controllers/usuarioController.js";
import { administrador, usuario, verificarUsuario } from "../middleware/autorizacionUsuario.js";


const router = express.Router();

//Autenticación usuario
router.post("/registrar", registrar);
router.get("/confirmar/:token", confirmarCuenta);
router.post("/ingresar", ingresar);
router.get("/sesion", miSesion);
router.delete("/cerrarSesion", CerrarSesion);
router.post("/olvideClave", olvideClave);
router.route("/olvideClave/:token").get(comprobarToken).post(nuevaClave)

// Rutas controladas por el administrador desde la web
router.get("/usuariosregistados", verificarUsuario, administrador, obtenerUsuarios);
router.delete("/eliminarUsuario/:id", verificarUsuario, administrador, eliminarUsuario);

// Rutas controladas por el usuario en sesión desde la web. El administrador puede alterar datos desde la base de datos
router.get("/usuarioregistrado/:id", verificarUsuario, usuario, obtenerUnUsuario);
router.put("/actualizarUsuario/:id", verificarUsuario, usuario,  actualizarUsuario);



export default router;