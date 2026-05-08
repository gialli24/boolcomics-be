const connection = require('../database/db');

const orders = [
    {
        id: 1,
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@gmail.com"
    },
    {
        id: 2,
        first_name: "Luca",
        last_name: "Bianchi",
        email: "luca.bianchi@gmail.com"
    }
]

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

        res.send(results[0]);
    });
}

const create = (req, res) => {
    const { first_name, last_name, email, status, total_price, shipping_address, billing_address } = req.body;

    if (!first_name || !last_name || !email || !status || !total_price || !shipping_address || !billing_address) {
        return res.status(400).json({ message: "Dati mancanti" });
    }

    const sql = "INSERT INTO orders (first_name, last_name, email, status, total_price, shipping_address, billing_address) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(sql, [first_name, last_name, email, status, total_price, shipping_address, billing_address], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        res.status(201).json({
            id: results.insertId,
            message: "Ordine creato con successo"
        });
    });
}

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, email, status, total_price, shipping_address, billing_address } = req.body;

    if (!first_name || !last_name || !email || !status || !total_price || !shipping_address || !billing_address) {
        return res.status(400).json({ message: "Dati mancanti" });
    }

    const sql = `UPDATE orders SET first_name = ?, last_name = ?, email = ?, status = ?, total_price = ?, shipping_address = ?, billing_address = ? WHERE id = ?`;

    connection.query(sql, [first_name, last_name, email, status, total_price, shipping_address, billing_address, id], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

        if (results.affectedRows === 0) return res.status(404).json({ error: "Nessun elemento da aggiornare" });
        console.log(results);

        res.send({ message: "Ordine aggiornato con successo" });
    });

}

const destroy = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = `DELETE FROM orders WHERE id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database internal error' });
        if (results.length === 0) return res.status(404).json({ error: 'Order Not found' })

        res.json({ id })
    });


};

module.exports = { index, show, create, update, destroy };