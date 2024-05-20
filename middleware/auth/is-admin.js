const adminCheck = (req, res, next) => {
  if (req.roleaccess === 'Admin' && req.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized!' });
  }
};

export default adminCheck;
