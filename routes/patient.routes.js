import express from 'express';
import validateResource from '../middleware/validateResource';
import patientAppointmentSchema from '../schemas/appointment.schema';
import authCheck from '../middleware/auth/is-auth';
import checkPatient from '../middleware/auth/is-patient';
import { getPatientInfoHandler, bookAppointmentHandler } from '../controllers/patient.controller';
import uploadfile from '../middleware/multer/uploadReport';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary';
const router = express.Router();

router.get('/patient/appointment', authCheck, checkPatient, getPatientInfoHandler);
router.post(
  '/patient/appointment',
  authCheck,
  checkPatient,
  uploadfile,
  uploadSingleCloudinary,
  validateResource(patientAppointmentSchema),
  bookAppointmentHandler,
);

export default router;
