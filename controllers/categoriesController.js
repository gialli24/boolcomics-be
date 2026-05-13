const connection = require("../database/db")


const index = (req, res) => {
    const sql = 'SELECT * FROM categories'
    connection.query(sql, (err, result) =>{
        if(err) return res.json({message: 'Internal Server Error'})
        
        if(result.length == 0) return res.json({message: 'Nessuna categoria trovata'})

        res.json(result)

    })

   
}


const show = (req, res) => {
    const id = parseInt(req.params.id)
    const sql = 'SELECT * FROM categories WHERE id = ?'
    
    connection.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: 'Internal Server Error'})
        
        if(result.length == 0) return res.json({message: 'Categoria non trovata'})

        res.json(result[0])
    })
}

module.exports = { index, show} 