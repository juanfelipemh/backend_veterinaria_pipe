import { Sequelize } from "sequelize";
import dbConecction from "../config/Database.js";
import Usuario from "./UsuarioModel.js";

const { DataTypes } = Sequelize;

const Mascota = dbConecction.define("mascotas", {
    UUID: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },    
    foto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }    
    },    
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},
{
    freezeTableName: true
});

// RELACIÓN ENTRE TABLAS
Usuario.hasMany(Mascota);
Mascota.belongsTo(Usuario, {foreignKey: "usuarioId"});



export default Mascota;