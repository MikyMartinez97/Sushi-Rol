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
    try {
        const data = categorySchema.partial().parse(req.body);
        const category = await categoryService.updateCategory(req.params.id, data);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

export async function deleteCategory(req, res, next) {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        if (!result) return res.status(404).json({ error: 'Category not found' });
        res.status(204).send();
    } catch (err) {
        next(err); // 409 from service lands here
    }
}

