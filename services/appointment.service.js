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
    const appointments = await Appointment.find({ patient: patientId }).populate({
      path: 'doctor',
      populate: { path: 'user', select: 'username' },
    });
    return appointments;
  } catch (error) {
    throw new appError('Appointments not found', 500);
  }
}

export async function getAppointmentForPatient(patientId, appointmentId) {
  try {
    const appointment = await Appointment.findOne({ _id: appointmentId, patient: patientId })
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

export async function getNearestPendingAppointmentForPatient(patientId) {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Find the nearest pending appointment for the patient
    const nearestAppointment = await Appointment.aggregate([
      {
        $match: {
          patient: patientId,
          status: 'Upcoming', // Only consider appointments with a pending status
          createdAt: { $gte: currentDate }, // Scheduled date is on or after the current date
        },
      },
      {
        $addFields: {
          appointmentDateTime: {
            $dateFromString: {
              dateString: { $concat: ['$dateappointment', 'T', '$appointmentTime'] },
              format: '%d-%m-%YT%I:%M%p', // Format of the concatenated string
            },
          },
        },
      },
      {
        $sort: { appointmentDateTime: 1 }, // Sort by the new appointmentDateTime field
      },
    ]);

    // Return the nearest appointment
    return nearestAppointment[0]; // Assuming the first entry is the nearest appointment
  } catch (error) {
    console.error('Error fetching nearest pending appointment:', error);
    throw new Error('Failed to fetch nearest pending appointment');
  }
}
