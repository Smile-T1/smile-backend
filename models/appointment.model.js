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
    appointmentDate: {
      type: Date,
    },
    appointmentDay: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Cancelled', 'Completed', 'Pending'],
      default: 'Pending',
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
    lastVisit: {},
  },
  { timestamps: true },
);

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Middleware to convert date and time to appointmentDate
appointmentSchema.pre('save', function (next) {
  if (this.date && this.time) {
    const [day, month, year] = this.date.split('-').map(Number);
    const [hour, minute] = this.time.match(/\d+/g).map(Number);
    const isPM = this.time.includes('PM');
    const adjustedHour = (hour % 12) + (isPM ? 12 : 0);

    this.appointmentDate = new Date(year, month - 1, day, adjustedHour, minute);
    this.appointmentDay = daysOfWeek[this.appointmentDate.getDay()];
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
