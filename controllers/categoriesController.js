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

    sql = 'SELECT * FROM categories WHERE id = ?'
    connection.query(sql, [req.params.id], (err, result) =>{
        if(err) return res.json({message: 'Inernal Server Error'})
        
        if(result.length == 0) return res.json({message: 'Category not found'})

        res.json(result[0])
    })
}

module.exports = { index, show} 