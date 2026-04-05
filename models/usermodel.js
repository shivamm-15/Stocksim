const db = require('../config/db');

const createUser = async (name, email, passwordHash) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, balance FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const updateBalance = async (userId, newBalance) => {
  await db.execute(
    'UPDATE users SET balance = ? WHERE id = ?',
    [newBalance, userId]
  );
};
const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT id, name, balance FROM users ORDER BY balance DESC'
  );
  return rows;
};

module.exports = { createUser, findUserByEmail, findUserById, updateBalance, getAllUsers };