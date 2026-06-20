const User = require('../models/User');

exports.sendOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully (Mock: Use 1234)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp, role } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and OTP required' });
    }

    if (otp !== '1234') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    let user = await User.findOne({ mobileNumber });
    
    if (!user) {
      user = new User({ mobileNumber, role: role || 'Resident' });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        name: user.name,
        villageArea: user.villageArea
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
