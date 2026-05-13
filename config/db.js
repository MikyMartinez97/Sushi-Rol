import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// DB singleton through module cache
const db = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});

export default db;