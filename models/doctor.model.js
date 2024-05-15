import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  speciality: {
    type: String,
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
}, {strict: "throw"});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
