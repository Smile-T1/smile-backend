import jwt from 'jsonwebtoken';

const authCheck = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s/, '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  req.userId = decodedToken.userId;
  req.roleaccess = decodedToken.access;
  next();
};

export default authCheck;
