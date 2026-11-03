process.loadEnvFile("./.env")

const dbName=process.env.DB_NAME?`&dbName=${process.env.DB_NAME}`:""

export const config={
    port: process.env.PORT || 3000, 
    secret: process.env.SECRET, 
    mongoUri: `${process.env.MONGO_URL}${dbName}`,
}

