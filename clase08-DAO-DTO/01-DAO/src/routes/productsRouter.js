import { Router } from 'express';
import { ProductsController } from '../controllers/ProductsController.js';
export const router=Router()

const productsController=new ProductsController()

router.get('/', productsController.getProducts)
router.post("/", productsController.createProduct)