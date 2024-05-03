import Doctor from '../models/doctor.model';
import appError from '../utils/app-error';

const findDoctorIdByUsername = async (doctorUsername) => {
  // Find the doctor by username by populating the 'user' field
  try {
    const doctor = await Doctor.findOne({}).populate({
      path: 'user',
      match: { username: doctorUsername },
    });

    // If no doctor is found with the given username
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return doctor._id;
  } catch (error) {
    console.error('Error finding doctor ID by username:', error);
    throw new appError('Failed to find doctor', 500);
  }
};

export default { findDoctorIdByUsername };
