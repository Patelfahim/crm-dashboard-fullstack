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

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@crm.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';

    const userEmail = process.env.ADMIN_EMAIL || 'user@crm.com';
    const userPassword = process.env.ADMIN_PASSWORD || 'User@1234';


    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
        console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    const existingUser = await User.findOne({ where: { email: userEmail } });
    if (!existingUser) {
      const hashedPassword2 = await bcrypt.hash(userPassword, 10);
      await User.create({
        name: 'Super Admin',
        email: userEmail,
        password: hashedPassword2,
        role: 'admin'
      });
      console.log(`✅ Admin user created: ${userEmail}`);
    } else {
        console.log(`ℹ️ Admin user already exists: ${userEmail}`);
    }


    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
};

setupDB();
