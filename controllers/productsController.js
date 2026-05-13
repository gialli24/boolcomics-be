const connection = require('../database/db');

// Slug Generator
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

// Index
const index = (req, res) => {
    let sql = 'SELECT * FROM products';

    const search = req.query.search;
    if (search) {
        sql += ` WHERE name LIKE '%${search}%'`;
    }

    const sorts = req.query.sort;

    switch (sorts) {
        case "price_asc":
            sql += ' ORDER BY price ASC';
            break;
        case "price_desc":
            sql += ' ORDER BY price DESC';
            break;
        case "name_asc":
            sql += ' ORDER BY name ASC';
            break;
        case "date_asc":
            sql += ' ORDER BY release_date ASC';
            break;
        case "date_desc":
            sql += ' ORDER BY release_date DESC';
            break;
        default:
            if (sorts === "") return res.status(400).json({ message: "Parametro di ordinamento non valido (sort)" });
            break;
    }

    connection.query(sql, (err, productsResults) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (productsResults.length === 0) {
            return res.status(404).json({ message: "Nessun prodotto trovato" });
        }

        const categoriesSql = `
            SELECT category_products.product_id, categories.name, categories.slug
            FROM category_products
            JOIN categories ON category_products.category_id = categories.id
        `;

        connection.query(categoriesSql, (err, categoriesResults) => {
            if (err) return res.status(500).json("Internal Server Error");

            // Attach categories to their respective products
            productsResults.forEach(product => {
                // Filter the global categories list for this specific product_id
                product.categories = categoriesResults.filter(cat => cat.product_id === product.id);

                // Optional: remove product_id from the category object to keep the JSON clean
                product.categories.forEach(cat => delete cat.product_id);
            });

            res.json(productsResults);
        });
    });
}


// Show
const show = (req, res) => {
    const productSql = 'SELECT * FROM products WHERE slug = ?';

    const comucs_slug = req.params.slug


    // Execute the query to get the product details
    connection.query(productSql, [comucs_slug], (err, results) => {
        if (err) return res.status(500).json({ message: "Internal Server Error" })

        if (results.length === 0) return res.status(404).json({ message: "Prodotto non trovato" })

        const product = results[0]


        const categoryProduct = `
                                SELECT categories.name, categories.slug
                                FROM category_products
                                JOIN categories ON category_products.category_id = categories.id
                                JOIN products ON products.id = category_products.product_id
                                WHERE products.slug = ?
                                `
        // Execute the query to get the categories associated
        connection.query(categoryProduct, [comucs_slug], (err, categories) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" })

            product.categories = categories

            res.json(product)


        })
    })



}

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

// last arrived
const lastArrived = (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY created_at DESC LIMIT 10'
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (results.length === 0) return res.status(404).json({ message: "Nessun nuovo arrivo trovato" });

        res.json(results)
    })


}
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



// EXPORT
module.exports = {
    index,
    show,
    mostPurchased,
    lastArrived
};