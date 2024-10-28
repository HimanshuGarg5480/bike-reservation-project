import * as Joi from 'joi';
import { Role } from '../user.entity';

export const CreateUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid(...Object.values(Role)).optional(),
});
