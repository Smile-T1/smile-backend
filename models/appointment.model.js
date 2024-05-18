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
      enum: ['Upcoming', 'Cancelled', 'Completed'],
      default: 'Upcoming',
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
      enum: [
        'Routine Check-up and Cleaning',
        'Dental Filling',
        'Root Canal Therapy',
        'Tooth Extraction',
        'Orthodontic Consultation',
        'Cosmetic Dentistry',
        'Emergency Dental Care',
      ],
    },
    prescription: [
      {
        Medication: {
          type: String,
          default: null,
        },
        Dosage: {
          type: String,
          default: null,
        },
        Consultation: {
          type: String,
          default: null,
        },
      },
    ],
    lastVisit: {
      
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
