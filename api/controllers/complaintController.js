const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const {
      userId, residentName, villageArea, complaintCategory,
      complaintDescriptionText, language, latitude, longitude,
      audioUrl, photoUrl
    } = req.body;

    const newComplaint = new Complaint({
      userId,
      residentName,
      villageArea,
      complaintCategory,
      complaintDescriptionText,
      language: language || 'English',
      location: { latitude, longitude },
      complaintAudioUrl: audioUrl || null,
      photoUrl: photoUrl || null,
      status: 'Submitted'
    });

    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: newComplaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { userId, role } = req.query;

    let filter = {};
    if (role === 'Resident' && userId) {
      filter.userId = userId;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Submitted', 'Assigned', 'In Progress', 'Resolved'].includes(status)) {
       return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, data: complaint, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'Submitted' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    
    // Group by category
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$complaintCategory", count: { $sum: 1 } } }
    ]);

    const formattedByCategory = byCategory.reduce((acc, curr) => ({...acc, [curr._id]: curr.count}), {});

    res.status(200).json({
      success: true,
      data: {
        summary: { totalComplaints, submitted, inProgress, resolved },
        byCategory: formattedByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
