import express from "express";
import { crearAfiliacion, obtenerUnaSolicitudes, obtenerSolicitudes, aprobarAfiliacion } from "../controllers/afiliacionController.js";
import { administrador, mascota, usuario, verificarUsuario } from "../middleware/autorizacionUsuario.js";

const router = express.Router();

router.get("/obtenerSolicitudes", verificarUsuario, administrador, obtenerSolicitudes);
router.get("/obtenerUnaSolicitud/:id", verificarUsuario, obtenerUnaSolicitudes)
router.post("/crearAfiliacion/:id", verificarUsuario, crearAfiliacion);
router.put("/aprobarAfiliacion/:id", verificarUsuario, administrador, aprobarAfiliacion)


export default router;