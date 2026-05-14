const connection = require("../database/db");

const create = (req, res) => {
    const { street, city, state, zip_code, country } = req.body;


    // VALIDAZIONE CAMPI
    for (const key in req.body) {

        const element = req.body[key]



        // Controllo campi vuoti
        if (!element) return res.status(400).json({ message: "Dati mancanti" });


        // Validazione indirizzo
        if (key === 'street') {
            if (element.length < 3) return res.status(400).json({ message: 'Via non valida, deve avere almeno 3 caratteri' })
        }


        if (key === 'city') {
            if (element.length < 2) return res.status(400).json({ message: 'Città non valida, deve avere almeno 3 caratteri' })
        }


        if (key === 'state') {
            const stateRegex = /^[A-Z]{2}$/;
            if (!stateRegex.test(element.toUpperCase())) return res.status(400).json({ message: 'Stato non valido, deve essere composto da 2 lettere maiuscole' })

        }

        if (key === 'zip_code') {
            const zipCodeRegex = /^\d{5}$/;
            if (!zipCodeRegex.test(element)) return res.status(400).json({ message: 'CAP non valido' })
        }


        if (key === 'country') {
            if (element.length < 3) return res.status(400).json({ message: 'Paese non valido, deve avere almeno 3 caratteri' })

        }


    }
    // 1. Check if already exists in database
    const sql = "SELECT id FROM addresses WHERE street = ? AND city = ? AND state = ? AND zip_code = ? AND country = ?";

    connection.query(sql, [street, city, state, zip_code, country], (err, results) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });

        // 2. If exists return id
        if (results.length > 0) {
            return res.json({ message: 'Indirizzo già esistente', id: results[0].id });
        }

        // 3. Else create new address and return id
        const createAddress = "INSERT INTO addresses (street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?)";
        connection.query(createAddress, [street, city, state, zip_code, country], (err, result) => {
            if (err) return err;

            return res.json({ message: 'Indirizzo creato con successo', id: result.insertId });
        });

    });
};

module.exports = { create };