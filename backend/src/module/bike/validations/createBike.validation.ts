import * as Joi from 'joi';
export const CreateBikeSchema = Joi.object({
    model: Joi.string().min(3).required(),
    color: Joi.string().min(3).required(),
    location: Joi.string().min(6).required(),
    isAvailable: Joi.boolean().required(),
});
