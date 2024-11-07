import * as Joi from 'joi';

export const CreateReservationSchema = Joi.object({
  userId: Joi.required(),
  bikeId: Joi.required(),
  fromDateTime: Joi.date().iso().required(),
  toDateTime: Joi.date().iso().greater(Joi.ref('fromDateTime')).required(),
});
