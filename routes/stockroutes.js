const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { 
  getSearch, postSearch,
  getBuy, postBuy,
  getSell, postSell
} = require('../controllers/stockcontroller');

router.get('/search', authMiddleware, getSearch);
router.post('/search', authMiddleware, postSearch);
router.get('/buy', authMiddleware, getBuy);
router.post('/buy', authMiddleware, postBuy);
router.get('/sell', authMiddleware, getSell);
router.post('/sell', authMiddleware, postSell);

module.exports = router;