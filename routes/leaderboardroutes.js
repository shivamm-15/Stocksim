const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { getLeaderboard } = require('../controllers/leaderboardcontroller');

router.get('/', authMiddleware, getLeaderboard);

module.exports = router;