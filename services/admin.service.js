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
      const latestAppointment = await Appointment.find({})
        .sort({ createdAt: -1 })
        .populate({
          path: 'patient',
          model: Patient,
          populate: { path: 'user', model: User, select: 'firstName lastName'},
        })
        .populate({
          path: 'doctor',
          model: Doctor,
          populate: { path: 'user', model: User, select: 'firstName lastName' },
        });
  
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
        return { success: true, data: ""};
      }
  
      return { success: true, data: filteredAppointments };
    } catch (error) {
      console.error('Cannot get pending appointments', error);
      throw new Error('Cannot get pending appointments');
    }
  },

  async handleAppointmentAction(appointmentId, action) {
    try {
      let appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }
  
      if (appointment.status !== 'Pending') {
        throw new Error('Appointment status is not Pending');
      }
  
      if (action === 'accept') {
        appointment.status = 'Upcoming'; // Or any other status you want to set for accepted appointments
      } else if (action === 'decline') {
        await Appointment.findByIdAndRemove(appointmentId);
        return { success: true, message: 'Appointment declined and removed from database' };
      } else {
        throw new Error('Invalid action');
      }
  
      await appointment.save();
      return { success: true, message: 'Appointment action successfully processed' };
    } catch (error) {
      console.error('Error handling appointment action:', error);
      throw new Error('Error handling appointment action');
    }
  },

  async getAppointmentsByStatus(status) {
    try {
      const appointments = await Appointment.find({ status });
  
      if (appointments.length === 0) {
        return { success: true, data: `No ${status} appointments` };
      }
  
      return { success: true, data: appointments };
    } catch (error) {
      console.error(`Cannot get ${status} appointments`, error);
      throw new Error(`Cannot get ${status} appointments`);
    }
  }
};

export default AdminService;
