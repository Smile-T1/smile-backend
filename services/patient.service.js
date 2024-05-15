import Patient from '../models/patient.model.js';

//services ---> deal with db directly
export async function findPatientByUserId(id) {
  try {
    const patient = await Patient.findOne({ user: id });
    return patient;
  } catch (error) {
    console.error('Error finding patient:', error);
    throw new Error('Failed to find patient');
  }
}
