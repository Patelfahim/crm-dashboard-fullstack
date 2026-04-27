const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = process.env.MYSQL_PUBLIC_URL
  ? new Sequelize(process.env.MYSQL_PUBLIC_URL, {
      dialect: 'mysql',
      logging:false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
      }
    );

// Connect DB
const connectDB = async () => {
  try {
    console.log("👉 Connecting to MySQL...");

    await sequelize.authenticate();

    console.log("✅ MySQL Connected Successfully");

  } catch (error) {
    console.error("❌ MySQL FULL ERROR:");
    console.error(error); // 👈 IMPORTANT (not just message)

    // ❌ DON'T exit app (prevents Render crash loop)
    // process.exit(1);
  }
};

module.exports = { sequelize, connectDB };