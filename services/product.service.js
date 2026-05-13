import db from '../config/db.js';

export async function getProducts() {
    return db.product.findMany({ 
        where:   { isActive: true },
        include: { images: {where: { position: 0 }, take: 1 } },
        orderBy: { name: 'asc' },
    });
}

export async function getProducById(id) {
    return db.product.findUnique({
        where: { id },
        include: {
            images:   { orderBy: { position: 'asc' } },
            category: { select: { name: true, slug: true } },
        }
    })
}

export async function createProduct(data) {
    const slug = slugify(data.name);

    return db.product.create({
        data: {
            name:            data.name,
            slug,
            description:     data.description,
            price:           data.price,
            comparedAtPrice: data.comparedAtPrice,
            stockQuantity:   data.stockQuantity,
            categoryId:  data.categoryId,
        },
        include: {
            category: { select: { name: true, slug: true } },
            images:   true,
        }
    })
}