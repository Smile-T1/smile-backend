import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';

/**
 * Get all patients assigned to a doctor.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function getDoctorPatients(req, res) {
    try {
      const doctorID = req.userId;
      // get all patients and populate the 'user' field with user information
      const patients = await Patient.find({linkedDoctor: doctorID}).populate('user');

      if (!patients || patients.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }

      return res.status(200).json({ success: true, patients });
    } catch (error) {
      console.error('Error getting patients:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Edit patient information.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function editPatientInfo(req, res) {
    try {
        const patientID = req.body.patientId;
        const updateFields = req.body.updateFields;

        // Find the patient by ID
        const patient = await Patient.findOne({ user: patientID });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if there are any fields to update in the User schema
        const userUpdateFields = {};
        Object.entries(updateFields).forEach(([fieldKey, newValue]) => {
          if (User.schema.paths.hasOwnProperty(fieldKey)) {
            userUpdateFields[fieldKey] = newValue;
            delete updateFields[fieldKey];
            }
        });
      let updatedUser;
        // Update the user document if there are any fields to update
        if (Object.keys(userUpdateFields).length > 0) {
          const user = await User.findById(patientID);
          
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            Object.assign(user, userUpdateFields);
            updatedUser=await user.save();
        }

        // Update each field in the updateFields object for the patient
        Object.entries(updateFields).forEach(([fieldKey, newValue]) => {
            // Check if the provided fieldKey exists in the patient schema
            if (Patient.schema.paths.hasOwnProperty(fieldKey)) {
                // Update the specified field with the new value
                patient[fieldKey] = newValue;
            } else {
                console.warn(`Field '${fieldKey}' does not exist in patient schema`);
            }
        });

        // Save the updated patient object
        await patient.save();

        return res.status(200).json({ message: 'Patient information updated successfully', patient, updatedUser });
    } catch (error) {
        console.error('Error updating patient information:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } 
};

async function getDoctorsAppointments(req, res) {
   try {
     const doctorID = req.userId;
     // get all appointments and populate the 'patients and doctors' field with user information
     const appointments = await Appointment.find({ linkedDoctor: doctorID }).populate('patient').populate('doctor');

     if (!appointments || appointments.length === 0) {
       return res.status(404).json({ message: 'No appointments found' });
     }

     return res.status(200).json({ success: true, appointments });
   } catch (error) {
     console.error('Error getting appointments:', error);
     return res.status(500).json({ message: 'Internal server error' });
   }
}

export default { getDoctorPatients, editPatientInfo,getDoctorsAppointments };


