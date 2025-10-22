import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "5472",
    database: "tempdb",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
     options: {
        encrypt: false, // Add this for local development
        trustServerCertificate: true // Add this for local development
    }
})
