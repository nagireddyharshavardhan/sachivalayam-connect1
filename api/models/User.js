const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['Resident', 'Authority'],
    default: 'Resident',
  },
  name: {
    type: String,
  },
  villageArea: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
