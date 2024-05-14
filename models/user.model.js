import mongoose from 'mongoose';
import validator from 'validator';
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
      minlength: [6, 'the minimum length of password is 6'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    profilePic: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    mobile: [
      {
        type: String,
        validate: [validator.isMobilePhone, 'Please provide a valid mobile number'],
      },
    ],
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    access: {
      type: String,
      required: true,
      enum: ['Patient', 'Doctor', 'Admin'],
    },
  },
  { timestamps: true },
);

userSchema.virtual('age').get(function () {
  if (!this.dob) return undefined;
  const diff = Date.now() - this.dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

const User = mongoose.model('User', userSchema);

export default User;
