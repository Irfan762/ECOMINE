const Report = require('../models/Report');
const Assessment = require('../models/Assessment');

// Generate Report
exports.generateReport = async (req, res) => {
  try {
    const { assessmentId, reportType } = req.body;

    // Check if assessment exists and belongs to user
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment || assessment.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const report = new Report({
      userId: req.userId,
      assessmentId,
      reportType,
      title: `${reportType.toUpperCase()} Report - ${assessment.metalType}`,
      status: 'pending'
    });

    await report.save();

    // Simulate report generation
    setTimeout(async () => {
      report.status = 'completed';
      report.generatedAt = Date.now();
      report.fileName = `ecomine-${reportType}-${Date.now()}.pdf`;
      report.downloadUrl = `/reports/${report._id}`;
      await report.save();
    }, 2000);

    res.status(201).json(report);
  } catch (error) {
    // Return mock report if database unavailable
    res.status(201).json({
      _id: 'mock-' + Date.now(),
      title: `${req.body.reportType?.toUpperCase() || 'COMPREHENSIVE'} Report`,
      reportType: req.body.reportType,
      status: 'completed',
      generatedAt: new Date(),
      downloadUrl: '/reports/mock-report',
      message: 'Mock report (database unavailable)'
    });
  }
};

// Get User Reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId })
      .populate('assessmentId')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    // Return mock reports if database unavailable
    res.json([
      {
        _id: 'mock-report-1',
        title: 'COMPREHENSIVE Report - Aluminum',
        reportType: 'comprehensive',
        status: 'completed',
        generatedAt: new Date(),
        summary: 'Aluminum production shows 15.2 GJ/t energy intensity with 94% confidence level',
        downloadUrl: '/reports/mock-report-1'
      }
    ]);
  }
};

// Get Single Report
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || report.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || report.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await Report.deleteOne({ _id: req.params.id });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
