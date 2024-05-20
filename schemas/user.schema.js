import yup from 'yup';

export const changePasswordSchema = yup.object({
  body: yup.object({
    currentPassword: yup.string().required('Old password is required'),
    newPassword: yup
      .string()
      .required('New password is required')
      .notOneOf([yup.ref('currentPassword'), null], 'New password must be different from the old password'),
  }),
});
