const connection = require('../database/db');

const index = (req, res) => {
    const sql = "SELECT * FROM orders";

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (results.length === 0) return res.status(404).json({ message: "Nessun ordine trovato" });

        res.json(results);
    });
}

const show = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = "SELECT * FROM orders WHERE id = ?";

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (results.length === 0) return res.status(404).json({ message: "Ordine non trovato" });

        res.json(results[0]);
    });
}

const create = (req, res) => {
    const { first_name, last_name, email, address, total_price, status, items } = req.body;


    const shipping_address = address;
    const billing_address = address;

    // 1. VALIDAZIONE DATI
    if (!first_name || !last_name || !email || !status || !shipping_address || !billing_address || !Array.isArray(items)) {

        return res.status(400).json({ message: "Dati mancanti o items non validi" });
    }

    //VALIDAZIONE ITEMS
    if (items.length === 0) {
        return res.status(400).json({ message: "Items non validi" });
    }

    // RECUPERO SLUGS DEI PRODOTTI PER CONTROLLO STOCK
    let productSql = `SELECT * FROM products WHERE slug IN (?)`;

    const slugs = items.map(item => item.slug )

    connection.query(productSql, [slugs], (err, products) => {
        if (err) return res.status(500).json({ message: "Errore database", error: err.message });

        if (products.length === 0) {
            return res.status(400).json({ message: "Nessun prodotto trovato per gli slug forniti" });
        }
        
        const orderedProducts = products


        // CONTROLLO STOCK
        const checkStockSql = `SELECT stock_quantity FROM products WHERE slug = ?`;

        orderedProducts.forEach(product => {

            connection.query(checkStockSql, [product.slug], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Errore database",
                        error: err.message
                    });
                }
                const dbProduct = results[0];

                //CONFRONTO STOCK CON QUANTITÀ RICHIESTA
                const item = items.find(i => i.slug === product.slug);
                if (!dbProduct || dbProduct.stock_quantity < item.quantity) {
                    return res.status(400).json({
                        message: "Stock insufficiente",
                        product: {
                            slug: product.slug,
                            available: dbProduct ? dbProduct.stock_quantity : 0,
                            requested: item.quantity
                        }
                    });
                }

                // CREAZIONE ORDINE
                const orderSql = `
                    INSERT INTO orders 
                    (first_name, last_name, email, status, total_price, shipping_address, billing_address)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                connection.query(orderSql, [first_name, last_name, email, status, total_price, shipping_address, billing_address], (err2, result) => {
                    if (err2) {
                        return res.status(500).json({
                            message: "Errore creazione ordine",
                            error: err2.message
                        });
                    }
                    const orderId = result.insertId;

                    // INSERIMENTO ITEMS ORDINE
                    const itemsSql = `
                    INSERT INTO order_items 
                    (order_id, product_id, quantity, price_at_purchase)
                    VALUES (?, ?, ?, ?)
                `;

                    connection.query(itemsSql, [orderId, product.id, item.quantity, product.price], (err3) => {
                        if (err3) {
                            return res.status(500).json({
                                message: "Errore inserimento items",
                                error: err3.message
                            });
                        }

                        // DECREMENTO STOCK
                        const updateStockSql = `
                            UPDATE products
                            SET stock_quantity = stock_quantity - ?
                            WHERE id = ?
                        `;
                        connection.query(updateStockSql, [item.quantity, product.id], (err4) => {
                            if (err4) {
                                console.log("Errore stock:", err4);
                            }
                            
                            return res.json({
                                message: "Ordine creato con successo",
                                orderId,
                                total_price
                            });
                        })
                        
                    })
                })

            })
        })
    })

}

/*  connection.query(productSql, [slugs], (err, products) => {
     if (err) return res.status(500).json({ message: "Errore database", error: err.message });
 
     const orderedProducts = products
     
     
     
     //  comprova stock per ogni prodotto
     const checkStockSql = `SELECT stock_quantity FROM products WHERE slug = ?`;
 
     let checked = 0;
     let errors = [];
 
     items.forEach(item => {
         connection.query(checkStockSql, [orderedProducts], (err, results) => {
             if (err) {
                 return res.status(500).json({
                     message: "Errore database",
                     error: err.message
                 });
 
             }
 
             const product = results[0];
 
             if (!product || product.stock_quantity < item.quantity) {
                 errors.push({
                     product_id: item.product_id,
                     available: product ? product.stock_quantity : 0,
                     requested: item.quantity
                 });
             }
 
             checked++;
 
             // quando finito controllo tutti i prodotti
             if (checked === cleanItems.length) {
 
                 if (errors.length > 0) {
                     return res.status(400).json({
                         message: "Stock insufficiente",
                         errors
                     });
                 }
 
                 // calcolo prezzo totale
                 const total_price = cleanItems.reduce((sum, item) => {
                     return sum + (item.price * item.quantity);
                 }, 0);
 
                 // creazione ordine
                 const orderSql = `
                     INSERT INTO orders 
                     (first_name, last_name, email, status, total_price, shipping_address, billing_address)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                 `;
 
                 connection.query(
                     orderSql,
                     [
                         first_name,
                         last_name,
                         email,
                         status,
                         total_price,
                         shipping_address,
                         billing_address
                     ],
                     (err2, result) => {
                         if (err2) {
                             return res.status(500).json({
                                 message: "Errore creazione ordine",
                                 error: err2.message
                             });
                         }
 
                         const orderId = result.insertId;
 
                         // inserimento items ordine
                         const itemsSql = `
                             INSERT INTO order_items 
                             (order_id, product_id, quantity, price_at_purchase)
                             VALUES ?
                         `;
 
                         const values = cleanItems.map(item => [
                             orderId,
                             item.product_id,
                             item.quantity,
                             item.price
                         ]);
 
                         connection.query(itemsSql, [values], (err3) => {
                             if (err3) {
                                 return res.status(500).json({
                                     message: "Errore inserimento items",
                                     error: err3.message
                                 });
                             }
 
                             // decremento stock
                             cleanItems.forEach(item => {
                                 const updateStockSql = `
                                     UPDATE products
                                     SET stock_quantity = stock_quantity - ?
                                     WHERE id = ?
                                 `;
 
                                 connection.query(
                                     updateStockSql,
                                     [item.quantity, item.product_id],
                                     (err4) => {
                                         if (err4) {
                                             console.log("Errore stock:", err4);
                                         }
                                     }
                                 );
                             });
 
                             return res.json({
                                 message: "Ordine creato con successo",
                                 orderId,
                                 total_price
                             });
                         });
                     }
                 );
             }
         });
     });
     
 
 }) */


/* const update = (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, email, status, total_price, shipping_address, billing_address } = req.body;
 
    if (!first_name || !last_name || !email || !status || !total_price || !shipping_address || !billing_address) {
        return res.status(400).json({ message: "Dati mancanti" });
    }
 
    const sql = `UPDATE orders SET first_name = ?, last_name = ?, email = ?, status = ?, total_price = ?, shipping_address = ?, billing_address = ? WHERE id = ?`;
 
    connection.query(sql, [first_name, last_name, email, status, total_price, shipping_address, billing_address, id], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");
 
        if (results.affectedRows === 0) return res.status(404).json({ error: "Nessun elemento da aggiornare" });
 
        res.status(200).json({ message: `Ordine ${id} aggiornato con successo` });
    });
 
}
 
const modify = (req, res) => {
    const id = parseInt(req.params.id);
    let { first_name, last_name, email, status, total_price, shipping_address, billing_address } = req.body;
 
    const originalSql = `SELECT * FROM orders WHERE id = ?`;
 
    connection.query(originalSql, [id], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");
 
        if (results.length === 0) return res.status(404).json({ error: "Elemento non trovato" });
 
        const originalData = results[0];
 
        first_name = first_name || originalData.first_name;
        last_name = last_name || originalData.last_name;
        email = email || originalData.email;
        status = status || originalData.status;
        total_price = total_price || originalData.total_price;
        shipping_address = shipping_address || originalData.shipping_address;
        billing_address = billing_address || originalData.billing_address;
 
        const modifySql = `UPDATE orders SET first_name = ?, last_name = ?, email = ?, status = ?, total_price = ?, shipping_address = ?, billing_address = ? WHERE id = ?`;
 
        connection.query(modifySql, [first_name, last_name, email, status, total_price, shipping_address, billing_address, id], (err, results) => {
            if (err) return res.status(500).json("Internal Server Error");
 
            if (results.length === 0) return res.status(404).json({ error: "Elemento non trovato" });
 
            res.status(200).json({ message: `Ordine ${id} modificato con successo` });
        });
 
    });
 
}
*/


const destroy = (req, res) => {
    const id = parseInt(req.params.id);

    const getItemsSql = `SELECT product_id, quantity FROM order_items WHERE order_id = ?`;

    connection.query(getItemsSql, [id], (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        if (items.length === 0) {
            return res.status(404).json({ error: "Order not found or no items" });
        }

        // incrementa stock
        items.forEach(item => {
            const updateStockSql = `
                UPDATE products
                SET stock_quantity = stock_quantity + ?
                WHERE id = ?
            `;

            connection.query(updateStockSql, [item.quantity, item.product_id], (err2) => {
                if (err2) {
                    console.log("Errore incremento stock:", err2);
                }
            });
        });

        // elimina items
        const deleteItemsSql = `DELETE FROM order_items WHERE order_id = ?`;

        connection.query(deleteItemsSql, [id], (err3) => {
            if (err3) return res.status(500).json({ error: err3.message });

            // 4. elimina ordine
            const deleteOrderSql = `DELETE FROM orders WHERE id = ?`;

            connection.query(deleteOrderSql, [id], (err4, result) => {
                if (err4) return res.status(500).json({ error: err4.message });

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Order not found" });
                }

                return res.json({
                    message: `Ordine ${id} eliminato e stock ripristinato`
                });
            });
        });
    });
};

module.exports = { index, show, create, destroy };