import { Router } from "express";
import {ProductController} from './controler'
import {ProductService} from '../services'
import {AuthMiddleware} from '../middlewares/auth.middleware'

export class ProductRoutes {
    static get routes(): Router {
        const router = Router()
        const productService = new ProductService()
        const controller = new ProductController(productService)

        router.get('/', controller.getProducts)
        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct)

        return router
    }
}