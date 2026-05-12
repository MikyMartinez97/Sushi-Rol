export function getUsers(req, res) {
    res.send('User list');
}

export function getUserById(req, res) {
    res.send(`User ID: ${req.params.id}`);
}

export function createUser(req, res) {
    res.send('User Created');
}

export function modifyUser(req, res) {
    res.send(`Modified user ${req.params.id}`);
}

export function deleteUser(req, res) {
    res.send(`Deleted user ${req.params.id}`);
}