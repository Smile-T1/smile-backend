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
  deletePatientAppointmentByIdHandler,
  getNearestPatientAppointment,
  uploadProfilePicHandler,
} from '../controllers/patient.controller.js';
import uploadfile from '../middleware/multer/uploadReport.js';
import upload from '../middleware/multer/uploadPhoto.js';
import uploadSingleCloudinary from '../middleware/cloudinary/uploadToCloudinary.js';
const router = express.Router();
/*Appointments */
router.post('/appointment', authCheck, checkPatient, uploadfile, uploadSingleCloudinary, bookAppointmentHandler);

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

router.delete(
  '/appointment/:id',
  authCheck,
  checkPatient,
  validateResource(getAppointmentSchema),
  deletePatientAppointmentByIdHandler,
);

router.get('/newestAppointment', authCheck, checkPatient, getNearestPatientAppointment);

router.post(
  '/uploadProfilePic',
  authCheck,
  checkPatient,
  upload.single('profilePic'),
  uploadSingleCloudinary,
  uploadProfilePicHandler,
);

export default router;
