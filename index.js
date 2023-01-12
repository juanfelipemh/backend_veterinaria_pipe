import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import dbConecction from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import mascotaRoutes from "./routes/mascotaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import afiliacionRoutes from "./routes/afiliacionRoutes.js";
import buzonRoutes from "./routes/buzonRoutes.js"
dotenv.config();


const app = express();

// // Con esto se mantiene la sesión con la base de datos activa. Se incluye también como atributo en "app.use(session...)"
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: dbConecction
})

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto"
    }
}))

// Creacion tablas BD. Se importa la ruta de los modelos también para que se creen las tablas 
import Mascota from "./models/MascotaModel.js";
import Usuario from "./models/UsuarioModel.js";
import Producto from "./models/ProductoModel.js";
import Afiliacion from "./models/AfiliacionModel.js";
import Buzon from "./models/buzonModel.js";

// NOTA: en la relacion N:N Afiliacion (Mascota, Producto), se elimina con DROP CONSTRAINT la llave foranea que se crea en Mascota y Producto pero no se elimina la columna con su identificado mas mascotaId y productoId de cada una

/*(async()=>{
    await dbConecction.sync()
})(); */

// middleware
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// Routes
app.use("/usuarios", usuarioRoutes);
app.use("/mascotas", mascotaRoutes);
app.use("/productos", productoRoutes);
app.use("/afiliacion", afiliacionRoutes);
app.use("/buzon", buzonRoutes)


// Sincronización base de datos
store.sync();

// Servidor establecido
app.listen(process.env.LOCAL_PORT, ()=> {
    console.log("Conectado al servidor", process.env.LOCAL_PORT);
})

