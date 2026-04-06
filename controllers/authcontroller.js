const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/usermodel');

// Show register page
const getRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

// Handle register form submit
const postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.render('auth/register', { error: 'Email already registered' });
    }

    // Hash password — never store plain text
    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(name, email, passwordHash);
    res.redirect('/auth/login');
  } catch (err) {
  console.error('LOGIN ERROR:', err.message);
  res.render('auth/login', { error: err.message });
}
  
};

// Show login page
const getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

// Handle login form submit
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store in httpOnly cookie — JS cannot access this, prevents XSS
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Something went wrong' });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };