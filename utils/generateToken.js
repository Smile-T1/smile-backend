import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateTokenAndSetCookie = (userId, access, res) => {
  const token = jwt.sign({ userId, access }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  return token;
};

export default generateTokenAndSetCookie;
