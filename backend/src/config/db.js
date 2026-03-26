const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected");
  } catch (error) {
    console.error("❌ MySQL Error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };