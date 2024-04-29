import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    // doctor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Doctor',
    //   required: true,
    // },
    date: {
      type: Date,
      required: [true, 'missing the date of creation of the user'],
      default: Date.now(),
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    Notes: {
      type: String,
    },
    Report: {
      type: String,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
