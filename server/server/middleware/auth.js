const jwt = require('jsonwebtoken');

// Middleware: Checks if token is valid and adds user info to req
exports.authenticateToken = (req, res, next) => {
  // Format: Bearer <token>
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Get the token part

  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ..., role: ... }
    next(); // go to next middleware/route
  } catch (err) {
    res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

// Middleware: Allow only certain roles (e.g. admin)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient role' });
    }
    next();
  };
};
