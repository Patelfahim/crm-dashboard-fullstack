const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'crm_dashboard',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Patelfahim@120',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected to ${sequelize.config.host}`);
  } catch (error) {
    console.error(`❌ MySQL Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
