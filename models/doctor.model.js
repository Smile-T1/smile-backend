import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  speciality: {
    type: String,
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
