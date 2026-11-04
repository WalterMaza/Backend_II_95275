import { generateError } from "../utils/generateError.js"

export class ProductsService{
    #productRepository
    #customerRepo

    /**
     * 
     * @param {import("../repository/ProductsRepository.js").ProductsRepository} productRepository 
     */
    constructor(productRepository, customerRepository){
        this.#productRepository=productRepository
        this.#customerRepo=customerRepository
    }

    async getProducs(filtro={}){
        return this.#productRepository.getProducts()
    }

    async createProduct(product){

        if(!product.title || !product.price || product.price<0){
            throw generateError(`title | price son requeridos; price debe ser mayor a 0`, 400, `ProductsService`)
        }

        let existe=await this.#productRepository.getProductBy({title: product.title})
        if(existe){
            throw generateError(`El producto ${product.title} ya existe en DB`, 400, `ProductsService`)
        }

        return await this.#productRepository.createProduct(product)
    }
}