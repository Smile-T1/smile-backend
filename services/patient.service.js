import Patient from '../models/patient.model';

//services ---> deal with db directly
export function findPatientById(id) {
  return Patient.findById(id);
}

//continue
