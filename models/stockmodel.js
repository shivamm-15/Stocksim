const db = require('../config/db');

// Get a user's current holdings
const getHoldingsByUser = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM holdings WHERE user_id = ?',
    [userId]
  );
  return rows;
};

// Get one specific holding
const getHolding = async (userId, symbol) => {
  const [rows] = await db.execute(
    'SELECT * FROM holdings WHERE user_id = ? AND symbol = ?',
    [userId, symbol]
  );
  return rows[0];
};

// Insert or update holding after a buy
const upsertHolding = async (userId, symbol, quantity, avgBuyPrice) => {
  const existing = await getHolding(userId, symbol);

  if (!existing) {
    await db.execute(
      'INSERT INTO holdings (user_id, symbol, quantity, avg_buy_price) VALUES (?, ?, ?, ?)',
      [userId, symbol, quantity, avgBuyPrice]
    );
  } else {
    const totalQty = existing.quantity + quantity;
    const newAvg = ((existing.avg_buy_price * existing.quantity) + (avgBuyPrice * quantity)) / totalQty;
    await db.execute(
      'UPDATE holdings SET quantity = ?, avg_buy_price = ? WHERE user_id = ? AND symbol = ?',
      [totalQty, newAvg, userId, symbol]
    );
  }
};

// Reduce quantity after a sell
const reduceHolding = async (userId, symbol, quantity) => {
  await db.execute(
    'UPDATE holdings SET quantity = quantity - ? WHERE user_id = ? AND symbol = ?',
    [quantity, userId, symbol]
  );
  // Clean up zero-quantity rows
  await db.execute(
    'DELETE FROM holdings WHERE user_id = ? AND symbol = ? AND quantity <= 0',
    [userId, symbol]
  );
};

// Log every buy/sell to transactions
const logTransaction = async (userId, symbol, type, quantity, priceAtTime, totalAmount) => {
  await db.execute(
    'INSERT INTO transactions (user_id, symbol, type, quantity, price_at_time, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, symbol, type, quantity, priceAtTime, totalAmount]
  );
};

// Get transaction history for a user
const getTransactionsByUser = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};


// Watchlist
const addToWatchlist = async (userId, symbol) => {
  await db.execute(
    'INSERT IGNORE INTO watchlist (user_id, symbol) VALUES (?, ?)',
    [userId, symbol]
  );
};

const removeFromWatchlist = async (userId, symbol) => {
  await db.execute(
    'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?',
    [userId, symbol]
  );
};

const getWatchlist = async (userId) => {
  const [rows] = await db.execute(
    'SELECT symbol FROM watchlist WHERE user_id = ?',
    [userId]
  );
  return rows;
};

const isInWatchlist = async (userId, symbol) => {
  const [rows] = await db.execute(
    'SELECT id FROM watchlist WHERE user_id = ? AND symbol = ?',
    [userId, symbol]
  );
  return rows.length > 0;
};

module.exports = {
  getHoldingsByUser, getHolding, upsertHolding,
  reduceHolding, logTransaction, getTransactionsByUser,
  addToWatchlist, removeFromWatchlist, getWatchlist, isInWatchlist
};