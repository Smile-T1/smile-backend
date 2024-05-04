import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';

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
      // Find the doctor by user ID and populate the 'user' field with user information
      information = await Patient.findOne({ user: id }).populate('user');
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
export default { getnfo };