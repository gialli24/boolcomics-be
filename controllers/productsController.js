const connection = require('../database/db');

// genera slug
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};


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
/* const create = (req, res) => {
    const {
        name,
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

    if (!name || !price || !ean) {
        return res.status(400).json({
            message: "name, price ed ean sono obbligatori"
        });
    }

    const slug = generateSlug(name);

    // controllo duplicato slug
    connection.query(
        'SELECT id FROM products WHERE slug = ?',
        [slug],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Slug già esistente"
                });
            }

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

            connection.query(sql, values, (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({
                    message: "Prodotto creato",
                    slug
                });
            });
        }
    );
}; */


// UPDATE
/* const update = (req, res) => {
    const slug = req.params.slug;

    const {
        name,
        description,
        genre,
        author,
        price,
        stock_quantity
    } = req.body;

    let sql = `
        UPDATE products 
        SET 
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            genre = COALESCE(?, genre),
            author = COALESCE(?, author),
            price = COALESCE(?, price),
            stock_quantity = COALESCE(?, stock_quantity)
    `;

    const values = [
        name,
        description,
        genre,
        author,
        price,
        stock_quantity
    ];

    // aggiorna slug se cambia nome
    if (name) {
        const newSlug = generateSlug(name);

        sql += `, slug = ?`;
        values.push(newSlug);
    }

    sql += ` WHERE slug = ?`;
    values.push(slug);

    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Prodotto non trovato" });
        }

        res.json({ message: "Prodotto aggiornato" });
    });
}; */


// DESTROY
/* const destroy = (req, res) => {
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
 */
/* Most Purchased */
const mostPurchased = (req, res) => {
    const sql = `
        SELECT
            products.*,
            SUM(order_items.quantity) AS total_sold
        FROM products
        JOIN order_items ON products.id = order_items.product_id
        GROUP BY products.id
        ORDER BY total_sold DESC
        LIMIT 10;`;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (results.length === 0) return res.status(404).json({ message: "Nessun ordine trovato" });

        res.json(results);
    });
};


// EXPORT
module.exports = {
    index,
    show,
    mostPurchased
};