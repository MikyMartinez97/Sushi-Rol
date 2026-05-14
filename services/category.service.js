export async function getCategoryById(id) {
    return db.category.findUnique({ 
        where: { id },
        include: {
            _count: { select: { products: { where: { isActive: true } } } }
        },
    });
}