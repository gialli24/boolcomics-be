const connection = require("../database/db")


const index = (req, res) => {
    const sql = 'SELECT * FROM categories'
    connection.query(sql, (err, result) =>{
        if(err) return res.json({message: 'Inernal Server Error'})
        
        if(result.length == 0) return res.json({message: 'No categories found'})

        res.json(result)

    })

   
}


const show = (req, res) => {
    const id = parseInt(req.params.id)
    const sql = 'SELECT * FROM categories WHERE id = ?'
    
    connection.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: 'Inernal Server Error'})
        
        if(result.length == 0) return res.json({message: 'Category not found'})

        res.json(result[0])
    })
}

module.exports = { index, show} 