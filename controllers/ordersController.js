const e = require('cors');
const connection = require('../database/db');

const fs = require('fs');

let htmlTemplateUser = fs.readFileSync('./email-template/order_email.html', 'utf8');
let htmlTemplateAdmin = fs.readFileSync('./email-template/seller_email.html', 'utf8');

const TOKEN = process.env.TOKEN || "token";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@demomailtrap.co";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin_token";

const { MailtrapClient } = require("mailtrap");
function sendEmail(email, template, typeOfToken, data, orderedProducts) {

    const { first_name, order_date, total_price, shipping_cost, discount_percentage, discount_amount, productsPrice, items } = data;

    // Capitalize first_name
    const capitalizedName = first_name.charAt(0).toUpperCase() + first_name.slice(1);

    const date = new Date(order_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formatted_date = date.toLocaleDateString('it-IT', options);

    let productsMarkup = "";


    orderedProducts.forEach(order => {
        productsMarkup += `
            <div class="product-box">
                <div class="product-image">
                    <!-- Placeholder image square -->
                    <div style="width:100px; height:130px; background-color:#f0f0f0; border:1px solid #ddd;">
                        <img src="http://localhost:3000${order.image_url}" alt="${order.name}" />
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-name">${order.name}</div>
                    <div class="product-meta">${order.slug}</div>
                    <div class="product-meta">${order.description}</div>
                    <div class="product-meta">${order.quantity} unità</div>
                    <div class="product-price">${order.price} &euro;</div>
                </div>
            </div>
        `
    });


    template = template
        .replace('{{first_name}}', capitalizedName)
        .replace('{{order_id}}', "ZX789W&-568WE")
        .replace('{{order_date}}', formatted_date)
        .replace('{{items}}', productsMarkup)
        .replace('{{subtotal}}', Math.floor(productsPrice * 100) / 100)
        .replace('{{total_price}}', Math.floor(total_price * 100) / 100)
        .replace('{{shipping_cost}}', Math.floor(shipping_cost * 100) / 100);

    if (discount_amount > 0) {
        template = template
            .replace('{{discount_amount}}', "-" + discount_amount)
            .replace('{{discount_percentage}}', "(" + discount_percentage + '%)')
    } else {
        template = template
            .replace('{{discount_amount}}', "0.00€")
            .replace('{{discount_percentage}}', "")
    }

    const client = new MailtrapClient({
        token: typeOfToken
    });

    const sender = {
        email: "hello@demomailtrap.co",
        name: "E-commerce",
    };
    const recipients = [
        {
            email: email,
            name: "E-commerce"
        }
    ];

    client
        .send({
            from: sender,
            to: recipients,
            subject: "Notifica",
            html: template,
            category: "Generale",
        })
        .then(console.log, console.error);

}

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
    const {
        first_name,
        last_name,
        email,
        address,
        status,
        items,
        card_name,
        card_number,
        card_expiry,
        card_cvv

    } = req.body;

    let { total_price, shipping_cost, discount_percentage, discount_amount } = req.body;


    // NORMALIZZAZIONE DATI
    total_price = Number(total_price)
    shipping_cost = Number(shipping_cost)
    discount_percentage = Number(discount_percentage)
    discount_amount = Number(discount_amount)


    const shipping_address = address;
    const billing_address = address;

    // VALIDAZIONE DATI
    for (const key in req.body) {

        const element = req.body[key]


        // Controllo campi vuoti
        if (!element) return res.status(400).json({ message: "Dati mancanti o prodotti non validi" });

        // Validazione items
        if (key === 'items' && (!Array.isArray(items) || element.length === 0)) return res.status(400).json({ message: 'Prodotti non validi' })

        // Validazione numerica per total_price e shipping_cost    
        if (key === 'total_price' || key === 'shipping_cost') {
            const value = Number(element);

            if (isNaN(value)) return res.status(400).json({ message: `Il campo ${key} deve essere un numero valido` })
        }

        // Validazione carta di credito
        if (key === 'card_name') {
            if (element.length < 3) return res.status(400).json({ message: 'Nome sulla carta non valido' })
        }

        if (key === 'card_number') {
            const cardNumberRegex = /^\d{16}$/;
            if (!cardNumberRegex.test(element)) return res.status(400).json({ message: 'Numero di carta non valido' })
        }

        if (key === 'card_expiry') {
            const cardExpiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!cardExpiryRegex.test(element)) return res.status(400).json({ message: 'Data di scadenza non valida' })
        }
        if (key === 'card_cvv') {
            const cardCvvRegex = /^\d{3}$/;
            if (!cardCvvRegex.test(element)) return res.status(400).json({ message: 'CVV non valido' })
        }



    }


    // VALIDAZIONE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Formato email non valido' });

    // VALIDAZIONE NOME E COGNOME
    if (first_name.length < 3 || last_name.length < 3) return res.status(400).json({ message: 'Nome e cognome devono avere almeno 3 caratteri' });

    const productsPrice = total_price - shipping_cost + discount_amount

    // VALIDAZIONE SPEDIZIONE GRATUITA 
    if (parseInt(shipping_cost) === 0 && parseInt(productsPrice) <= 50) return res.status(403).json({ message: 'Spedizione gratutita non applicabile' })
    if (parseInt(shipping_cost) !== 0 && parseInt(productsPrice) > 50) return res.status(403).json({ message: 'Spedizione non gratuita applicabile' })

    const order_date = new Date().toISOString().slice(0, 10);

    const data = {
        first_name,
        last_name,
        email,
        status,
        total_price,
        shipping_cost,
        discount_percentage,
        discount_amount,
        productsPrice,
        shipping_address,
        billing_address,
        products: [],
        order_date,
        status
    }


    // VALIDAZIONE ITEMS
    if (items.length === 0) {
        return res.status(400).json({ message: "Prodotti non validi" });
    }

    // RECUPERO SLUGS DEI PRODOTTI PER CONTROLLO STOCK
    let productSql = `SELECT * FROM products WHERE slug IN (?)`;

    const slugs = items.filter(item => item.slug !== "").map(item => item.slug);

    // If dupliated send error
    if (new Set(slugs).size !== slugs.length) {
        return res.status(400).json({ message: "Slug duplicati" });
    }

    if (slugs.length !== items.length) {
        return res.status(400).json({ message: "Slug non validi" });
    }

    connection.query(productSql, [slugs], (err, products) => {
        if (err) return res.status(500).json({ message: "Errore database", error: err.message });


        if (products.length === 0 || products.length !== slugs.length) {
            return res.status(400).json({ message: "Uno o più prodotti non trovati per gli slug/s forniti" });
        }

        const orderedProducts = products;


        // Check if items quantity requested 0
        const cleanItems = items.filter(item => item.quantity === 0);

        if (cleanItems.length > 0) {
            return res.status(400).json({
                message: "Quantità non valida",
                errors: cleanItems
            });
        }

        // CONTROLLO STOCK IN MEMORIA
        let stockErrors = [];
        orderedProducts.forEach(product => {
            const item = items.find(i => i.slug === product.slug);

            if (product.stock_quantity < item.quantity) {
                stockErrors.push({
                    slug: product.slug,
                    available: product.stock_quantity,
                    requested: item.quantity
                });
            } else {
                product.quantity = item.quantity;
                data.products.push(product);
            }
        });

        if (stockErrors.length > 0) {
            return res.status(400).json({
                message: "Stock insufficiente",
                errors: stockErrors
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

            // INSERIMENTO ITEMS ORDINE (Bulk Insert)
            const itemsSql = `
                INSERT INTO order_items 
                (order_id, product_id, quantity, price_at_purchase)
                VALUES ?
            `;

            const itemsValues = orderedProducts.map(product => [
                orderId,
                product.id,
                product.quantity,
                product.price
            ]);

            connection.query(itemsSql, [itemsValues], (err3) => {
                if (err3) {
                    return res.status(500).json({
                        message: "Errore inserimento prodotti ordine",
                        error: err3.message
                    });
                }

                // DECREMENTO STOCK
                let completedUpdates = 0;
                let hasUpdateErrors = false;

                orderedProducts.forEach(product => {
                    const updateStockSql = `
                        UPDATE products
                        SET stock_quantity = stock_quantity - ?
                        WHERE id = ?
                    `;

                    connection.query(updateStockSql, [product.quantity, product.id], (err4) => {
                        if (err4) {
                            console.log("Errore stock:", err4);
                            if (!hasUpdateErrors) {
                                hasUpdateErrors = true;
                                return res.status(500).json({ message: "Errore aggiornamento stock", error: err4.message });
                            }
                        }

                        if (!hasUpdateErrors) {
                            completedUpdates++;
                            // Quando tutti gli update dello stock sono completati
                            if (completedUpdates === orderedProducts.length) {
                                sendEmail(email, htmlTemplateUser, TOKEN, data, orderedProducts);
                                /* sendEmail(ADMIN_EMAIL, htmlTemplateAdmin, ADMIN_TOKEN, data, orderedProducts); */



                                return res.json({
                                    message: "Ordine creato con successo",
                                    total_price
                                });
                            }
                        }
                    });
                });
            });
        });
    })

}


const destroy = (req, res) => {
    const id = parseInt(req.params.id);

    const getItemsSql = `SELECT product_id, quantity FROM order_items WHERE order_id = ?`;

    connection.query(getItemsSql, [id], (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        if (items.length === 0) {
            return res.status(404).json({ error: "Ordine non trovato o nessun prodotto associato" });
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
                    return res.status(404).json({ error: "Ordine non trovato" });
                }

                return res.json({
                    message: `Ordine ${id} eliminato e stock ripristinato`
                });
            });
        });
    });
};

module.exports = { index, show, create, destroy };