import Appointment from '../models/appointment.model';
import appError from '../utils/app-error';
const createAppointment = async (patientId, date, time, notes) => {
  try {
    const appointment = new Appointment({
      patient: patientId,
      date,
      time,
      Notes: notes,
    });
    const savedAppointment = await appointment.save();
    return savedAppointment;
  } catch (error) {
    throw new appError('appointment creation failed', 500);
  }
};

const getAppointmentsByPatientId = async (patientId) => {
  try {
    const appointments = await Appointment.find({ patient: patientId });
    return appointments;
  } catch (error) {
    throw new appError('Appointments not found', 500);
  }
};

const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: newStatus }, { new: true });
    return appointment;
  } catch (error) {
    throw new Error('Failed to update appointment status');
  }
};

const deleteAppointmentById = async (appointmentId) => {
  try {
    await Appointment.findByIdAndDelete(appointmentId);
  } catch (error) {
    throw new appError('Failed to delete appointment', 500);
  }
};

export default {
  createAppointment,
  getAppointmentsByPatientId,
  updateAppointmentStatus,
  deleteAppointmentById,
};
