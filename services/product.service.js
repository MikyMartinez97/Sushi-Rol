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
    const slug = uniqueSlug(data.name);

    return db.product.create({
        data: {
            name:            data.name,
            slug,
            description:     data.description,
            price:           data.price,
            comparedAtPrice: data.comparedAtPrice,
            stockQuantity:   data.stockQuantity,
            categoryId:      data.categoryId,
        },
        include: {
            category: { select: { name: true, slug: true } },
            images:   true,
        }
    })
}

function slugify(str) {
    return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueSlug(name) {
    const base = slugify(name);

    // Check if the slug is available
    const existing = await db.product.findUnique({ where: { slug: base } });
    if (!existing) return base;

    // Keep trying until we find a slug that isn't taken
    let slug;
    do {
        slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
        const collision = await db.product.findUnique({ where: { slug } });
        if (!collision) break;
    } while (true);

    return slug;
}