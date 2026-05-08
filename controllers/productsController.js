const connection = require('../database/db');


// INDEX 
const index = (req, res) => {
    const sql = 'SELECT * FROM products';

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
};


// SHOW 
const show = (req, res) => {
    const slug = req.params.slug;

    const sql = 'SELECT * FROM products WHERE slug = ?';

    connection.query(sql, [slug], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        res.json(results[0]);
    });
};


// CREATE 
const create = (req, res) => {
    const {
        name,
        slug,
        description,
        genre,
        author,
        release_date,
        publisher,
        binding,
        ean,
        price,
        original_price,
        stock_quantity,
        image_url
    } = req.body;

     
    const sql = `
        INSERT INTO products 
        (name, slug, description, genre, author, release_date, publisher, binding, ean, price, original_price, stock_quantity, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
        name,
        slug,
        description,
        genre,
        author,
        release_date,
        publisher,
        binding,
        ean,
        price,
        original_price,
        stock_quantity,
        image_url
   ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Prodotto creato",
            slug: result.insertId
        });
    });
};


// UPDATE
const update = (req, res) => {
    const slug = req.params.slug;

    if (isNaN(slug)) {
        return res.status(400).json({ message: "ID non valido" });
    }

    const {
        name,
        description,
        genre,
        author,
        price,
        stock_quantity
    } = req.body;

    const sql = `
        UPDATE products 
        SET 
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            genre = COALESCE(?, genre),
            author = COALESCE(?, author),
            price = COALESCE(?, price),
            stock_quantity = COALESCE(?, stock_quantity)
        WHERE slug = ?
    `;

    const values = [
        name,
        description,
        genre,
        author,
        price,
        stock_quantity,
        slug
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        res.json({ message: "Prodotto aggiornato" });
    });
};


// DESTROY
const destroy = (req, res) => {
    const slug = req.params.slug;

    const sql = 'DELETE FROM products WHERE slug = ?';

    connection.query(sql, [slug], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        res.json({ message: "Prodotto eliminato" });
    });
};


// EXPORT
module.exports = {
    index,
    show,
    create,
    update,
    destroy
};