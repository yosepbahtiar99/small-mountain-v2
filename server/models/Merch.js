const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Merch = sequelize.define('Merch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING
  },
  shopeeLink: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Merch;
