import express from "express";
import { crearBuzon, limpiarBuzon, verBuzon } from "../controllers/buzonController.js";
import { administrador, verificarUsuario } from "../middleware/autorizacionUsuario.js";

const router = express.Router();

router.get("/verBuzon", verificarUsuario, administrador, verBuzon);
router.post("/crearBuzon", crearBuzon);
router.delete("/limpiarBuzon/:id", verificarUsuario, administrador, limpiarBuzon)

export default router;