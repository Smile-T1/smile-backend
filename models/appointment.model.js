import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'missing the date of appointment'],
    },
    time: {
      type: String,
      required: [true, 'missing the time of appointment'],
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
      default: '',
    },
    Type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
