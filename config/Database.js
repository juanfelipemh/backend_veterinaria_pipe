import { Sequelize } from "sequelize";
import env from "dotenv";
env.config();

const dbConecction = new Sequelize(process.env.DB_NAME, process.env.USER_DB, process.env.PASSWORD_DB,{
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    dialect: "mysql"
})

export default dbConecction;