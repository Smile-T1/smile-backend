import yup from 'yup';

export const appointmentDoctorsSchema = yup.object({
  query: yup.object({
    speciality: yup.string(),
    page: yup.number().optional(),
    limit: yup.number().optional(),
  }),
});

export const getAppointmentSchema = yup.object({
  params: yup.object({
    id: yup.string().required({
      message: 'Appointment ID is required',
    }),
  }),
});
