import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import { findDoctorByUserId } from '../services/doctor.service.js';
/**
 * Get all patients assigned to a doctor.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
async function getDoctorPatients(req, res) {
  try {
    const userdoctorID = req.userId;
    const doctor = await findDoctorByUserId(userdoctorID);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorID = doctor._id;
    // get all appointments linked to this doctor
    const linkedAppointments = await Appointment.find({ doctor: doctorID, status: { $ne: 'Pending' } }).populate({
      path: 'patient',
      populate: { path: 'user' }, // Populate the user field in patients
    });

    if (!linkedAppointments || linkedAppointments.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    // Extract patients from appointments
    const patients = linkedAppointments.map((appointment) => appointment.patient);

    // Calculate and include age for each patient in the response
    patients.forEach((patient) => {
      if (patient.user.dob) {
        const diff = Date.now() - patient.user.dob.getTime();
        const ageDate = new Date(diff);
        patient.user.age = Math.abs(ageDate.getUTCFullYear() - 1970);
      }
    });

    // Send back response including age
    return res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error('Error getting patients:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

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
      updatedUser = await user.save();
    }

    // Update the prescription if it's included in the updateFields
    if (updateFields.prescription) {
      Object.assign(patient.prescription, updateFields.prescription);
      delete updateFields.prescription;
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
}

async function getDoctorsAppointments(req, res) {
  try {
    const userdoctorID = req.userId;
    const doctor = await findDoctorByUserId(userdoctorID);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorID = doctor._id;

    // get all appointments and populate the 'patient' field with patient information
    const appointments = await Appointment.find({ doctor: doctorID, status: { $ne: 'Pending' } }).populate('patient');

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    // Prepare an array to hold appointments with patient names
    const appointmentsWithPatientNames = [];

    // Iterate over each appointment to extract patient information
    for (const appointment of appointments) {
      if (!appointment.patient) {
        continue; // Skip if patient information is missing
      }

      const userInfo = await User.findById(appointment.patient.user);
      if (!userInfo) {
        return res.status(404).json({ message: 'User not found' });
      }

      const patientName = userInfo.firstName + ' ' + userInfo.lastName;

      // Create a new object with appointment details and patient name
      const appointmentWithPatientName = {
        appointment,
        patientName: patientName,
      };

      appointmentsWithPatientNames.push(appointmentWithPatientName);
    }

    return res.status(200).json({ success: true, appointments: appointmentsWithPatientNames });
  } catch (error) {
    console.error('Error getting appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteDoctorAppointment(req, res) {
  try {
    const userdoctorID = req.userId;
    const doctor = await findDoctorByUserId(userdoctorID);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorID = doctor._id;

    const appointmentID = req.body.appointmentId;

    // Check if the appointment belongs to the specified doctor
    const appointment = await Appointment.findOne({ _id: appointmentID, doctor: doctorID });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or does not belong to the doctor' });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentID);

    return res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function addPrescription(req, res) {
  try {
    const userdoctorID = req.userId;
    const doctor = await findDoctorByUserId(userdoctorID);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const doctorID = doctor._id;

    const { Medication, Dosage, Consultation, appointmentID } = req.body;

    if (!appointmentID) {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const appointment = await Appointment.findById(appointmentID);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const patient = await Patient.findById(appointment.patient);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    // Check if the appointment belongs to the requesting doctor
    if (appointment.doctor.toString() !== doctorID.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this appointment' });
    }

    //check appointment time has come or not
    const now = new Date();
    //add 3 hours to current time
    const { appointmentDate } = appointment.appointmentDate;

    if (appointmentDate > now) {
      return res.status(400).json({ message: 'Appointment time has not come' });
    }
    // Update the appointment with prescription details
    appointment.prescription = {
      Medication,
      Dosage,
      Consultation,
    };

    appointment.status = 'Completed';
    // Save the updated appointment
    await appointment.save();

    patient.prescription = {
      Medication,
      Dosage,
      Consultation,
      doctorID,
    };
    await patient.save();

    return res.status(200).json({ success: true, message: 'Prescription added successfully' });
  } catch (error) {
    console.error('Error adding prescription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default { getDoctorPatients, editPatientInfo, getDoctorsAppointments, deleteDoctorAppointment, addPrescription };
