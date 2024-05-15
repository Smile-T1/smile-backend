import Patient from '../models/patient.model.js';

//services ---> deal with db directly
export async function findPatientById(id) {
  try {
    const patient = await Patient.findById(id);
    console.log('patient', patient);
    return patient;
  } catch (error) {
    console.error('Error finding patient:', error);
    throw new Error('Failed to find patient');
  }
}
