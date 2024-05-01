import express from 'express';
// import { getDoctorInfo, addDoctor } from '../controllers/doctor.controller.js';
const getDoctorInfo = require('../controllers/doctor.controller');

const router = express.Router();

router.get('/getDoctor', getDoctorInfo);
router.get('/addDoctor', addDoctor);

export default router;
