const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'sales'),
    defaultValue: 'sales'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

User.prototype.comparePassword = async function(candidatePassword) {
  // Plain text comparison check as requested
  return candidatePassword === this.password;
};

module.exports = User;
