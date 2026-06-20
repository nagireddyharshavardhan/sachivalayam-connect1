const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const complaintController = require('../controllers/complaintController');

// Auth Routes
router.post('/auth/send-otp', authController.sendOtp);
router.post('/auth/verify-otp', authController.verifyOtp);

// Complaint Routes
router.post('/complaints', complaintController.createComplaint);
router.get('/complaints', complaintController.getComplaints);
router.get('/complaints/analytics', complaintController.getAnalytics); // Note: put before /:id
router.get('/complaints/:id', complaintController.getComplaintById);
router.patch('/complaints/:id/status', complaintController.updateComplaintStatus);

module.exports = router;
