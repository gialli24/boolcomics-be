const express = require('express');
const router = express.Router();


const { validate } = require('../controllers/cuponsController');


router.post('/', validate);

module.exports = router;