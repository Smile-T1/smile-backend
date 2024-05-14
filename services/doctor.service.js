import Doctor from '../models/doctor.model.js';
import appError from '../utils/app-error.js';

export async function findDoctorIdByUsername(doctorUsername) {
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
}

export async function findDoctorsBySpeciality(speciality) {
  try {
    const query = speciality ? { speciality: speciality } : {};

    const doctors = await Doctor.find({ speciality: speciality });
    const populatedDoctors = await Doctor.populate(doctors, { path: 'user', select: 'username' });
    const doctorUserNames = populatedDoctors.map((doctor) => doctor.user.username);
    //apply pagination
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const paginatedUsers = doctorUserNames.slice(startIndex, endIndex);
    return doctorUserNames;
  } catch (error) {
    console.error('Error finding doctors by speciality:', error);
    throw new appError('Failed to find doctors', 500);
  }
}
