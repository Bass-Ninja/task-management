import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    STAGE: Joi.string().required(),
    // HOST: Joi.string().required(),
    // PORT: Joi.number().default(5432).required(),
    // USERNAME: Joi.string().required(),
    // PASSWORD: Joi.string().required(),
    // DATABASE: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
})