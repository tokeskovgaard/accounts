require("dotenv").config();

export const PORT: number = Number.parseInt(process.env.PORT)
export const MONGO_HOST: string = process.env.MONGO_HOST
export const DB_NAME: string = process.env.DB_NAME

export const SESSION_SECRET: string = process.env.SESSION_SECRET
export const JWT_SECRET: string = process.env.PASSPORT_SECRET

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
