import { productsModel } from "../models/productModel.js";

export class ProductsDAO{

    async getBy(filtro={}){   //  {_id: id} {title:"campera"}
        return await productsModel.findOne(filtro).lean()
    }

    async get(filtro={}){   //  {_id: id} {title:"campera"}
        return await productsModel.find(filtro).lean()
    }

    async create(product){
        let newProduct=await productsModel.create(product)
        return newProduct.toJSON()
    }
}