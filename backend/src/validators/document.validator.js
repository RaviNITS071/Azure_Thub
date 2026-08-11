import Joi from 'joi';

export const presignSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required()
});

export const confirmDocumentSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.string().optional()
});