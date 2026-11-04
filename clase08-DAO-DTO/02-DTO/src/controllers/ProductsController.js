import crypto from "crypto"
import { generateError } from "../utils/generateError.js"
import { productsService } from "../service/index.js"

const mockProducts=[
    {_id: crypto.randomBytes(12).toString("hex"), title: "producto 01", price: 100},
    {_id: crypto.randomBytes(12).toString("hex"), title: "producto 02", price: 180},
]

export class ProductsController{

    getProducts=async(req,res,next)=>{

        try {
            // throw new Error("123")
            // throw generateError("faltan permisos", 403, "getProducts")
            // let error=new Error("123")
     
            let products=await productsService.getProducs()

            res.setHeader('Content-Type','application/json')
            res.status(200).json({products})
        } catch (error) {
            // res.setHeader('Content-Type','application/json');
            // return res.status(500).json({error:`error`})
            next(error)
        }
    

    }

    createProduct=async(req, res, next)=>{
        
        try {
            // let {title, price}=req.body

            let newProduct=await productsService.createProduct(req.body)
            console.log(newProduct)
    
            res.setHeader('Content-Type','application/json');
            // return res.status(201).json({payload:{_id: crypto.randomBytes(12).toString("hex"), title, price}});
            return res.status(201).json({newProduct});
            
        } catch (error) {
            next(error)
        }
    }
}