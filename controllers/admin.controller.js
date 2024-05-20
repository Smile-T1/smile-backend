import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import { decode } from 'jsonwebtoken';
import AdminService from '../services/admin.service.js';

async function getList(req, res) {
  // console.log(req.userId);
  try {
    let data;
    let modelName;
    let populateFields = [];

    const type = req.params.type;
    console.log(type);

    switch (type) {
      case 'patients':
        modelName = Patient;
        populateFields.push({ path: 'user', select: 'firstName lastName email mobile address' });
        break;
      case 'doctors':
        modelName = Doctor;
        populateFields.push({ path: 'user', select: 'firstName lastName email mobile address' });
        break;
      case 'appointments':
        modelName = Appointment;
        populateFields = ['patient', 'doctor'];
        break;
      default:
        return res.status(400).json({ message: 'Invalid type parameter' });
    }

    data = await modelName.find({}, { speciality: 1 }).populate(populateFields);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No ${type} found` });
    }

    return res.status(200).json({ success: true, [type]: data });
  } catch (error) {
    console.error(`Error getting ${type}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// async function deleteUser(req, res) {
//   try {
//     const userId = decodeURIComponent(req.params.userId);
//     const type = req.params.type;
//     console.log(userId);
//     switch (type) {
//       case 'patient':
//         await Patient.findOneAndDelete({ user: userId });
//         break;
//       case 'doctor':
//         await Doctor.findOneAndDelete({ user: userId });
//         break;
//     }
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

async function getTotalCounts(req, res) {
  console.log(req.userId);
  try {
    const totalDoctors = await AdminService.getTotalDoctors();
    const totalPatients = await AdminService.getTotalPatients();
    const totalAppointments = await AdminService.getTotalAppointments();

    res.status(200).json({
      totalDoctors,
      totalPatients,
      totalAppointments,
    });
  } catch (error) {
    console.error('Error getting totals');
    res.status(500).json({ message: 'Error in admin controller' });
  }
}

async function getLatestAppointment(req, res) {
  try {
    const latestAppointments = await AdminService.getLatestAppointment();

    if (!latestAppointments) {
      return res.status(404).json({ message: 'No appointment found' });
    }

    res.status(200).json({ data: latestAppointments });
  } catch (error) {
    console.error('Error in getting latest appointment');
    res.status(500).json({ message: 'Error in admin controller', error: error.message });
  }
}

async function getPendingAppointments(req, res) {
  try {
    console.log('#####');
    const pendingAppointments = await AdminService.getPendingAppointments();
    console.log(pendingAppointments);
    console.log('#####');
    if (pendingAppointments.success) {
      res.status(200).json({ data: pendingAppointments.data });
    } else {
      res.status(400).json({ data: pendingAppointments.data });
    }
  } catch (error) {
    console.error('Error in getting pending appointments');
    res.status(500).json({ message: 'Error in admin controller', error: error.message });
  }
}

async function handleAppointmentAction(req, res) {
  const { appointmentId, action } = req.body;

  try {
    const result = await AdminService.handleAppointmentAction(appointmentId, action);
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAppointmentsByStatus(req, res) {
  const { status } = req.params;

  try {
    const appointments = await AdminService.getAppointmentsByStatus(status);
    if (appointments.success) {
      res.status(200).json({ data: appointments.data });
    } else {
      res.status(400).json({ data: appointments.data });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  const { userId } = req.params;
  try {
    const result = await AdminService.deleteUserByUsername(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export default {
  getList,
  deleteUser,
  getTotalCounts,
  getLatestAppointment,
  getPendingAppointments,
  handleAppointmentAction,
  getAppointmentsByStatus,
  deleteUser,
};
