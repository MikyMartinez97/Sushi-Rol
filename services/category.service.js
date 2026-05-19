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