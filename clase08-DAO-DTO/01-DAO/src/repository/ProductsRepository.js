// import { ProductsDAO } from "../DAO/ProductsDAO.js"

export class ProductsRepository{
    #productDAO

    /**
     * 
     * @param {import("../DAO/ProductsDAO.js").ProductsDAO} productsDAO 
     */
    constructor(productsDAO){
        this.#productDAO=productsDAO
    }

    async getProducts(filtro={}){
        return await this.#productDAO.get(filtro)
    }

    async getProductBy(filtro={}){
        return await this.#productDAO.getBy(filtro)
    }

    async createProduct(product){
        return await this.#productDAO.create(product)
    }
}

// class prueba{

//     /**
//      * 
//      * @param {ProductsDAO} prodDAO 
//      */
//     constructor(prodDAO){
//         this.pd=prodDAO
//     }

//     prueba(){
//         this.pd.getBy()
//     }
// }


// app.js -> router -> controller -> service -> repo -> DAO