import * as userService from '../services/user.service.js'
import { updateUserSchema, userSchema } from '../validations/user.validation.js';

export async function getUsers(req, res, next) {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (err) {
        next(err)
    }
}

export async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json();
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
        const user = await userService.updateUser(data);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(204).send();
    } catch (err) {
        next(err)
    }
}