export async function getProducts(req, res) {
    res.send("List of products");
}

export function getProductById(req, res) {
    res.send(`Product with id = ${req.params.id}`);
}

export function createProduct(req, res) {
    res.send("Created products here");
}

export function modifyProduct(req, res) {
    res.send(`Product ${req.params.id} modified`);
}

export function deleteProduct(req, res) {
    res.send(`Product ${req.params.id} deleted`);
}

