import yup from 'yup';

export const patientAppointmentSchema = yup.object({
  body: yup.object({
    doctorUser: yup.string().required(),
    dateappointment: yup.date().required(),
    appointmentTime: yup.string().required(),
    appointmentNotes: yup.string().optional(),
  }),
});
