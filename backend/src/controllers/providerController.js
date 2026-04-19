const { Op } = require('sequelize');
const Provider = require('../models/Provider');
const User = require('../models/User');
const { AppError } = require('../utils/error');

exports.getProviders = async (req, res, next) => {
  try {
    const { q, profession, minExp = 0 } = req.query;
    
    let whereClause = {
      experience: { [Op.gte]: Number(minExp) }
    };

    if (profession) {
      whereClause.profession = profession;
    }

    if (q) {
      // Search for providers by user name
      const users = await User.findAll({
        where: { role: 'PROVIDER', name: { [Op.iLike]: `%${q}%` } }
      });
      const userIds = users.map(u => u.id);
      if (userIds.length > 0) {
        whereClause.userId = { [Op.in]: userIds };
      } else {
        return res.json([]);
      }
    }

    const providers = await Provider.findAll({
      where: whereClause,
      include: { model: User, as: 'user', attributes: ['name', 'email', 'phone'] }
    });
    res.json(providers);
  } catch (err) { next(err); }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ where: { userId: req.user.id } });
    if (!provider) throw new AppError('Provider not found', 404);
    provider.availability = req.body.availability || [];
    await provider.save();
    res.json(provider);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({
      where: { userId: req.user.id },
      include: { model: User, as: 'user', attributes: ['name', 'email', 'phone'] }
    });
    if (!provider) throw new AppError('Provider not found', 404);
    res.json(provider);
  } catch (err) { next(err); }
};