const { isValidObjectId } = require('mongoose');
const User = require('../models/User');
const ResetPassToken = require('../models/ResetPassToken');

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;

  if (!token || !id)
    return res.status(401).json({ message: 'Invalid request!' });

  if (!isValidObjectId(id))
    return res.status(401).json({ message: 'Invalid user' });

  const user = await User.findById(id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = await ResetPassToken.findOne({ owner: user._id });
  if (!resetToken)
    return res.status(404).json({ message: 'Reset token not found!' });

  const isValid = resetToken.token === token

  if (!isValid)
    return res.status(401).json({ message: 'Reset token is invalid!' });
  req.user = user;
  next()
};
