const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Booking = require('./Booking');
const Provider = require('./Provider');

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: Booking,
        key: 'id'
      }
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
  }
);

Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Review.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });
Review.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

module.exports = Review;