import express from 'express';
import { login, logout, signup, patientRegister, doctorRegister } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.post('/patient/register', patientRegister);

router.post('/doctor/register', doctorRegister);

export default router;
