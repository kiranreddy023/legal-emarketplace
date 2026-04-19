const Provider = require('../models/Provider');
const Incentive = require('../models/Incentive');
const { sequelize } = require('../config/db');

const addPoints = async (providerId, points, reason) => {
  await Incentive.create({ providerId, points, reason });
  const provider = await Provider.findByPk(providerId);
  if (provider) {
    provider.incentivePoints += points;
    await provider.save();
  }
};

const rewardCompletion = async (providerId) => addPoints(providerId, 10, 'Completed service');
const rewardPositiveRating = async (providerId) => addPoints(providerId, 5, 'Positive rating');
// called monthly (cron) to check 10+ bookings
const rewardMonthlyBonus = async (providerId) => addPoints(providerId, 20, 'Monthly 10+ bookings bonus');

module.exports = { addPoints, rewardCompletion, rewardPositiveRating, rewardMonthlyBonus };