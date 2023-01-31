import express from "express";
import { actualizarMascota, agregarMascotas, eliminarMascota, obtenerMascotas, obtenerUnaMascota } from "../controllers/mascotaController.js";
import { verificarUsuario } from "../middleware/autorizacionUsuario.js";

const router = express.Router();

router.get("/obtenerMascotas", verificarUsuario, obtenerMascotas);
router.get("/obtenerUnaMascota/:id", verificarUsuario, obtenerUnaMascota);
router.post("/agregarMascotas", verificarUsuario, agregarMascotas);
router.put("/actualizarMascota/:id", verificarUsuario, actualizarMascota);
router.delete("/eliminarMascota/:id", verificarUsuario, eliminarMascota)


export default router;