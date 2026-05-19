import * as categoryService from "../services/category.service.js"
import { categorySchema } from "../validations/category.validation.js"

export async function getCategoryById(req, res, next) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

export async function getCategories(req, res, next) {
    try {
        const categories = await categoryService.listCategories();
        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    }
}

export async function createCategory(req, res, next) {
    try {
        const data = categorySchema.parse(req.body);
        const category = await categoryService.createCategory(data);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
}

export async function updateCategory(req, res, next) {
    res.send(`Modify category ${req.params.id}`);
}

export async function deleteCategory(req, res, next) {
    res.send(`Modify category ${req.params.id}`);
}

