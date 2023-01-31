import express from "express";
import { crearAfiliacion, obtenerUnaSolicitudes, obtenerSolicitudes, aprobarAfiliacion, modificarAfiliacion, eliminarAfiliaciones } from "../controllers/afiliacionController.js";
import { administrador, verificarUsuario } from "../middleware/autorizacionUsuario.js";

const router = express.Router();

router.get("/obtenerSolicitudes", verificarUsuario, obtenerSolicitudes);
router.get("/obtenerUnaSolicitud/:id", verificarUsuario, obtenerUnaSolicitudes)
router.post("/crearAfiliacion/:id", verificarUsuario, crearAfiliacion);
router.put("/aprobarAfiliacion/:id", verificarUsuario, aprobarAfiliacion)
router.put("/modificarAfiliacion/:id", verificarUsuario, modificarAfiliacion)
router.delete("/eliminarAfiliaciones/:id", verificarUsuario, administrador, eliminarAfiliaciones)

export default router;