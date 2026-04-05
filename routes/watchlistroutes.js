const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { getWatchlistPage, postAddWatchlist, postRemoveWatchlist } = require('../controllers/watchlistcontroller');

router.get('/', authMiddleware, getWatchlistPage);
router.post('/add', authMiddleware, postAddWatchlist);
router.post('/remove', authMiddleware, postRemoveWatchlist);

module.exports = router;