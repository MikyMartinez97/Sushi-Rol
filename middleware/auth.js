export function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Not authenticated"});

    try {
        req.user = jwt.verify(token, process.env.JWT_SERET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}