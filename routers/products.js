const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productsController');

// ROUTES

// GET tutti i prodotti
router.get('/', getAllProducts);

// GET singolo prodotto
router.get('/:id', getProductById);

// CREATE prodotto
router.post('/', createProduct);

// UPDATE prodotto
router.put('/:id', updateProduct);

// DELETE prodotto
router.delete('/:id', deleteProduct);

module.exports = router;