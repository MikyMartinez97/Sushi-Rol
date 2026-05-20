import * as userService from '../services/user.service.js'
import { updateUserSchema, userSchema } from '../validations/user.validation.js';

export async function getUsers(req, res, next) {
    try {
        const {
            page = 1,
            pageSize = 20,
            search,
            role,
        } = req.query;

        const result = await userService.listUsers({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            search,
            role,
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json();
    } catch (err) {
        next(err)
    }
}

export async function createUser(req, res, next) {
    try {
        const data = userSchema.parse(req.body);
        const user = await userService.createUser(data);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req, res, next) {
    try {
        const data = updateUserSchema.parse(req.body);
        const user = await userService.updateUser(req.params.id, data);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        // Prevent admin from deleting their own account
        if (req.params.id === req.user.userId) {
            return res.status(409).json({
                error: 'You cannot delete your own account'
            });
        }

        const result = await userService.deleteUser(req.params.id);
        if (!result) return res.status(404).json({ error: 'User not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}