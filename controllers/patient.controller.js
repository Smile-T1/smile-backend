import { findDoctorIdByUsername, findDoctorsBySpeciality } from '../services/doctor.service.js';
import {
  createAppointment,
  existsAppointmentInSameTime,
  getAppointmentForPatient,
  getAppointmentsByPatientId,
} from '../services/appointment.service.js';
import { findPatientById } from '../services/patient.service.js';
// export async function getPatientInfoHandler(req, res) {
//   try {
//     const patientId = req.userId;
//     // Find the patient by user ID and populate the 'user' field with user information
//     const patient = await Patient.findOne({ user: patientId }).populate('user', '-username -password -access');
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     return res.status(200).json({ success: true, patient });
//   } catch (error) {
//     console.error('Error getting patient information:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

export async function bookAppointmentHandler(req, res) {
  try {
    const patientId = req.userId;
    // const { doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } =
    //   req.body.appointmentDetails;
    const data = JSON.parse(req.body.appointmentDetails);

    console.log('data', data);
    const { doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } = data;

    console.log('doctorUser', doctorUser);
    console.log('dateappointment', dateappointment);
    console.log('appointmentTime', appointmentTime);
    const doctorId = await findDoctorIdByUsername(doctorUser);

    if (!doctorId) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    //check if doctor has appointments in the same time
    const appointmentInSameTime = await existsAppointmentInSameTime(
      patientId,
      doctorId,
      dateappointment,
      appointmentTime,
    );
    console.log('appointmentInSameTime', appointmentInSameTime);
    if (appointmentInSameTime) {
      return res.status(400).json({ msg: 'Doctor or Patient has appointment in the same time' });
    }

    let Report;
    if (res.locals.report) {
      Report = res.locals.report;
    }

    const newAppointment = await createAppointment(
      patientId,
      doctorId,
      dateappointment,
      appointmentTime,
      appointmentNotes,
      Report,
      appointmentType,
    );
    if (!newAppointment) {
      return res.status(500).json({ msg: 'Failed to book appointment' });
    }

    return res.status(200).json({ msg: 'Appointment booked successfully', newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ msg: 'Internal server error in booking appointment' });
  }
}

export async function getAvailableAppointmentDoctors(req, res) {
  try {
    console.log('getAvailableAppointmentDoctors');
    //logic
    const { speciality } = req.query;
    console.log('speciality', speciality);
    // const page = pageString ? parseInt(pageString, 10) : 1; // Convert page string to number, default to 1 if not provided
    // const limit = limitString ? parseInt(limitString, 10) : 6; // Convert limit string to number, default to 10 if not provided

    const doctors = await findDoctorsBySpeciality(speciality);
    return res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error getting available appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllAppointmentsHandler(req, res) {
  try {
    const patientId = req.userId;
    console.log('patientId', patientId);
    const patient = await findPatientById(patientId);
    console.log('patient', patient);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const appointments = await getAppointmentsByPatientId(patientId);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.log('Error in getAllAppointments controller', error.message);
    res.status(500).json({ error: 'Internal server error in getAllAppointments' });
  }
}

export async function getPatientAppointmentByIdHandler(req, res) {
  try {
    const patientId = req.userId;
    const appointmentId = req.params;
    const patient = await findPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const appointment = await getAppointmentForPatient(patientId, appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    return res.status(200).json({ appointment });
  } catch (error) {
    console.log('Error in getPatientAppointment controller', error.message);
    res.status(500).json({ error: 'Internal server error in getPatientAppointment' });
  }
}
