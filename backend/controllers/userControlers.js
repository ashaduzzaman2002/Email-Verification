// Models
const User = require('../models/User');
const VerifcationToken = require('../models/VerificationToken');

const bcrypt = require('bcrypt');
const { sendError, createRandomBytes } = require('../utils/helper');
const jwt = require('jsonwebtoken');
const {
  generateOTP,
  mailTransport,
  mailTemplete,
  welcomeMail,
  generatePasswordResetTemplete,
} = require('../utils/mail');
const { isValidObjectId } = require('mongoose');
const ResetPassToken = require('../models/ResetPassToken');

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      // Hashing the password
      const hashpassword = await bcrypt.hash(password, 8);

      const newUser = new User({
        name,
        email,
        password: hashpassword,
      });

      const otp = generateOTP();

      const hashOTP = await bcrypt.hash(otp, 8);

      const verifcationToken = VerifcationToken({
        owner: newUser._id,
        token: hashOTP,
      });

      await verifcationToken.save();
      await newUser.save();

      mailTransport().sendMail({
        from: 'crezytechy@gmail.com',
        to: newUser.email,
        subject: 'Please verify your email account',
        html: mailTemplete(otp),
      });

      res.status(200).json({ success: true, msg: 'Register Successfully' });
    }

    res.status(403).json({ msg: 'User Already exist' });
  } catch (error) {
    console.log(error);
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email: email });
  if (user) {
    const userPassword = user.password;
    const isMatched = await bcrypt.compare(password, userPassword);

    if (isMatched) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT, {
        expiresIn: '7d',
      });
      user = {
        name: user.name,
        email: user.email,
        avtar: user.avtar,
        id: user._id,
        token,
      };
      res.status(200).json({ success: true, user });
    } else {
      sendError(res, 'Invalid Credentials');
    }
  } else {
    sendError(res, 'Invalid Credentials');
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, 'Invalid request, missing parameters!');

  if (!isValidObjectId(userId)) return sendError(res, 'Invalid user id!');
  const user = await User.findById(userId);
  if (user) {
    if (!user.verified) {
      const token = await VerifcationToken.findOne({ owner: userId });
      if (token) {
        const isMatched = await bcrypt.compare(otp, token.token);
        if (isMatched) {
          user.verified = true;
          await VerifcationToken.findByIdAndDelete(token._id);
          await user.save();
          mailTransport().sendMail({
            from: 'crezytechy@gmail.com',
            to: user.email,
            subject: 'Welcome to our company',
            html: welcomeMail(),
          });

          res
            .status(200)
            .json({ success: true, msg: 'Your email is verified' });
        } else {
          sendError(res, 'Worng OTP');
        }
      } else {
        sendError(res, 'User not found');
      }
    } else {
      sendError(res, 'User already verified');
    }
  } else {
    sendError(res, 'User not found');
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(401).json({ messsage: 'Please provide a valid email' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({messsage: 'User not found'});

  const token = await ResetPassToken.findOne({ owner: user._id });
  if (token) return res.status(401).json({messsage: 'After 10 minutes you can request for your OTP'});
 
  const randomBytes = await createRandomBytes();


  const resetToken = new ResetPassToken({ owner: user._id, token: randomBytes });

  await resetToken.save();

  mailTransport().sendMail({
    from: 'crezytechy@gmail.com',
    to: user.email,
    subject: 'Verification Email',
    html: generatePasswordResetTemplete(`http://localhost:3000/reset-password?token=${randomBytes}&id=${user._id}`),

  });
  res.json({success: true, message: 'Password reset link is sent to your email.'})
};


exports.resetPassword = async (req, res) => {
  const {password} = req.body

  const user = await User.findById(req.user._id)

  if(!user) return res.status(404).json({ message: 'User not found' });

  const isSamePassword =  await bcrypt.compare(password, user.password);
  if(isSamePassword) return res.status(401).json({ message: 'New password must be different!' });

  if(password.trim().length < 8) return res.status(401).json({ message: 'Password must have atleat 8 characters!' });
  user.password = await bcrypt.hash(password.trim(), 8)
  await user.save()

  mailTransport().sendMail({
    from: 'crezytechy@gmail.com',
    to: user.email,
    subject: 'Password Reset successfully',
    html: '<p>Password reset successfully</p>'

  });

  res.json({success: true})
  await ResetPassToken.findOneAndDelete({owner: user._id})

}