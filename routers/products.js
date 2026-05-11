const express = require('express');
const router = express.Router();

const {
    index,
    show,
    mostPurchased
} = require('../controllers/productsController');

// ROUTES

// Most Purchased
router.get('/most-purchased', mostPurchased);

// GET tutti i prodotti
router.get('/', index);

// GET singolo prodotto
router.get('/:slug', show);



module.exports = router;