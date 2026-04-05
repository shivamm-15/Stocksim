const { addToWatchlist, removeFromWatchlist, getWatchlist, isInWatchlist } = require('../models/stockmodel');
const { fetchStockPrice } = require('../services/stockservices');

const getWatchlistPage = async (req, res) => {
  try {
    const watchlist = await getWatchlist(req.user.userId);

    // Fetch live price for each watched stock
    const watchlistData = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const stockData = await fetchStockPrice(item.symbol);
          return {
            symbol: item.symbol,
            price: stockData.price,
            companyName: stockData.companyName
          };
        } catch {
          return { symbol: item.symbol, price: null, companyName: item.symbol };
        }
      })
    );

    res.render('watchlist', { watchlist: watchlistData });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

const postAddWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    await addToWatchlist(req.user.userId, symbol.toUpperCase().trim());
    res.redirect('/watchlist');
  } catch (err) {
    console.error(err);
    res.redirect('/watchlist');
  }
};

const postRemoveWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    await removeFromWatchlist(req.user.userId, symbol);
    res.redirect('/watchlist');
  } catch (err) {
    console.error(err);
    res.redirect('/watchlist');
  }
};

module.exports = { getWatchlistPage, postAddWatchlist, postRemoveWatchlist };