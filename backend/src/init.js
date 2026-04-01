const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Patelfahim@120',
    });
    const dbName = process.env.DB_NAME || 'crm_dashboard';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database '${dbName}' ready.`);
    await connection.end();

    const { sequelize } = require('./config/db');
    const User = require('./models/User');

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced.');

    // Seed users
    const usersToSeed = [
      { name: 'Admin User', email: 'admin@crm.com', password: 'Admin@1234', role: 'admin' },
      { name: 'Regular User', email: 'user@crm.com', password: 'User@1234', role: 'user' },
      { name: 'Sales Rep', email: 'sales@crm.com', password: 'Sales@1234', role: 'sales' },
    ];

    for (const u of usersToSeed) {
      const existing = await User.findOne({ where: { email: u.email } });
      if (!existing) {
        const hashed = await bcrypt.hash(u.password, 10);
        await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
        console.log(`✅ ${u.role} user created: ${u.email}`);
      } else {
        console.log(`ℹ️ ${u.role} user already exists: ${u.email}`);
      }
    }


    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
};

setupDB();
