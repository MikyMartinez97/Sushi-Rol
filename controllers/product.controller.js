import * as productService from "../services/product.service.js"
import {
    productSchema,
    updateProductSchema
} from "../validations/product.validation.js";

export async function getProducts(req, res, next) {
    try {
        const {
            page = 1,
            pageSize = 12,
            sort,
            category,
            search,
            minPrice,
            maxPrice,
        } = req.query;

        const result = await productService.listProducts({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sort,
            category,
            search,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function getProductById(req, res, next) {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
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

export async function updateProduct(req, res, next) {
    try {
        const data = updateProductSchema.parse(req.body);
        const product = await productService.updateProduct(req.params.id, data);
        if (!product) return res.status(404).json({ error: "product not found" });
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

