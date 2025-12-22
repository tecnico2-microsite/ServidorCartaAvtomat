import { z } from "zod";
import dotenv from 'dotenv'
const envSchema = z.object({
    DB_URL:z.string().default('localhost'),
    DB_NAME:z.string(),
    DB_PORT:z.string().default('1433').transform(Number),
    DB_USER:z.string(),
    DB_PASS:z.string(),
    APP_PORT:z.string().max(5),
})

const envconfig = dotenv.config({path:'./.env.local'})

export const env = envSchema.parse(process.env)
