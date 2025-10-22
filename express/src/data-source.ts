import { DataSource } from "typeorm"
import { User } from "./User/user.entity"

const AppDataSource = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "5472",
    database: "express_db",
    synchronize: true,
    logging: true,
    entities: [User],
     options: {
        encrypt: false, // Add this for local development
        trustServerCertificate: true // Add this for local development
    },
    migrations: ["src/migration/*.ts"],
    
})

export default AppDataSource