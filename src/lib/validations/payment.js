// File: src/lib/validations/payment.js
// ==================== src/lib/validations/payment.js ====================
import { z } from 'zod';

export const createPaymentSchema = z.object({
  student: z.string().uuid(),
  amount: z.number().min(1000, 'Amount must be at least 1000 FCFA'),
  description: z.string().min(1, 'Description is required'),
  payment_method: z.enum(['mtn', 'orange', 'bank', 'cash', 'stripe']),
});