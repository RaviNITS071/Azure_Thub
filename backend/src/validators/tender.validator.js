import Joi from 'joi';

export const tenderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  state: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  q: Joi.string().trim().optional() // for text search
});