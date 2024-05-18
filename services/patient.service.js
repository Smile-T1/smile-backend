import Patient from '../models/patient.model.js';

//services ---> deal with db directly
export async function findPatientByUserId(userID) {
  try {
    const patient = await Patient.findOne({ user: userID }).populate({
      path: 'user',
      select: '-password -access',
    });
    return patient;
  } catch (error) {
    console.error('Error finding patient:', error);
    throw new Error('Failed to find patient');
  }
}

export async function getPatientUserInfo(userID) {
  try {
    const patient = await Patient.findOne({ user: userID }).populate({
      path: 'user',
      select: '-password -access',
    });
    return patient.user;
  } catch (error) {
    console.error('Error getting patient information:', error);
    throw new Error('Failed to get patient information');
  }
}
