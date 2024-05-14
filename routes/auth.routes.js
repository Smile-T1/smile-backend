import express from 'express';
import { login, logout, signup, patientRegister, doctorRegister } from '../controllers/auth.controller.js';
import authCheck from '../middleware/auth/is-auth.js';
import adminCheck from '../middleware/auth/is-admin.js';
import uploadfile from '../middleware/multer/uploadReport.js';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.post('/patient/register', authCheck, adminCheck, uploadfile, uploadSingleCloudinary, patientRegister);

router.post('/doctor/register', authCheck, adminCheck, doctorRegister);

export default router;
