import Patient from '../models/patient.model.js';
import findDoctorIdByUsername from '../services/doctor.service.js';
import createAppointment from '../services/appointment.service.js';
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
    const { doctorUser, dateappointment, appointmentTime, appointmentNotes } = req.body;
    const doctorId = await findDoctorIdByUsername(doctorUser);

    let Report;
    if (res.locals.report) {
      Report = res.locals.report;
    }
    if (!doctorId) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const newAppointment = createAppointment(
      patientId,
      doctorId,
      dateappointment,
      appointmentTime,
      appointmentNotes,
      Report,
    );
    if (!newAppointment) {
      return res.status(500).json({ msg: 'Failed to book appointment' });
    }

    return res.status(200).json({ success: true, newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}
