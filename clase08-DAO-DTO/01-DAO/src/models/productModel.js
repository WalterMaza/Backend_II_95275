import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
        title: {
            type: String, unique: true
        }, 
        price: Number
    },
    {
        timestamps:true
    }
)

export const productsModel=mongoose.model("product", productSchema)