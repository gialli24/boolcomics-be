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
router.get('/:slug', show);

// CREATE prodotto
router.post('/', create);

// UPDATE prodotto
router.put('/:slug', update);

// DELETE prodotto
router.delete('/:slug', destroy);

module.exports = router;