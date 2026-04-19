const User = require('../models/User');
const Provider = require('../models/Provider');
const Incentive = require('../models/Incentive');
const { AppError } = require('../utils/error');

exports.verifyProvider = async (req, res, next) => {
  try {
    const { userId, approve } = req.body;
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'PROVIDER') throw new AppError('Provider user not found', 404);
    user.isVerified = !!approve;
    await user.save();
    res.json({ userId: user.id, isVerified: user.isVerified });
  } catch (err) { next(err); }
};

exports.listProviders = async (req, res, next) => {
  try {
    const providers = await Provider.findAll({
      include: { model: User, as: 'user', attributes: ['name', 'email', 'phone', 'isVerified'] }
    });
    res.json(providers);
  } catch (err) { next(err); }
};

exports.incentives = async (req, res, next) => {
  try {
    const items = await Incentive.findAll({
      include: { model: Provider, as: 'provider' }
    });
    res.json(items);
  } catch (err) { next(err); }
};