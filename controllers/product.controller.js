import productService from "../services/product.service.js"
import { productSchema } from "../validations/product.validation.js";

export async function getProducts(req, res, next) {
    try {
        const products = await productService.getProducts();
        if (!products) return res.status(404).json({ error: 'No products found' });
        res.json(products);
    } catch (err) {
        next(err);
    }
}

export async function getProductById(req, res, next) {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
}

export async function createProduct(req, res, next) {
    try {
        const data = productSchema.parse(req.body);
        const product = await productService.createProduct(data);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

export function modifyProduct(req, res) {
    res.send(`Product ${req.params.id} modified`);
}

export function deleteProduct(req, res) {
    res.send(`Product ${req.params.id} deleted`);
}

