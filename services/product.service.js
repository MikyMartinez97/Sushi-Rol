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
