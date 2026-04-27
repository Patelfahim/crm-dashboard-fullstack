const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

// DB
const { connectDB, sequelize } = require('./config/db');

// Models
const User = require('./models/User');
const Lead = require('./models/Lead');
const Task = require('./models/Task');

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 🔍 DB Connection Test Route
app.get('/api/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SELECT 1+1 AS result");

    res.json({
      status: 'success',
      message: 'Database connection is ACTIVE',
      db_check: results[0].result === 2
    });

  } catch (error) {
    console.error("❌ DB TEST FAILED:", error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection FAILED',
      details: error.message
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// PORT
const PORT = process.env.PORT || 5001;

// 🌱 AUTO SEED USERS
const seedUsers = async () => {
  const usersToSeed = [
    { name: 'Admin',      email: 'admin@crm.com', password: 'Admin@1234', role: 'admin' },
    { name: 'Regular User', email: 'user@crm.com',  password: 'User@1234',  role: 'user'  },
    { name: 'Sales Rep',  email: 'sales@crm.com', password: 'Sales@1234', role: 'sales' },
  ];

  try {
    for (const u of usersToSeed) {
      const existing = await User.findOne({ where: { email: u.email } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
        });
        console.log(`✅ ${u.role} user created: ${u.email}`);
      } else {
        console.log(`ℹ️ ${u.role} user already exists: ${u.email}`);
      }
    }
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};

// 🌱 AUTO SEED DEMO DATA (Leads & Tasks)
const seedDemoData = async () => {
  try {
    const leadCount = await Lead.count();
    if (leadCount > 0) {
      console.log(`ℹ️ Demo data already exists (${leadCount} leads). Skipping.`);
      return;
    }

    const demoLeads = [
      { name: 'Priya Sharma',    company: 'Infosys Ltd',      email: 'priya@infosys.com',     status: 'Proposal',    value: '₹12,00,000',  source: 'Referral' },
      { name: 'Rohan Mehta',     company: 'TCS Global',       email: 'rohan@tcs.com',         status: 'Negotiation', value: '₹8,50,000',   source: 'Website' },
      { name: 'Ananya Iyer',     company: 'Wipro Tech',       email: 'ananya@wipro.com',      status: 'Qualified',   value: '₹21,00,000',  source: 'LinkedIn' },
      { name: 'Karan Bose',      company: 'HCL Systems',      email: 'karan@hcl.com',         status: 'Discovery',   value: '₹4,20,000',   source: 'Cold Call' },
      { name: 'Divya Nair',      company: 'Cognizant',        email: 'divya@cognizant.com',   status: 'Proposal',    value: '₹16,00,000',  source: 'Referral' },
      { name: 'Arjun Patel',     company: 'Tech Mahindra',    email: 'arjun@techmahindra.com',status: 'Won',         value: '₹9,00,000',   source: 'Website' },
      { name: 'Sneha Reddy',     company: 'Zoho Corp',        email: 'sneha@zoho.com',        status: 'Qualified',   value: '₹7,50,000',   source: 'LinkedIn' },
      { name: 'Vikram Singh',    company: 'Reliance Digital', email: 'vikram@reliance.com',   status: 'Discovery',   value: '₹32,00,000',  source: 'Event' },
      { name: 'Meera Joshi',     company: 'Bajaj Finserv',    email: 'meera@bajaj.com',       status: 'Negotiation', value: '₹18,00,000',  source: 'Referral' },
      { name: 'Aditya Kumar',    company: 'Flipkart',         email: 'aditya@flipkart.com',   status: 'Proposal',    value: '₹25,00,000',  source: 'Website' },
      { name: 'Neha Gupta',      company: 'Paytm',            email: 'neha@paytm.com',        status: 'Won',         value: '₹11,00,000',  source: 'Cold Call' },
      { name: 'Rahul Verma',     company: 'HDFC Bank',        email: 'rahul@hdfc.com',        status: 'Discovery',   value: '₹45,00,000',  source: 'Event' },
      { name: 'Pooja Desai',     company: 'Tata Motors',      email: 'pooja@tatamotors.com',  status: 'Qualified',   value: '₹14,00,000',  source: 'LinkedIn' },
      { name: 'Sanjay Rao',      company: 'Larsen & Toubro',  email: 'sanjay@lnt.com',        status: 'Won',         value: '₹38,00,000',  source: 'Referral' },
      { name: 'Kavita Menon',    company: 'Axis Bank',        email: 'kavita@axisbank.com',   status: 'Negotiation', value: '₹22,00,000',  source: 'Website' },
    ];

    const demoTasks = [
      { title: 'Follow up with Priya on Q2 proposal',       priority: 'High',   due: 'Today, 3:00 PM',  status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Send contract draft to TCS team',           priority: 'High',   due: 'Today, 5:30 PM',  status: 'Pending',   assignee: 'Admin' },
      { title: 'Prepare demo for Wipro pitch',              priority: 'Medium', due: 'Tomorrow',        status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Update CRM records for Q1 deals',           priority: 'Low',    due: 'Apr 28',          status: 'Completed', assignee: 'Admin' },
      { title: 'Review HCL discovery call notes',           priority: 'Medium', due: 'Apr 27',          status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Schedule onboarding for Arjun',             priority: 'Low',    due: 'Apr 29',          status: 'Completed', assignee: 'Admin' },
      { title: 'Send pricing deck to Reliance Digital',     priority: 'High',   due: 'Today, 4:00 PM',  status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Prepare monthly sales report',              priority: 'Medium', due: 'Apr 30',          status: 'Pending',   assignee: 'Admin' },
      { title: 'Call Meera re: Bajaj Finserv negotiation',  priority: 'High',   due: 'Tomorrow',        status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Book meeting room for Flipkart demo',       priority: 'Low',    due: 'Apr 29',          status: 'Pending',   assignee: 'Admin' },
      { title: 'Draft NDA for HDFC engagement',             priority: 'Medium', due: 'Apr 28',          status: 'Pending',   assignee: 'Sales Rep' },
      { title: 'Update LinkedIn outreach templates',        priority: 'Low',    due: 'May 1',           status: 'Completed', assignee: 'Admin' },
    ];

    await Lead.bulkCreate(demoLeads);
    console.log(`✅ ${demoLeads.length} demo leads created`);

    await Task.bulkCreate(demoTasks);
    console.log(`✅ ${demoTasks.length} demo tasks created`);

  } catch (error) {
    console.error("❌ Demo data seed error:", error);
  }
};

// 🚀 START SERVER
const startServer = async () => {
  console.log("🚀 Starting server...");

  try {
    console.log("👉 Connecting DB...");
    await connectDB();

    console.log("👉 Syncing database...");
    await sequelize.sync({ alter: true });

    // Ensure role column accepts our newer roles
    try {
      const { DataTypes } = require('sequelize');
      await sequelize.getQueryInterface().changeColumn('Users', 'role', {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'user'
      });
      console.log("✅ Fixed role column schema");
    } catch(e) {
      console.log("ℹ️ Role column schema check passed or failed safely", e.message);
    }

    console.log("👉 Seeding users...");
    await seedUsers();

    console.log("👉 Seeding demo data...");
    await seedDemoData();

    console.log("✅ Server ready");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ FULL STARTUP ERROR:");
    console.error(error);
  }
};

startServer();