import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Profile } from './entity/Profile';
import { Author } from './entity/Author';
import { Blog } from './entity/Blog';
import { Comment } from './entity/Comment';
import { Category } from './entity/Category';

const AppDataSource = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "5472",
    database: "express_db", 
    synchronize: true,
    logging: true,
     options: {
        encrypt: false, // Add this for local development
        trustServerCertificate: true // Add this for local development
    },
    entities: [User, Profile, Author, Blog, Comment, Category],
    migrations: ["src/migration/*.ts"], // Path to your migration files

})

export default AppDataSource