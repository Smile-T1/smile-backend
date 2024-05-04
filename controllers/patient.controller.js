import Patient from '../models/patient.model.js';
import { findDoctorIdByUsername } from '../services/doctor.service.js';
import { createAppointment, existsAppointmentInSameTime } from '../services/appointment.service.js';
export async function getPatientInfoHandler(req, res) {
  try {
    const patientId = req.userId;
    // Find the patient by user ID and populate the 'user' field with user information
    const patient = await Patient.findOne({ user: patientId }).populate('user', '-username -password -access');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    return res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error('Error getting patient information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function bookAppointmentHandler(req, res) {
  try {
    const patientId = req.userId;
    // const { doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } =
    //   req.body.appointmentDetails;
    const data = JSON.parse(req.body.appointmentDetails);

    const { doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } = data;

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
