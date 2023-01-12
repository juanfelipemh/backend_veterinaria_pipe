import express from "express";
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProducto, obtenerUnProducto } from "../controllers/productoController.js";
import { verificarUsuario, administrador } from "../middleware/autorizacionUsuario.js"

const router = express.Router();

router.get("/obtenerProductos", obtenerProducto);
router.get("/obtenerUnProducto/:id", obtenerUnProducto)
router.post("/crearProducto", verificarUsuario, administrador, crearProducto);
router.put("/actualizarProducto/:id", verificarUsuario, administrador, actualizarProducto);
router.delete("/eliminarProducto/:id", verificarUsuario, administrador, eliminarProducto);


export default router;