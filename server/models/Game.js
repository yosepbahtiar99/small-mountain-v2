const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  thumbnail: {
    type: DataTypes.STRING // File path
  },
  status: {
    type: DataTypes.ENUM('Development', 'Released'),
    defaultValue: 'Development'
  },
  progress: {
    type: DataTypes.JSON, // { script: 70, art: 40, music: 20 }
    defaultValue: {}
  },
  playLink: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Game;
