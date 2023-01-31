import express from "express";
import { actualizarUsuario, eliminarUsuario, obtenerUnUsuario, obtenerUsuarios, registrar } from "../controllers/usuarioController.js";
import { administrador, verificarUsuario } from "../middleware/autorizacionUsuario.js";


const router = express.Router();

// Rutas controladas por el administrador desde la web
router.post("/registrar", registrar);
router.get("/usuariosregistados", verificarUsuario, administrador, obtenerUsuarios);
router.delete("/eliminarUsuario/:id", verificarUsuario, administrador, eliminarUsuario);
router.get("/usuarioregistrado/:id", verificarUsuario, administrador, obtenerUnUsuario);
router.put("/actualizarUsuario/:id", verificarUsuario, administrador,  actualizarUsuario);



export default router;