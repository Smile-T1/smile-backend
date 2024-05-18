export function validateAppointmentDate(dateappointment, appointmentTime) {
  const [day, month, year] = dateappointment.split('-').map(Number);
  const [hour, minute] = appointmentTime.match(/\d+/g).map(Number);
  const appointmentDateTime = new Date(
    year,
    month - 1,
    day,
    (hour % 12) + (appointmentTime.includes('PM') ? 12 : 0),
    minute,
  );

  if (appointmentDateTime < new Date()) {
    return false;
  } else {
    return true;
  }
}
