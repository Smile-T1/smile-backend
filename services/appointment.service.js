import Appointment from '../models/appointment.model.js';
import appError from '../utils/app-error.js';
export async function createAppointment(patientId, doctorId, date, time, notes, report, type) {
  try {
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: date,
      time: time,
      Notes: notes,
      //if report not defined it will be an empty string
      Report: report !== undefined ? report : '',
      Type: type,
    });
    const savedAppointment = await appointment.save();
    return savedAppointment;
  } catch (error) {
    throw new appError('appointment creation failed', 500);
  }
}

export async function getAppointmentsByPatientId(patientId) {
  try {
    const appointments = await Appointment.find({ patient: patientId });
    return appointments;
  } catch (error) {
    throw new appError('Appointments not found', 500);
  }
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: newStatus }, { new: true });
    return appointment;
  } catch (error) {
    throw new Error('Failed to update appointment status');
  }
}

export async function deleteAppointmentById(appointmentId) {
  try {
    await Appointment.findByIdAndDelete(appointmentId);
  } catch (error) {
    throw new appError('Failed to delete appointment', 500);
  }
}

//check if there is an appointment in the same time

export async function existsAppointmentInSameTime(patientId, doctorId, date, time) {
  try {
    const checkappointmentDoctor = await Appointment.findOne({
      doctor: doctorId,
      date: date,
      time: time,
    });
    const checkappointmentPatient = await Appointment.findOne({
      patient: patientId,
      date: date,
      time: time,
    });
    if (checkappointmentDoctor || checkappointmentPatient) {
      return true;
    }
    return false;
  } catch (error) {
    throw new appError('Failed to check if appointment in same time', 500);
  }
}
