const DemoRequest = require('../models/DemoRequest');

// Submit a demo request
exports.submitDemoRequest = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline. Demo requests cannot be saved at this time.' });
    }

    const { name, email, company, message } = req.body;
    
    const request = new DemoRequest({
      name,
      email,
      company,
      message
    });

    await request.save();
    res.status(201).json({ message: 'Demo request submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all demo requests
exports.getAllDemoRequests = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update demo request status
exports.updateDemoRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const request = await DemoRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
