// File: src/lib/validations/grade.js

// ==================== src/lib/validations/grade.js ====================
import { z } from 'zod';

export const createGradeSchema = z.object({
  student: z.string().uuid(),
  subject: z.string().min(1, 'Subject is required'),
  exam_type: z.enum(['quiz', 'test', 'midterm', 'final', 'assignment']),
  exam_name: z.string().min(1, 'Exam name is required'),
  marks_obtained: z.number().min(0, 'Marks must be positive'),
  total_marks: z.number().min(1, 'Total marks must be positive'),
  academic_year: z.string().min(1, 'Academic year is required'),
  term: z.enum(['1', '2', '3']),
  exam_date: z.string().optional(),
  remarks: z.string().optional(),
});