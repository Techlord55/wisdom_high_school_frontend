// File: src/lib/validations/user.js
// ==================== src/lib/validations/user.js ====================
import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string().regex(/^\d{9}$/, 'Phone number must be 9 digits').optional(),
  sex: z.enum(['M', 'F']).optional(),
  place_of_birth: z.string().optional(),
  date_of_birth: z.string().optional(),
});