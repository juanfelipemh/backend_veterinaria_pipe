import express from "express";
import { CerrarSesion, ingresar, miSesion } from "../controllers/AuthController.js";



const router = express.Router();

//Autenticación usuario

router.post("/ingresar", ingresar);
router.get("/sesion", miSesion);
router.delete("/cerrarSesion", CerrarSesion);


export default router;