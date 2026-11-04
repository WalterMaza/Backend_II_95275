import { CategoryModel } from "./models/categoryModel.js";

export class CategoryDAO{

    async findOne(filtro={}){
        return await CategoryModel.findOne(filtro)
    }

    // resto del CRUD
}