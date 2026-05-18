export async function registerUSer(req, res, next) {
    res.send("User registered!");
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { user, token } = await authService.login(email, password);

        // Set JWT as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge:   60 * 60 * 1000, // 1 hour in milliseconds
        });

        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    res.send("Logged out");
}

export async function getProfile(req, res, next) {
    res.send("User profile");
}