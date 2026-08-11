import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Invalid email format' }),
  password: Joi.string().min(8).required().messages({ 'string.min': 'Password must be at least 8 characters' }),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  organizationName: Joi.string().trim().required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});