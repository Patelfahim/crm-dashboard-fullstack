const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Dummy data
const leads = [
  { id: 1, name: 'Priya Sharma', company: 'TechNova Pvt Ltd', email: 'priya@technova.in', status: 'Hot', value: '₹2,40,000', source: 'LinkedIn' },
  { id: 2, name: 'Rahul Mehta', company: 'CloudBridge Solutions', email: 'rahul@cloudbridge.com', status: 'Warm', value: '₹85,000', source: 'Referral' },
  { id: 3, name: 'Sneha Patel', company: 'DigiFlow Agency', email: 'sneha@digiflow.in', status: 'Cold', value: '₹1,20,000', source: 'Website' },
  { id: 4, name: 'Arjun Nair', company: 'Finedge Capital', email: 'arjun@finedge.com', status: 'Hot', value: '₹5,50,000', source: 'Cold Email' },
  { id: 5, name: 'Meera Iyer', company: 'GreenRoot Startups', email: 'meera@greenroot.io', status: 'Warm', value: '₹3,00,000', source: 'Event' }
];

const tasks = [
  { id: 1, title: 'Follow up with Priya on proposal', priority: 'High', due: '2026-03-28', status: 'Pending', assignee: 'Alex Morgan' },
  { id: 2, title: 'Send demo invite to Arjun Nair', priority: 'High', due: '2026-03-27', status: 'In Progress', assignee: 'Alex Morgan' },
  { id: 3, title: 'Prepare Q1 pipeline report', priority: 'Medium', due: '2026-03-31', status: 'Pending', assignee: 'Ritika Sen' },
  { id: 4, title: 'Update CRM contact records', priority: 'Low', due: '2026-04-02', status: 'Completed', assignee: 'Dev Kumar' },
  { id: 5, title: 'Schedule onboarding call – CloudBridge', priority: 'Medium', due: '2026-03-29', status: 'Pending', assignee: 'Alex Morgan' }
];

const users = [
  { id: 1, name: 'Alex Morgan', role: 'Admin', email: 'demo@crm.com', status: 'Active', deals: 12, revenue: '₹18,50,000' },
  { id: 2, name: 'Ritika Sen', role: 'Manager', email: 'ritika@crm.com', status: 'Active', deals: 8, revenue: '₹9,20,000' },
  { id: 3, name: 'Dev Kumar', role: 'Sales Rep', email: 'dev@crm.com', status: 'Active', deals: 5, revenue: '₹4,75,000' },
  { id: 4, name: 'Anika Roy', role: 'Sales Rep', email: 'anika@crm.com', status: 'Inactive', deals: 3, revenue: '₹2,10,000' }
];

const stats = {
  totalLeads: 48,
  hotLeads: 12,
  tasksToday: 5,
  revenue: '₹42,95,000',
  conversionRate: '24%',
  activePipeline: '₹18,40,000'
};

// @route   GET /api/dashboard/stats
router.get('/stats', protect, (req, res) => {
  res.json({ success: true, data: stats });
});

// @route   GET /api/dashboard/leads
router.get('/leads', protect, (req, res) => {
  res.json({ success: true, data: leads, total: leads.length });
});

// @route   GET /api/dashboard/tasks
router.get('/tasks', protect, (req, res) => {
  res.json({ success: true, data: tasks, total: tasks.length });
});

// @route   GET /api/dashboard/users
router.get('/users', protect, (req, res) => {
  res.json({ success: true, data: users, total: users.length });
});

module.exports = router;
