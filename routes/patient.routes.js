import express from 'express';
import validateResource from '../middleware/validateResource.js';
import { appointmentDoctorsSchema, getAppointmentSchema } from '../schemas/appointment.schema.js';
import authCheck from '../middleware/auth/is-auth.js';
import checkPatient from '../middleware/auth/is-patient.js';
import {
  bookAppointmentHandler,
  getAvailableAppointmentDoctors,
  getAllAppointmentsHandler,
  getPatientAppointmentByIdHandler,
} from '../controllers/patient.controller.js';
import uploadfile from '../middleware/multer/uploadReport.js';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary.js';
const router = express.Router();
/*Appointments */
//router.get('/appointment', authCheck, checkPatient, getPatientInfoHandler);
router.post('/bookAppointment', authCheck, checkPatient, uploadfile, uploadSingleCloudinary, bookAppointmentHandler);

router.get(
  '/appointmentsDoctors',
  authCheck,
  checkPatient,
  validateResource(appointmentDoctorsSchema),
  getAvailableAppointmentDoctors,
);

router.get('/allAppointments', authCheck, checkPatient, getAllAppointmentsHandler);

router.get(
  '/appointment/:id',
  authCheck,
  checkPatient,
  validateResource(getAppointmentSchema),
  getPatientAppointmentByIdHandler,
);

router.delete('/appointment/:id', authCheck, checkPatient, validateResource(getAppointmentSchema));

export default router;
