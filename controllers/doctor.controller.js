import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';

/**
 * Get doctor information by user ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function getDoctorInfo(req, res) {
  try {
    const userId = req.params.userId;

    // Find the doctor by user ID and populate the 'user' field with user information
    const doctor = await Doctor.findOne({ user: userId }).populate('user');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error('Error getting doctor information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Add a new doctor to the database.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function addDoctor(req, res) {
  try {
    const { userId, speciality } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if the user with the provided ID exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newDoctor = new Doctor({ user: userId, speciality });

    await newDoctor.save();

    return res.status(201).json({ success: true, doctor: newDoctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export { getDoctorInfo, addDoctor };
