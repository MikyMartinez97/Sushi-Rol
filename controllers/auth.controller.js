import * as authService from '../services/auth.service.js'
import { registerUserSchema } from '../validations/user.validation.js'

export async function registerUser(req, res, next) {
    try {
        const data = registerUserSchema.parse(req.body);

        const { user, token } = await authService.registerUser(data);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge:   60 * 60 * 1000, // 1 hour
        });

        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
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
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
}

export async function getProfile(req, res, next) {
    try {
        const user = await authService.getProfile(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}