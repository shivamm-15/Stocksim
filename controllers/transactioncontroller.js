const { getTransactionsByUser } = require('../models/stockmodel');

const getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsByUser(req.user.userId);
    res.render('transactions', { transactions });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

module.exports = { getTransactions };