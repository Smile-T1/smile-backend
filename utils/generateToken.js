import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateTokenAndSetCookie = (userId,access, res) => {
  const token = jwt.sign({ userId, access }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  });
};

export default generateTokenAndSetCookie;
