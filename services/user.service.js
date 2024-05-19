import User from '../models/user.model.js';

export async function findUserandUpdateProfilePic(userID, profilePic) {
  try {
    console.log('Inside findUserandUpdateProfilePic service:', profilePic);
    console.log('userID:', userID);
    const user = await User.findByIdAndUpdate(userID, { profilePic: profilePic }, { new: true });
    console.log('user:', user.profilePic);
    return user.profilePic;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw new Error('Failed to update profile picture');
  }
}
