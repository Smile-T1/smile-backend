const checkPatient = (req, res, next) => {
  if (req.roleaccess === 'Patient' && req.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized!' });
  }
};

export default checkPatient;
