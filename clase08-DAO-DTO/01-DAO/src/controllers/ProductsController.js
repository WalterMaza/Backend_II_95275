import crypto from "crypto"

const mockProducts=[
    {_id: crypto.randomBytes(12).toString("hex"), title: "producto 01", price: 100},
    {_id: crypto.randomBytes(12).toString("hex"), title: "producto 02", price: 180},
]

export class ProductsController{

    getProducts=async(req,res)=>{

    

        res.setHeader('Content-Type','application/json')
        res.status(200).json({products:mockProducts})
    }

    createProduct=async(req, res)=>{
        let {title, price}=req.body

        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:{_id: crypto.randomBytes(12).toString("hex"), title, price}});
    }
}