import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    profilePic: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
    },
    access: {
      type: String,
      required: true,
      enum: ['Patient', 'Doctor', 'Admin'],
    },
    // patientHistory: {
    //     type: Array
    // }
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
