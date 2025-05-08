const jwt = require('jsonwebtoken');

const authMiddleware = (role = 'admin') => {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded;

      // Ensure the role is 'admin' to access this route
      if (role === 'admin' && req.user.user_type !== 'admin') {
        return res.status(403).json({ message: 'Access restricted to admins only' });
      }

      next();
    });
  };
};

module.exports = authMiddleware;
