import { Router } from 'express';
import { CategoryModel } from '../dao/models/categoryModel.js';
export const router=Router()

router.get('/',async(req,res)=>{

    let categories=await CategoryModel.find().lean()

    res.setHeader('Content-Type','application/json')
    res.status(200).json({categories})
})