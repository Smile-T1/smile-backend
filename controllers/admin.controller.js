import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';

async function getPatientsList(req, res) {
  try {
    // get all patients and populate the 'user' field with user information
    const patients = await Patient.find({}).populate('user');

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    return res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error('Error getting patients:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
async function getDoctorsList(req, res) {
  try {
    // get all doctors and populate the 'user' field with user information
    const doctors = await Doctor.find({}).populate('user');

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }

    return res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error('Error getting doctors:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default{ getPatientsList, getDoctorsList };