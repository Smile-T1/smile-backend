import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    // Reference to User schema
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Additional attributes for patients
    medicalHistory: {
        type: Array
    }
}, {timestamps: true});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
