import mysql, {Connection} from 'mysql2/promise'
import { env } from './env'

const config = {
    host:env.DB_URL,
    port:env.DB_PORT,
    user:env.DB_USER,
    password:env.DB_PASS,
    database:env.DB_NAME
};


export const connection : Connection =  mysql.createPool(config)
