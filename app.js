const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Test route
app.get('/', (req, res) => {
  res.send('StockSim server is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const authRoutes = require('./routes/authroutes');
const authMiddleware = require('./middleware/authmiddleware');

// Routes
app.use('/auth', authRoutes);

// Protected dashboard route


// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

const stockRoutes = require('./routes/stockroutes');
const { getDashboard } = require('./controllers/stockcontroller');

app.use('/stocks',stockRoutes);

// Replace the old dashboard route with this
app.get('/dashboard', authMiddleware, getDashboard);
const portfolioroutes = require('./routes/portfolioroutes');
app.use('/portfolio', portfolioroutes);
const transactionRoutes = require('./routes/transactionroutes');
const leaderboardRoutes = require('./routes/leaderboardroutes');
const watchlistRoutes = require('./routes/watchlistroutes');

app.use('/transactions', transactionRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/watchlist', watchlistRoutes);