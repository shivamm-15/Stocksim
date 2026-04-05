const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // pass control to the actual route handler
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;