import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .min(6, 'Password must have at least 6 characters')
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};
