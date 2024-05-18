import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    // Reference to User schema
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      default: 'Single',
    },
    occupation: {
      type: String,
      default: 'Sofware Developer',
    },
    history: {
      type: String,
    },
    report: {
      type: String,
      default: '',
    },

    // medicalRecord: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'MedicalRecord',
    //     required: true,
    //     unique: true,
    //     index: true,
    //     sparse: true,
    //     autopopulate: true,
    //     autopopulateSelect: 'patient',
    //     default: [],
    //   },
    // ],
    // Additional attributes for patients
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      default: 'A+',
    },
    linkedDoctor: {
      type: String,
      ref: 'Doctor',
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
        doctorID: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true },
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
