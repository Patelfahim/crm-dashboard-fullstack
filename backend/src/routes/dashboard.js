const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const User = require('../models/User');

// @route   GET /api/dashboard/stats
// All authenticated users can view stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalLeads = await Lead.count();
    // "Hot" = leads in Proposal or Negotiation (actively being pursued)
    const hotLeads = await Lead.count({ where: { status: ['Proposal', 'Negotiation'] } });
    const wonLeads = await Lead.count({ where: { status: 'Won' } });
    const pendingTasks = await Task.count({ where: { status: 'Pending' } });
    
    // Calculate total revenue from Lead values
    const allLeads = await Lead.findAll();
    const totalRevenue = allLeads.reduce((acc, lead) => {
      const val = parseInt(lead.value.replace(/[^0-9]/g, '')) || 0;
      return acc + val;
    }, 0);

    // Win rate = Won / Total (percentage)
    const winRate = totalLeads > 0 ? `${Math.round((wonLeads / totalLeads) * 100)}%` : '0%';

    res.json({
      success: true,
      data: {
        totalLeads,
        hotLeads,
        wonLeads,
        pendingTasks,
        revenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        conversionRate: winRate,
        activePipeline: `₹${(totalRevenue * 0.4).toLocaleString('en-IN')}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- LEADS CRUD ---

// All authenticated users can VIEW leads
router.get('/leads', protect, async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: leads, total: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Only admin & sales can CREATE leads
router.post('/leads', protect, authorize('admin', 'sales'), async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Only admin & sales can UPDATE leads
router.put('/leads/:id', protect, authorize('admin', 'sales'), async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    await lead.update(req.body);
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Only admin can DELETE leads
router.delete('/leads/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    await lead.destroy();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- TASKS CRUD ---

// All authenticated users can VIEW tasks
router.get('/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin & sales can CREATE tasks
router.post('/tasks', protect, authorize('admin', 'sales'), async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin & sales can UPDATE tasks
router.put('/tasks/:id', protect, authorize('admin', 'sales'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.update(req.body);
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Only admin can DELETE tasks
router.delete('/tasks/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.destroy();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- USERS (Admin only) ---
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
