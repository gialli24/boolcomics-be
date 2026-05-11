const express = require('express');
const router = express.Router();

const {
    index,
    show,
    mostPurchased,
    lastArrived
} = require('../controllers/productsController');

// ROUTES

// Most Purchased
router.get('/most-purchased', mostPurchased);

// Last Arrived
router.get('/last-arrived', lastArrived);

// GET tutti i prodotti
router.get('/', index);

// GET singolo prodotto
router.get('/:slug', show);



module.exports = router;