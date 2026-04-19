const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

class Provider extends Model {}

Provider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    },
    profession: {
      type: DataTypes.ENUM('Advocate', 'Mediator', 'Arbitrator', 'Notary', 'DocumentWriter'),
      allowNull: false
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ratingAvg: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    availability: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    incentivePoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Provider',
    tableName: 'providers',
    timestamps: true
  }
);

Provider.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Provider;