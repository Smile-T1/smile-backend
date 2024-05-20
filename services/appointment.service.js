import Appointment from '../models/appointment.model.js';
import appError from '../utils/app-error.js';
export async function createAppointment(patientId, doctorId, date, time, notes, report, type) {
  try {
    console.log('Inside createAppointment service');
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
    const appointments = await Appointment.find({ patient: patientId, status: { $ne: 'Pending' } })
      .sort({ appointmentDate: 1 }) // Sort by appointmentDate in ascending order
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'username firstName lastName' },
      });
    return appointments;
  } catch (error) {
    throw new appError('Appointments not found', 500);
  }
}

export async function getAppointmentForPatient(patientId, appointmentId) {
  try {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patientId,
      status: { $ne: 'Pending' },
    })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'username firstName lastName' },
      })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'username firstName lastName' },
      });

    return appointment;
  } catch (error) {
    throw new appError('Appointment not found', 500);
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
    return true;
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

export async function getNewestAppointmentForPatient(patientId) {
  try {
    // Query appointments for the patient with the given ID
    const newestAppointment = await Appointment.findOne({ patient: patientId });

    return newestAppointment; // Return the newest appointment
  } catch (error) {
    console.error('Error fetching newest appointment:', error);
    throw new Error('Failed to fetch newest appointment');
  }
}

export async function getNearestUpcomingAppointmentForPatient(patientId) {
  try {
    const currentDate = new Date();
    console.log('currentDate:', currentDate);
    // Find the nearest upcoming appointment for the patient
    const nearestAppointment = await Appointment.findOne({
      patient: patientId,
      status: 'Upcoming', // Only fetch upcoming appointments
    })
      .sort({ appointmentDate: 1 }) // Sort by appointmentDate in ascending order
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'username' },
      });
    return nearestAppointment;
  } catch (error) {
    console.error('Error fetching nearest pending appointment:', error);
    throw new Error('Failed to fetch nearest pending appointment');
  }
}

export async function getRecentPatientMedications(patientId) {
  try {
    // Query appointments for the patient with the given ID
    const prescriptions = await Appointment.find({ patient: patientId, status: 'Completed' }).select('prescription');

    return prescriptions; // Return the newest appointment
  } catch (error) {
    console.error('Error fetching recent medications:', error);
    throw new Error('Failed to fetch recent medications');
  }
}
