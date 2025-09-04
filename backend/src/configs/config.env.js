import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;

export const DB_CONFIG = {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: prpcess.env.DB_NAME
};

/* //por si lo necesito en otro lado
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME; */