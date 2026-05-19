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