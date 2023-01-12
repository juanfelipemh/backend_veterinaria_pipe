import { Sequelize } from "sequelize";
import  dbConecction from "../config/Database.js";
import generarId from "../helper/generarId.js";

const { DataTypes } = Sequelize;

const Usuario = dbConecction.define("usuarios", {
    UUID: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    identificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,

        }
    },
    telefono: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    rol: {
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: generarId(),
        allowNull: true,
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
},
{
    freezeTableName: true
});



export default Usuario;