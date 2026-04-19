const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { AppError } = require('../utils/error');
const { rewardPositiveRating } = require('../services/incentiveService');

exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking || booking.citizenId !== req.user.id || booking.status !== 'COMPLETED') {
      throw new AppError('Invalid booking for review', 400);
    }
    const review = await Review.create({
      bookingId: booking.id,
      citizenId: req.user.id,
      providerId: booking.providerId,
      rating,
      comment
    });

    // update provider rating average
    const provider = await Provider.findByPk(booking.providerId);
    provider.ratingAvg = (provider.ratingAvg * provider.ratingCount + rating) / (provider.ratingCount + 1);
    provider.ratingCount += 1;
    await provider.save();

    if (rating >= 4) await rewardPositiveRating(provider.id);

    res.status(201).json(review);
  } catch (err) { next(err); }
};