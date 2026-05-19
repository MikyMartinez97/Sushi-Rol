import db from '../config/db.js';

export async function listProducts({
    page,
    pageSize,
    sort,
    category,
    search,
    minPrice,
    maxPrice,
}) {
    // Build the where clause incrementally
    const where = { isActive: true };

    // Filter by category slug
    if (category) {
        where.category = { slug: category };
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
        };
    }

    // Full text search on name and description
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Build the orderBy clause
    const orderBy = sort === 'price_asc' ? { price: 'asc' }
        : sort === 'price_desc' ? { price: 'desc' }
            : sort === 'newest' ? { createdAt: 'desc' }
                : sort === 'name_desc' ? { name: 'desc' }
                    : { name: 'asc' }; // default

    const skip = (page - 1) * pageSize;

    // Run data query and count simultaneously
    const [products, total] = await Promise.all([
        db.product.findMany({
            where,
            orderBy,
            skip,
            take: pageSize,
            include: {
                category: { select: { name: true, slug: true } },
                images: { where: { position: 0 }, take: 1 },
            },
        }),
        db.product.count({ where }),
    ]);

    return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getProductById(id) {
    return db.product.findUnique({
        where: { id, isActive: true },
        include: {
            images: { orderBy: { position: 'asc' } },
            category: { select: { name: true, slug: true } },
        },
    });
}

export async function createProduct(data) {

    // Step 1 — generate a unique slug from the name
    const slug = await uniqueSlug(data.name);

    // Step 2 — verify categoryId exists if provided
    if (data.categoryId) {
        const category = await db.category.findUnique({
            where: { id: data.categoryId }
        });
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            throw err;
        }
    }

    // Step 3 — create the product
    return db.product.create({
        data: {
            name: data.name,
            slug,
            description: data.description ?? null,
            price: data.price,
            compareAtPrice: data.compareAtPrice ?? null,
            stockQuantity: data.stockQuantity,
            categoryId: data.categoryId ?? null,
            isActive: true,
        },
        include: {
            category: { select: { name: true, slug: true } },
            images: true,
        },
    });
}

export async function updateProduct(id, data) {
    // Regenerate slug if name is being changed
    if (data.name) {
        data.slug = await uniqueSlug(data.name);
    }

    return db.product.update({
        where: { id },
        data,
        include: {
            category: { select: { name: true, slug: true } },
            images: true,
        },
    });
}

export async function deleteProduct(id) {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) return null;

    return db.product.update({
        where: { id },
        data: { isActive: false },
    });
}

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

async function uniqueSlug(name) {
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