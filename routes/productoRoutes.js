import express from "express";
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProducto, obtenerUnProducto } from "../controllers/productoController.js";
import { verificarUsuario, administrador } from "../middleware/autorizacionUsuario.js"

const router = express.Router();

router.get("/obtenerProductos", verificarUsuario, obtenerProducto);
router.get("/obtenerUnProducto/:id", verificarUsuario, obtenerUnProducto)
router.post("/crearProducto", verificarUsuario, crearProducto);
router.put("/actualizarProducto/:id", verificarUsuario,  actualizarProducto);
router.delete("/eliminarProducto/:id", verificarUsuario, eliminarProducto);


export default router;