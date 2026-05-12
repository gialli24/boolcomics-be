const express = require("express");
const router = express.Router();

const { create } = require("../controllers/addressesController")

router.post('/', create);

module.exports = router;