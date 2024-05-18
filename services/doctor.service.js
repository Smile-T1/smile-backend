import Doctor from '../models/doctor.model.js';
import appError from '../utils/app-error.js';
import User from '../models/user.model.js';
export async function findDoctorIdByUsername(doctorUsername) {
  // Find the doctor by username by populating the 'user' field
  try {
    const user = await User.findOne({ username: doctorUsername });
    const userId = user._id;
    const doctor = await Doctor.findOne({ user: userId });

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

    console.log('query:', query);
    const doctors = await Doctor.find(query).populate({
      path: 'user',
      select: 'username',
    });
    console.log('doctors:', doctors);
    //const populatedDoctors = await Doctor.populate(doctors, { path: 'user', select: 'username' });
    const doctorUserNames = doctors.map((doctor) => doctor.user?.username).filter(Boolean);
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

export async function findDoctorByDoctorId(id) {
  try {
    const doctor = await Doctor.findById(id);
    console.log('doctor:', doctor);
    return doctor;
  } catch (error) {
    console.error('Error finding doctor by doctor ID:', error);
    throw new appError('Failed to find doctor', 500);
  }
}

export async function findDoctorByUserId(userID) {
  try {
    const doctor = await Doctor.findOne({ user: userID }).populate({
      path: 'user',
      select: '-password -access',
    });
    return doctor;
  } catch (error) {
    console.error('Error finding doctor:', error);
    throw new Error('Failed to find doctor');
  }
}

export async function getDoctorUserInfo(userID) {
  try {
    const doctor = await Doctor.findOne({ user: userID }).populate({
      path: 'user',
      select: '-password -access',
    });
    return doctor.user;
  } catch (error) {
    console.error('Error getting patient information:', error);
    throw new Error('Failed to get patient information');
  }
}
