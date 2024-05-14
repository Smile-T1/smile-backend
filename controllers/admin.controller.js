import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import { decode } from 'jsonwebtoken';

async function getList(req, res) {
  try {
    let data;
    let modelName;
    let populateFields = [];

    const type = req.params.type;
    console.log(type);

    switch (type) {
      case 'patients':
        modelName = Patient;
        populateFields.push({ path: 'user', select: '-password' });
        break;
      case 'doctors':
        modelName = Doctor;
        populateFields.push({ path: 'user', select: '-password' });
        break;
      case 'appointments':
        modelName = Appointment;
        populateFields = ['patient', 'doctor'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid type parameter' });
    }

    data = await modelName.find({}).populate(populateFields);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No ${type} found` });
    }

    return res.status(200).json({ success: true, [type]: data });
  } catch (error) {
    console.error(`Error getting ${type}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = decodeURIComponent(req.params.userId);
    const type = req.params.type;
    console.log(userId);
    switch (type) {
      case 'patient':
        await Patient.findOneAndDelete({ user: userId });
        break;
      case 'doctor':
        await Doctor.findOneAndDelete({ user: userId });
        break;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default { getList, deleteUser };
