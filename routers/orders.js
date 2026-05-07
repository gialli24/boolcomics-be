const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');

router.get('/', ordersController.index);
router.get('/:id', ordersController.show);
router.post('/', ordersController.create);
router.put('/:id', ordersController.update);
router.delete('/:id', ordersController.destroy);

module.exports = router;