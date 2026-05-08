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
    const { first_name, last_name, email, status, total_price, shipping_address, billing_address } = req.body;

    if (!first_name || !last_name || !email || !status || !total_price || !shipping_address || !billing_address) {
        return res.status(400).json({ message: "Dati mancanti" });
    }

    const sql = "INSERT INTO orders (first_name, last_name, email, status, total_price, shipping_address, billing_address) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(sql, [first_name, last_name, email, status, total_price, shipping_address, billing_address], (err, results) => {
        if (err) return res.status(500).json("Internal Server Error");

            const newSql = `SELECT * FROM orders ORDER BY id DESC LIMIT 1`
            connection.query(newSql, (err, newResults) => {
                if (err) return res.status(500).json("Internal Server Error");
                console.log(newResults);

                if(newResults.length === 0) return res.status(404).json({message: "Ordine non aggiunto"})
                
                res.json({ 
                    message: "Elemento aggiunto con successo",
                    newElement: newResults[0]
                })
            } )
        
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

const destroy = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = `DELETE FROM orders WHERE id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database internal error' + err });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Order Not found' })

        res.status(200).json({ message: `Ordine ${id} eliminato con successo` });
    });


};

module.exports = { index, show, create, update, modify, destroy };