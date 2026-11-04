import { ProductsDAO } from "../DAO/ProductsDAO.js";
import { ProductsRepository } from "../repository/ProductsRepository.js";
import { ProductsService } from "./ProductsService.js";


const productsDAO=new ProductsDAO()

// const productsDAO={
//     get:()=>{
//         return [
//             {id:1, title:"lapiz"},
//             {id:2, title:"goma"},
//         ]
//     },
//     create:(a)=>{
//         return {
//             message:"new product created", 
//             payload: {
//                 id:999, title: a.title
//             }
//         }
//     },
//     getBy:()=>false
// }

const productsRepository=new ProductsRepository(productsDAO)
const customerRepo=null

export const productsService=new ProductsService(productsRepository, customerRepo)

