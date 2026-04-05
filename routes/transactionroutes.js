const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { getTransactions } = require('../controllers/transactioncontroller');

router.get('/', authMiddleware, getTransactions);

module.exports = router;