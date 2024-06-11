// import mysql from "mysql2";

// const connect = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   port: "3306",
//   database: "db_youtube",
// });

import {Sequelize} from 'sequelize'
import config from '../config/config.js'

const sequelize = new Sequelize(
    config.db_database,
    config.db_user,
    config.db_password,
    {
        host: config.db_host,
        port: config.db_port,
        dialect: config.db_dialect,
    }
)

//Lệnh test kết nối
try{
    await sequelize.authenticate();
    console.log("Kết nối thành côngn")
}catch(err){
    console.log(err)
}
export default sequelize
