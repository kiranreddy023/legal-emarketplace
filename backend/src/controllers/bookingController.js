const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const User = require('../models/User');
const { AppError } = require('../utils/error');
const { rewardCompletion } = require('../services/incentiveService');

exports.createBooking = async (req, res, next) => {
  try {
    const { providerId, date, time, notes } = req.body;
    if (!providerId || !date || !time) throw new AppError('Missing fields');
    const provider = await Provider.findByPk(providerId);
    if (!provider) throw new AppError('Provider not found', 404);

    // conflict: booking exists with same provider/date/time not rejected
    const conflict = await Booking.findOne({
      where: {
        providerId: providerId,
        date,
        time,
        status: { [Op.in]: ['PENDING', 'ACCEPTED', 'COMPLETED'] }
      }
    });
    if (conflict) throw new AppError('Slot not available', 409);

    const booking = await Booking.create({ citizenId: req.user.id, providerId, date, time, notes });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

exports.myBookings = async (req, res, next) => {
  try {
    let whereClause;
    if (req.user.role === 'CITIZEN') {
      whereClause = { citizenId: req.user.id };
    } else {
      const provider = await Provider.findOne({ where: { userId: req.user.id } });
      whereClause = { providerId: provider ? provider.id : null };
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        { model: Provider, as: 'provider' },
        { model: User, as: 'citizen', attributes: ['name', 'email', 'phone'] }
      ]
    });
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.respondBooking = async (req, res, next) => {
  try {
    const { bookingId, action } = req.body; // ACCEPT or REJECT
    const booking = await Booking.findByPk(bookingId);
    const provider = await Provider.findOne({ where: { userId: req.user.id } });
    if (!booking || !provider || booking.providerId !== provider.id) throw new AppError('Not found or unauthorized', 404);
    booking.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

exports.completeBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    const provider = await Provider.findOne({ where: { userId: req.user.id } });
    if (!booking || !provider || booking.providerId !== provider.id) throw new AppError('Not found or unauthorized', 404);
    booking.status = 'COMPLETED';
    await booking.save();
    await rewardCompletion(provider.id);
    res.json(booking);
  } catch (err) { next(err); }
};