const { fetchStockPrice } = require('../services/stockservices');
const { findUserById, updateBalance } = require('../models/usermodel');
const { 
  getHolding, upsertHolding, reduceHolding, 
  logTransaction 
} = require('../models/stockmodel');

// Search page — GET /stocks/search
const getSearch = (req, res) => {
  res.render('stocks/search', { result: null, error: null });
};

// Handle search form — POST /stocks/search
const postSearch = async (req, res) => {
  try {
    const { symbol } = req.body;
    const result = await fetchStockPrice(symbol.toUpperCase().trim());
    res.render('stocks/search', { result, error: null });
  } catch (err) {
    res.render('stocks/search', { result: null, error: 'Stock not found. Check the symbol and try again.' });
  }
};

// Dashboard — GET /dashboard
const getDashboard = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    res.render('dashboard', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/auth/login');
  }
};

// Show buy form — GET /stocks/buy?symbol=RELIANCE&price=1247.30
const getBuy = async (req, res) => {
  try {
    const { symbol, price } = req.query;
    if (!symbol || !price) return res.redirect('/stocks/search');

    const user = await findUserById(req.user.userId);
    res.render('stocks/buy', { 
      symbol, 
      price: parseFloat(price), 
      user, 
      error: null 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/stocks/search');
  }
};

// Handle buy form submit — POST /stocks/buy
const postBuy = async (req, res) => {
  try {
    const { symbol, price, quantity } = req.body;
    const qty = parseInt(quantity);
    const pricePerShare = parseFloat(price);
    const totalCost = qty * pricePerShare;

    const user = await findUserById(req.user.userId);

    // Check if user has enough balance
    if (totalCost > user.balance) {
      return res.render('stocks/buy', {
        symbol, price: pricePerShare, user,
        error: `Insufficient balance. You need ₹${totalCost.toFixed(2)} but have ₹${Number(user.balance).toFixed(2)}`
      });
    }

    // Deduct balance
    const newBalance = parseFloat(user.balance) - totalCost;
    await updateBalance(req.user.userId, newBalance);

    // Update holdings
    await upsertHolding(req.user.userId, symbol, qty, pricePerShare);

    // Log the transaction
    await logTransaction(req.user.userId, symbol, 'buy', qty, pricePerShare, totalCost);

    res.redirect('/portfolio');
  } catch (err) {
    console.error(err);
    res.redirect('/stocks/search');
  }
};

// Show sell form — GET /stocks/sell?symbol=RELIANCE
const getSell = async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.redirect('/portfolio');

    const holding = await getHolding(req.user.userId, symbol);
    if (!holding) return res.redirect('/portfolio');

    const stockData = await fetchStockPrice(symbol);
    const user = await findUserById(req.user.userId);

    res.render('stocks/sell', {
      symbol,
      currentPrice: stockData.price,
      holding,
      user,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/portfolio');
  }
};

// Handle sell form submit — POST /stocks/sell
const postSell = async (req, res) => {
  try {
    const { symbol, price, quantity } = req.body;
    const qty = parseInt(quantity);
    const pricePerShare = parseFloat(price);
    const totalEarned = qty * pricePerShare;

    const holding = await getHolding(req.user.userId, symbol);
    if (!holding || holding.quantity < qty) {
      const user = await findUserById(req.user.userId);
      return res.render('stocks/sell', {
        symbol, currentPrice: pricePerShare, holding, user,
        error: `You only own ${holding ? holding.quantity : 0} shares of ${symbol}`
      });
    }

    const user = await findUserById(req.user.userId);
    const newBalance = parseFloat(user.balance) + totalEarned;
    await updateBalance(req.user.userId, newBalance);

    await reduceHolding(req.user.userId, symbol, qty);
    await logTransaction(req.user.userId, symbol, 'sell', qty, pricePerShare, totalEarned);

    res.redirect('/portfolio');
  } catch (err) {
    console.error(err);
    res.redirect('/portfolio');
  }
};

module.exports = { 
  getSearch, postSearch, getDashboard,
  getBuy, postBuy, getSell, postSell
};