const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded; // Store the decoded token in req.user
    next();
  });
};

module.exports = verifyToken;
