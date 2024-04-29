const checkDentist = (req, res, next) => {
  if (req.roleaccess === 'Dentist' && req.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized!' });
  }
};

export default checkDentist;
