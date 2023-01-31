import { Sequelize } from "sequelize";
import dbConecction from "../config/Database.js";
import Producto from "./ProductoModel.js";
import Mascota from "./MascotaModel.js"
import Usuario from "./UsuarioModel.js";

const { DataTypes } = Sequelize;

const Afiliacion = dbConecction.define("afiliacion", {
    UUID: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }, 
    mascotaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Mascota,
            key: "id"
        }        
    },
    productoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Producto,
            key: "id"
        }        
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: "id"
        }        
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    fechaRevision: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},{
    freezeTableName: true
});

// RELACIÓN ENTRE TABLAS
Mascota.belongsTo(Producto, { through: Afiliacion, foreignKey: "productoId"});
Producto.belongsTo(Mascota, {through: Afiliacion, foreignKey: "mascotaId"});

Usuario.hasMany(Afiliacion);
Afiliacion.belongsTo(Usuario, {foreignKey: "usuarioId"})


export default Afiliacion;

/* MODELO INICIAL 
import { Sequelize } from "sequelize";
import dbConecction from "../config/Database.js";
import Producto from "./ProductoModel.js";
import Mascota from "./MascotaModel.js"
import Usuario from "./UsuarioModel.js";

const { DataTypes } = Sequelize;

const Afiliacion = dbConecction.define("afiliacion", {
    UUID: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }, 
    mascotaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Mascota,
            key: "id"
        }        
    },
    productoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Producto,
            key: "id"
        }        
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: "id"
        }        
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    fechaRevision: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},{
    freezeTableName: true
});

// RELACIÓN ENTRE TABLAS
Mascota.belongsTo(Producto, { through: Afiliacion, foreignKey: "productoId"});
Producto.belongsTo(Mascota, {through: Afiliacion, foreignKey: "mascotaId"});

Usuario.hasMany(Afiliacion);
Afiliacion.belongsTo(Usuario, {foreignKey: "usuarioId"})

export default Afiliacion;

*/