const connection = require("../database/db")


const index = (req, res) => {
    const sql = 'SELECT * FROM products';

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


const show = (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const id = parseInt(req.params.id)

    connection.query(sql, [id], (err, productsResults) => {
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

            //console.log(productsResults);
            
            res.json(productsResults);
        });
    });

}