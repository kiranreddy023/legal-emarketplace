const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Provider = require('./Provider');

class Booking extends Model {}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    citizenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Provider,
        key: 'id'
      }
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'),
      defaultValue: 'PENDING'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true
  }
);

Booking.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });
Booking.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

module.exports = Booking;