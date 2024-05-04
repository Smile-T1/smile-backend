import express from 'express';
import doctorController from '../controllers/doctor.controller.js';
import  authCheck  from '../middleware/auth/is-auth.js';
import  checkDentist from '../middleware/auth/is-dentist.js';


const router = express.Router();

router.get('/getPatients', authCheck, checkDentist, doctorController.getDoctorPatients);

router.patch('/editPatientInfo', authCheck, doctorController.editPatientInfo);

router.get('/appointments', authCheck, doctorController.getDoctorsAppointments);

export default router;
