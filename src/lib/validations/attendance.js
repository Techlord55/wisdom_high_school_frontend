// File: src/lib/validations/attendance.js

// ==================== src/lib/validations/attendance.js ====================
import { z } from 'zod';

export const createAttendanceSchema = z.object({
  student: z.string().uuid(),
  date: z.string(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  subject: z.string().min(1, 'Subject is required'),
  notes: z.string().optional(),
});