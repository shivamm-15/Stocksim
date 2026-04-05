const { getAllUsers } = require('../models/usermodel');
const { getHoldingsByUser } = require('../models/stockmodel');
const { fetchStockPrice } = require('../services/stockservices');

const getLeaderboard = async (req, res) => {
  try {
    const users = await getAllUsers();

    // Calculate net worth for each user
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        try {
          const holdings = await getHoldingsByUser(user.id);

          // Fetch live price for each holding
          let portfolioValue = 0;
          await Promise.all(
            holdings.map(async (holding) => {
              try {
                const stockData = await fetchStockPrice(holding.symbol);
                portfolioValue += stockData.price * holding.quantity;
              } catch {
                // If price fetch fails use avg buy price as fallback
                portfolioValue += holding.avg_buy_price * holding.quantity;
              }
            })
          );

          const netWorth = parseFloat(user.balance) + portfolioValue;
          return {
            name: user.name,
            balance: parseFloat(user.balance).toFixed(2),
            portfolioValue: portfolioValue.toFixed(2),
            netWorth: netWorth.toFixed(2),
            isCurrentUser: user.id === req.user.userId
          };
        } catch (err) {
          return {
            name: user.name,
            balance: parseFloat(user.balance).toFixed(2),
            portfolioValue: '0.00',
            netWorth: parseFloat(user.balance).toFixed(2),
            isCurrentUser: user.id === req.user.userId
          };
        }
      })
    );

    // Sort by net worth descending
    leaderboard.sort((a, b) => parseFloat(b.netWorth) - parseFloat(a.netWorth));

    res.render('leaderboard', { leaderboard });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

module.exports = { getLeaderboard };