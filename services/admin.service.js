import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';
import User from '../models/user.model.js';

const AdminService = {
  async getTotalDoctors() {
    try {
      const totalDoctors = await Doctor.countDocuments();
      return totalDoctors;
    } catch (error) {
      throw new Error('Error fetching total doctors');
    }
  },

  async getTotalPatients() {
    try {
      const totalPatients = await Patient.countDocuments();
      return totalPatients;
    } catch (error) {
      throw new Error('Error fetching total patients');
    }
  },

  async getTotalAppointments() {
    try {
      const totalAppointments = await Appointment.countDocuments();
      return totalAppointments;
    } catch (error) {
      throw new Error('Error fetching total appointments');
    }
  },

  async getLatestAppointment() {
    try {
      const latestAppointment = await Appointment.findOne({}).sort({ createdAt: -1 }).populate(['patient', 'doctor']);

      if (!latestAppointment) {
        throw new Error('No appointments found');
      }

      return latestAppointment;
    } catch (error) {
      console.error('Error getting latest appointment:', error);
      throw error;
    }
  },

  async getPendingAppointments() {
    try {
      const pendingAppointments = await Appointment.find({ status: 'Pending' })
        .populate({
          path: 'patient',
          model: User,
          select: 'firstName lastName',
        })
        .populate({
          path: 'doctor',
          model: Doctor,
          select: 'user speciality',
          populate: { path: 'user', model: User, select: 'firstName lastName' },
        })
        .select('date time Type');
  
      if (pendingAppointments.length === 0) {
        return { success: true, data: 'No pending appointments' };
      }
  
      // Filter out appointments with null patient or doctor references
      const filteredAppointments = pendingAppointments.filter(
        (appointment) => appointment.patient && appointment.doctor
      );
  
      if (filteredAppointments.length === 0) {
        return { success: true, data: 'No pending appointments with valid patient and doctor' };
      }
  
      return { success: true, data: filteredAppointments };
    } catch (error) {
      console.error('Cannot get pending appointments', error);
      throw new Error('Cannot get pending appointments');
    }
  }
};

export default AdminService;
