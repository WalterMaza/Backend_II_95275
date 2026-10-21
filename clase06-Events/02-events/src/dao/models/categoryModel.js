import mongoose from "mongoose";

export const CategoryModel=mongoose.model(
    "Category",
    new mongoose.Schema(
        {
            category: {type: String, unique: true,}
        },
        {
            timestamps: true,
        }
    )
)