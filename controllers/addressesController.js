const connection = require("../database/db");

const create = (req, res) => {
    const { street, city, state, zip_code, country } = req.body;

    // 1. Check if already exists in database
    const sql = "SELECT id FROM addresses WHERE street = ? AND city = ? AND state = ? AND zip_code = ? AND country = ?";

    connection.query(sql, [street, city, state, zip_code, country], (err, results) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });

        // 2. If exists return id
        if (results.length > 0) {
            return res.json({ id: results[0].id });
        }

        // 3. Else create new address and return id
        const createAddress = "INSERT INTO addresses (street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?)";
        connection.query(createAddress, [street, city, state, zip_code, country], (err, result) => {
            if (err) return err;

            return res.json({ id: result.insertId });
        });

    });
};

module.exports = { create };