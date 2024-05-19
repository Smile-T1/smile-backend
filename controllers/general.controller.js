import bcrypt from 'bcryptjs';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import { findUserById, getUserInfo } from '../services/user.service.js';
import { getPatientUserInfo } from '../services/patient.service.js';
import { getDoctorUserInfo } from '../services/doctor.service.js';
/**
 * Get doctor or patient information by user ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function getnfo(req, res) {
  try {
    const id = req.query.id;
    const type = req.query.type;
    let information;

    if (type == 'doctor') {
      // Find the doctor by user ID and populate the 'user' field with user information
      information = await Doctor.findOne({ user: id }).populate('user');
    } else if (type == 'patient') {
      // Find the patient by user ID and populate the 'user' field with user information
      information = await Patient.findOne({ user: id }).populate('user');
    } else if (type == 'appointment') {
      // Find the appointment by user ID and populate fields with information
      information = await Appointment.findById(id).populate('patient').populate('doctor');
    } else {
      return res.status(400).json({ message: 'Wrong Parameter' });
    }

    if (!information) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ success: true, information });
  } catch (error) {
    console.error('Error getting information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getSettingsHandler(req, res) {
  try {
    const message = 'User not found';
    if (req.roleaccess === 'Patient') {
      const patientUserId = req.userId;
      // Find the patient by user ID and populate the 'user' field with user information
      const patient = await getPatientUserInfo(patientUserId);
      if (!patient) {
        return res.status(404).json({ msg: message });
      }
      //populate and exclude password and access
      return res.status(200).json({ patient });
    } else if (req.roleaccess === 'Doctor') {
      const doctorUserId = req.userId;
      // Find the doctor by user ID and populate the 'user' field with user information
      const doctor = await getDoctorUserInfo(doctorUserId);
      if (!doctor) {
        return res.status(404).json({ msg: message });
      }
      //populate and exclude password and access
      return res.status(200).json({ doctor });
    } else if (req.roleaccess === 'Admin') {
      const adminUserId = req.userId;
      console.log(adminUserId);
      const admin = await getUserInfo(adminUserId);
      if (!admin) {
        return res.status(404).json({ msg: message });
      }
      return res.status(200).json({ admin });
    } else {
      return res.status(404).json({ msg: message });
    }
  } catch (error) {
    console.error('Error getting settings information:', error);
    return res.status(500).json({ message: 'Internal server error in getSettings' });
  }
}

async function changePasswordHandler(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await findUserById(req.userId);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user?.password || '');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Confirm password must match new password' });
    }
    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export default { getnfo, getSettingsHandler, changePasswordHandler };
