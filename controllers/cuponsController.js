const connection = require('../database/db');


const validate = (req, res) => {

    const { code } = req.body;

    // Validazione del codice sconto
    if (!code) return res.status(400).json({ message: 'Cupon richiesto', discount: false })

    const sql = 'SELECT * FROM discount_codes WHERE code = ?';
    connection.query(sql, [code], (err, result) => {

        // Gestione degli errori e risposta
        if (err) return res.status(500).json({ message: 'Internal Server Error' })

        // Se il codice sconto non viene trovato, restituisce un messaggio di errore
        if (result.length == 0) return res.status(404).json({ message: 'Cupon non trovato', discount: false })
        

        const cupon = result[0]

        // Verifica se il codice sconto è scaduto
        const currentDate = new Date();
        if (currentDate > cupon.valid_to) return res.status(400).json({ message: 'Cupon scaduto', discount: false })
        
        // Se il codice sconto è valido, restituisce i dettagli del cupon
        res.json({
            message: 'Cupon valido',
            discount: true,
            code: cupon.code,
            discount_percentage: cupon.discount_percentage
        })
        
    })


}
module.exports = { validate }