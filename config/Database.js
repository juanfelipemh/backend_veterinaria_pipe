import { Sequelize } from "sequelize";

const dbConecction = new Sequelize("mascota_feliz", "root", "",{
    host: "localhost",
    dialect: "mysql"
})

export default dbConecction;