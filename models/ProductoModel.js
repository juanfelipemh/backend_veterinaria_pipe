import { Sequelize } from "sequelize";
import dbConecction from "../config/Database.js";
import Usuario from "../models/UsuarioModel.js";

const { DataTypes } = Sequelize;

export const Producto = dbConecction.define("productos", {
    UUID: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    titulo: {
        type: DataTypes.TEXT,
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
    precio: {
        type: DataTypes.INTEGER,
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
Usuario.hasMany(Producto);
Producto.belongsTo(Usuario, {foreignKey: "usuarioId"});


export default Producto;