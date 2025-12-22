import { z } from "zod";
import dotenv from 'dotenv'
const envSchema = z.object({
    DB_NAME:z.string(),
    DB_PORT:z.string().default('1433'),
    DB_USER:z.string(),
    DB_PASS:z.string()
})

const envconfig = dotenv.config({path:'./.env'})

export const env = envSchema.parse(process.env)
