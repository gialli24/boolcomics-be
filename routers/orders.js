const express = require('express');
const router = express.Router();

const { index, show, create, update, modify, destroy } = require('../controllers/ordersController');

router.get('/', index);
router.get('/:id', show);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id', modify);
router.delete('/:id', destroy);

module.exports = router;