import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
        title: String, 
        price: Number
    },
    {
        timestamps:true
    }
)

export const productsModel=mongoose.model("product", productSchema)