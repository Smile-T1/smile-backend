import yup from 'yup';

export const patientAppointmentSchema = yup.object({
  body: yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email().required(),
    mobile: yup.string().required(),
    birthdate: yup.date().required(),
    gender: yup.string().required(),
    bloodgroup: yup.string().required().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    dateappointment: yup.date().required(),
    time: yup.string().required(),
    address: yup.string().required(),
    doctor: yup.string().required(),
    note: yup.string(),
    report: yup.string(),
  }),
});
