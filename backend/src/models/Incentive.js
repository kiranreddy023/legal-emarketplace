const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Provider = require('./Provider');

class Incentive extends Model {}

Incentive.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Provider,
        key: 'id'
      }
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Incentive',
    tableName: 'incentives',
    timestamps: true
  }
);

Incentive.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

module.exports = Incentive;