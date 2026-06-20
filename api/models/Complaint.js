const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  residentName: { type: String, required: true },
  villageArea: { type: String, required: true },
  complaintCategory: { type: String, required: true },
  complaintDescriptionText: { type: String, required: true },
  complaintAudioUrl: { type: String }, // optional, for voice recordings
  photoUrl: { type: String }, // optional, for images
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  language: { type: String, default: 'English' }, // Telugu or English
  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
