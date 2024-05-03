import express from 'express';
import authCheck from '../middleware/auth/is-auth.js';
import checkPatient from '../middleware/auth/is-patient.js';
import { getPatientInfoHandler, bookAppointmentHandler } from '../controllers/patient.controller.js';
import uploadfile from '../middleware/multer/uploadReport.js';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary.js';
const router = express.Router();

router.get('/appointment', authCheck, checkPatient, getPatientInfoHandler);
router.post('/appointment', authCheck, checkPatient, uploadfile, uploadSingleCloudinary, bookAppointmentHandler);

export default router;
