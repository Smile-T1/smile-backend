import yup from 'yup';

export const changePasswordSchema = yup.object({
  body: yup.object({
    currentPassword: yup.string().required('Old password is required'),
    newPassword: yup.string().required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Confirm password must match new password')
      .required('Confirm password is required'),
  }),
});
