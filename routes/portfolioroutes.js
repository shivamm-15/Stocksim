const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { getPortfolio } = require('../controllers/portfoliocontroller');

router.get('/', authMiddleware, getPortfolio);

module.exports = router;