const { getHoldingsByUser } = require('../models/stockmodel');
const { findUserById } = require('../models/usermodel');
const { fetchStockPrice } = require('../services/stockservices');

const getPortfolio = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    const holdings = await getHoldingsByUser(req.user.userId);

    // For each holding, fetch live price and calculate P&L
    const portfolioData = await Promise.all(
      holdings.map(async (holding) => {
        try {
          const stockData = await fetchStockPrice(holding.symbol);
          const currentPrice = stockData.price;
          const investedValue = holding.avg_buy_price * holding.quantity;
          const currentValue = currentPrice * holding.quantity;
          const pnl = currentValue - investedValue;
          const pnlPercent = ((pnl / investedValue) * 100).toFixed(2);

          return {
            symbol: holding.symbol,
            quantity: holding.quantity,
            avgBuyPrice: parseFloat(holding.avg_buy_price),
            currentPrice,
            investedValue: investedValue.toFixed(2),
            currentValue: currentValue.toFixed(2),
            pnl: pnl.toFixed(2),
            pnlPercent
          };
        } catch (err) {
          // If price fetch fails for one stock, still show it
          return {
            symbol: holding.symbol,
            quantity: holding.quantity,
            avgBuyPrice: parseFloat(holding.avg_buy_price),
            currentPrice: null,
            investedValue: (holding.avg_buy_price * holding.quantity).toFixed(2),
            currentValue: null,
            pnl: null,
            pnlPercent: null
          };
        }
      })
    );

    // Total portfolio value
    const totalInvested = portfolioData.reduce((sum, s) => sum + parseFloat(s.investedValue), 0);
    const totalCurrent = portfolioData.reduce((sum, s) => sum + (s.currentValue ? parseFloat(s.currentValue) : parseFloat(s.investedValue)), 0);
    const totalPnl = (totalCurrent - totalInvested).toFixed(2);
    const netWorth = (parseFloat(user.balance) + totalCurrent).toFixed(2);

    res.render('portfolio', {
      user,
      portfolio: portfolioData,
      totalInvested: totalInvested.toFixed(2),
      totalCurrent: totalCurrent.toFixed(2),
      totalPnl,
      netWorth
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

module.exports = { getPortfolio };