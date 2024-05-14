import Patient from '../models/patient.model.js';

//services ---> deal with db directly
export function findPatientById(id) {
  return Patient.findById(id);
}
