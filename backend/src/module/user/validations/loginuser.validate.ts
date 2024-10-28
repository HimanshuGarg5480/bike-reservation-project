import * as Joi from 'joi'; // Import Joi

export const LoginUserSchema = Joi.object({
    email: Joi.string().email().required(), // Validate email format
    password: Joi.string().min(6).required() // Validate password length
});