export function getCategory(req, res) {
    res.send(`Category ${req.params.id}`);
}

export function getCategories(req, res) {
    res.send('Categories list');
}

export function createCategory(req, res) {
    res.send('Create category');
}

export function modifyCategory(req, res) {
    res.send(`Modify category ${req.params.id}`);
}

export function deleteCategory(req, res) {
    res.send(`Modify category ${req.params.id}`);
}

