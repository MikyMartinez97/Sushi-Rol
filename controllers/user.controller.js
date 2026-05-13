import * as userService from '../services/user.service.js'

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
    res.send('User Created');
}

export async function updateUser(req, res, next) {
    res.send(`Modified user ${req.params.id}`);
}

export async function deleteUser(req, res, next) {
    res.send(`Deleted user ${req.params.id}`);
}