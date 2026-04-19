const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Op } = require('sequelize');
const User = require('../models/User');
const Provider = require('../models/Provider');
const { AppError } = require('../utils/error');

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const citizenSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).required(),
  password: Joi.string().min(6).required()
});

const providerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).required(),
  password: Joi.string().min(6).required(),
  experience: Joi.number().min(0).required(),
  profession: Joi.string().valid('Advocate','Mediator','Arbitrator','Notary','DocumentWriter').required(),
  licenseNumber: Joi.string().required(),
  documentUrl: Joi.string().allow('', null)
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // email or phone
  password: Joi.string().required()
});

exports.registerCitizen = async (req, res, next) => {
  try {
    const { value, error } = citizenSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message);
    const exists = await User.findOne({ where: { [Op.or]: [{ email: value.email }, { phone: value.phone }] } });
    if (exists) throw new AppError('Email or phone already registered', 409);
    const user = await User.create({ ...value, role: 'CITIZEN', isVerified: true });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) { next(err); }
};

exports.registerProvider = async (req, res, next) => {
  try {
    const { value, error } = providerSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message);

    const exists = await User.findOne({ where: { [Op.or]: [{ email: value.email }, { phone: value.phone }] } });
    if (exists) throw new AppError('Email or phone already registered', 409);

    const user = await User.create({
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      role: 'PROVIDER'
    });

    const provider = await Provider.create({
      userId: user.id,
      experience: value.experience,
      profession: value.profession,
      licenseNumber: value.licenseNumber,
      documentUrl: value.documentUrl || ''
    });

    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, role: user.role }, provider });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message);

    const user = await User.findOne({ where: { [Op.or]: [{ email: value.identifier }, { phone: value.identifier }] } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const ok = await user.comparePassword(value.password);
    if (!ok) throw new AppError('Invalid credentials', 401);

    // ✅ Providers must be explicitly approved (isVerified === true)
    if (user.role === 'PROVIDER' && user.isVerified !== true) {
      throw new AppError('Provider not verified by admin', 403);
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};