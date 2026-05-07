const express = require('express');
const router = express.Router();

const {
    index,
    show,
    create,
    update,
    destroy
} = require('../controllers/productsController');

// ROUTES

// GET tutti i prodotti
router.get('/', index);

// GET singolo prodotto
router.get('/:id', show);

// CREATE prodotto
router.post('/', create);

// UPDATE prodotto
router.put('/:id', update);

// DELETE prodotto
router.delete('/:id', destroy);

module.exports = router;