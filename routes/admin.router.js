import express from 'express';
import adminController from '../controllers/admin.controller.js';
import authCheck from '../middleware/auth/is-auth.js';
import adminCheck from '../middleware/auth/is-admin.js';

const router = express.Router();

router.get('/totals', authCheck, adminCheck, adminController.getTotalCounts);
router.get('/latestAppointment', authCheck, adminCheck, adminController.getLatestAppointment);
router.get('/:type', authCheck, adminCheck, adminController.getList);

router.delete('/delete/:type/:userId', authCheck, adminCheck, adminController.deleteUser);

export default router;
