import mongoose from "mongoose"
export const connDB=async(mongoUri)=>{
    try {
        await mongoose.connect(mongoUri)
        console.log("DB conectada...!!!")
    } catch (error) {
        console.log(`Error al conectar a DB: ${error}`)
    }
}
