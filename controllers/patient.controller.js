import { findDoctorIdByUsername, findDoctorsBySpeciality, findDoctorByDoctorId } from '../services/doctor.service.js';
import {
  createAppointment,
  existsAppointmentInSameTime,
  getAppointmentForPatient,
  getAppointmentsByPatientId,
  updateAppointmentStatus,
  getNearestUpcomingAppointmentForPatient,
  getRecentPatientMedications,
} from '../services/appointment.service.js';
import { findUserandUpdateProfilePic } from '../services/user.service.js';
import { validateAppointmentDate } from '../utils/checkDate.js';
import { findPatientByUserId } from '../services/patient.service.js';
import Appointment from '../models/appointment.model.js';

export async function bookAppointmentHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const patientId = patient._id;

    const data = JSON.parse(req.body.appointmentDetails);

    const { doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } = data;

    const doctorId = await findDoctorIdByUsername(doctorUser);
    const doctor = await findDoctorByDoctorId(doctorId);

    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    //check if appointment time is schedueled in the past
    const isValidDate = validateAppointmentDate(dateappointment, appointmentTime);
    if (!isValidDate) {
      return res.status(400).json({ msg: 'Please choose a valid date' });
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

    console.log('doctor.speciality', doctor.speciality);
    console.log('appointmentType', appointmentType);
    if (appointmentType != doctor.speciality) {
      return res.status(400).json({ msg: 'Doctor speciality does not match with appointment type' });
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
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    console.log('patientID', patient._id);
    const appointments = await getAppointmentsByPatientId(patient._id);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.log('Error in getAllAppointments controller', error.message);
    res.status(500).json({ error: 'Internal server error in getAllAppointments' });
  }
}

export async function getAllPrescriptionsHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .sort({ appointmentDate: 1 }) // Sort by appointmentDate in ascending order
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'username' },
      });

    // Extract prescriptions from appointments
    const prescriptions = appointments.map((appointment) => {
      return {
        Doctor: appointment.doctor,
        Speciality: appointment.Type,
        Date: appointment.date,
        Time: appointment.time,
        Prescription: appointment.prescription,
      };
    });

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.log('Error in getAllPrescriptionsHandler:', error.message);
    return res.status(500).json({ error: 'Internal server error in getAllPrescriptionsHandler' });
  }
}

export async function getPatientAppointmentByIdHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const appointmentId = req.params.id;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const patientId = patient._id;
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

export async function deletePatientAppointmentByIdHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const appointmentId = req.params.id;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const patientId = patient._id;
    const appointment = await getAppointmentForPatient(patientId, appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const updatedAppointment = await updateAppointmentStatus(appointmentId, 'Cancelled');
    if (!updatedAppointment) {
      return res.status(500).json({ msg: 'Failed to delete appointment' });
    }
    return res.status(200).json({ msg: 'Appointment deleted successfully', updatedAppointment });
  } catch (error) {
    console.log('Error in deletePatientAppointment controller', error.message);
    res.status(500).json({ error: 'Internal server error in deletePatientAppointment' });
  }
}

export async function getNearestPatientAppointment(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    console.log('patient', patient);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    const patientId = patient._id;
    const newestAppointment = await getNearestUpcomingAppointmentForPatient(patientId);
    return res.status(200).json({ newestAppointment });
  } catch (error) {
    console.log('Error in getNearestPatientAppointment controller', error.message);
    res.status(500).json({ error: 'Internal server error in getNearestPatientAppointment' });
  }
}

export async function uploadProfilePicHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    console.log('patient', patient);
    const profilePic = res.locals.report;
    console.log('profilePic', profilePic);
    if (!profilePic) {
      return res.status(404).json({ msg: 'Please upload a profile picture' });
    }

    const updatedPatientProfile = await findUserandUpdateProfilePic(userPatientId, profilePic);
    if (!updatedPatientProfile) {
      return res.status(500).json({ msg: 'Failed to update profile picture' });
    }

    return res.status(200).json({ msg: 'Profile picture uploaded successfully', updatedPatientProfile });
  } catch (error) {
    console.log('Error in uploadProfilePic controller', error.message);
    res.status(500).json({ error: 'Internal server error in uploadProfilePic' });
  }
}

export async function getRecentPatientMedicationsHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const patientId = patient._id;
    const prescriptions = await getRecentPatientMedications(patientId);
    return res.status(200).json({ prescriptions });
  } catch (error) {
    console.log('Error in getRecentPatientMedications controller', error.message);
    res.status(500).json({ error: 'Internal server error in getRecentPatientMedications' });
  }
}

export async function editAppointmentHandler(req, res) {
  try {
    const userPatientId = req.userId;
    const patient = await findPatientByUserId(userPatientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const patientId = patient._id;

    const data = JSON.parse(req.body.appointmentDetails);
    const { appointmentId, doctorUser, dateappointment, appointmentTime, appointmentNotes, appointmentType } = data;

    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const doctorId = await findDoctorIdByUsername(doctorUser);
    const doctor = await findDoctorByDoctorId(doctorId);

    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Check if appointment time is scheduled in the past
    const isValidDate = validateAppointmentDate(dateappointment, appointmentTime);
    if (!isValidDate) {
      return res.status(400).json({ msg: 'Please choose a valid date' });
    }

    // Check if doctor has appointments in the same time
    const appointmentInSameTime = await existsAppointmentInSameTime(
      patientId,
      doctorId,
      dateappointment,
      appointmentTime,
      appointmentId, // Exclude current appointment from the check
    );

    if (appointmentInSameTime) {
      return res.status(400).json({ msg: 'Doctor or Patient has an appointment at the same time' });
    }

    // Check if appointment type matches doctor's speciality
    if (appointmentType && appointmentType !== doctor.speciality) {
      return res.status(400).json({ msg: 'Doctor speciality does not match with appointment type' });
    }

    let report;
    if (res.locals.report) {
      report = res.locals.report;
    }

    let updatedAppointment = await Appointment.findById(appointmentId);
    if (dateappointment) {
      updatedAppointment.date = dateappointment;
    }
    if (appointmentTime) {
      updatedAppointment.time = appointmentTime;
    }
    if (doctorId) {
      updatedAppointment.doctor = doctorId;
    }
    if (appointmentNotes) {
      updatedAppointment.Notes = appointmentNotes;
    }
    if (appointmentType) {
      updatedAppointment.Type = appointmentType;
    }
    updatedAppointment.status = 'Pending';

    updatedAppointment.save();

    if (!updatedAppointment) {
      return res.status(500).json({ msg: 'Failed to update appointment' });
    }

    return res.status(200).json({ msg: 'Appointment details updated successfully', updatedAppointment });
  } catch (error) {
    console.error('Error editing appointment:', error);
    return res.status(500).json({ msg: 'Internal server error in editing appointment' });
  }
}
