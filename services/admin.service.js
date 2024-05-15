import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';

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
};

export default AdminService;
