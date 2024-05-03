import express from 'express';
import adminController from '../controllers/admin.controller.js';
import authCheck from '../middleware/auth/is-auth.js';
import adminCheck from '../middleware/auth/is-admin.js';

const router = express.Router();

router.get('/getAllPatients', authCheck, adminCheck, adminController.getPatientsList);
router.get('/getAllDoctors', authCheck, adminCheck, adminController.getPatientsList);

export default router;
