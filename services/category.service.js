import db from '../config/db.js';

export async function getCategoryById(id) {
    return db.category.findUnique({
        where: { id },
        include: {
            _count: { select: { products: { where: { isActive: true } } } }
        },
    });
}

export async function listCategories() {
    return db.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: { where: { isActive: true } } }
            }
        }
    });
}

export async function createCategory({ name, slug }) {
    // Check name isn't already taken
    const existing = await db.category.findFirst({
        where: {
            OR: [
                { name: { equals: name, mode: 'insensitive' } },
                { slug },
            ]
        }
    });

    if (existing) {
        const err = new Error(
            existing.slug === slug
                ? 'A category with that slug already exists'
                : 'A category with that name already exists'
        );
        err.status = 409;
        throw err;
    }

    return db.category.create({
        data: { name, slug },
        include: {
            _count: { select: { products: { where: { isActive: true } } } }
        }
    });
}

export async function updateCategory(id, data) {

    // Step 1 — check the category exists
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return null;

    // Step 2 — build the update payload
    //           only include fields that were actually provided
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;

    if (Object.keys(updateData).length === 0) {
        const err = new Error('No fields provided to update');
        err.status = 400;
        throw err;
    }

    // Step 3 — check for conflicts with other categories
    //           exclude the current category from the duplicate check
    if (updateData.name || updateData.slug) {
        const conditions = [];
        if (updateData.name) {
            conditions.push({ name: { equals: updateData.name, mode: 'insensitive' } });
        }
        if (updateData.slug) {
            conditions.push({ slug: updateData.slug });
        }

        const conflict = await db.category.findFirst({
            where: {
                AND: [
                    { id: { not: id } }, // exclude current category
                    { OR: conditions },
                ]
            }
        });

        if (conflict) {
            const err = new Error(
                conflict.slug === updateData.slug
                    ? 'A category with that slug already exists'
                    : 'A category with that name already exists'
            );
            err.status = 409;
            throw err;
        }
    }

    // Step 4 — perform the update
    return db.category.update({
        where: { id },
        data: updateData,
        include: {
            _count: { select: { products: { where: { isActive: true } } } }
        }
    });
}

export async function deleteCategory(id) {

    // Step 1 — check the category exists
    const category = await db.category.findUnique({ where: { id } });
    if (!category) return null;

    // Step 2 — check for active products
    const activeProductCount = await db.product.count({
        where: { categoryId: id, isActive: true }
    });

    if (activeProductCount > 0) {
        const err = new Error(
            `Cannot delete "${category.name}" — it has ${activeProductCount} active product(s). ` +
            `Reassign or deactivate them first.`
        );
        err.status = 409;
        throw err;
    }

    // Step 3 — handle inactive products that still reference this category
    //           set their categoryId to null so they become uncategorised
    await db.product.updateMany({
        where: { categoryId: id, isActive: false },
        data: { categoryId: null },
    });

    // Step 4 — delete the category
    await db.category.delete({ where: { id } });

    return true;
}