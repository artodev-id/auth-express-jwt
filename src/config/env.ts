import dotenv from 'dotenv'
import path from 'path';
dotenv.config();

export const env = {
    DB_HOST  : process.env.DB_HOST || '',
    DB_PASS  : process.env.DB_PASS || '',
    DB_USER  : process.env.DB_USER || '',
    DB_NAME : process.env.DB_NAME || '',

    TOKEN_SECRET: "ABCDFG_SECRET"
}