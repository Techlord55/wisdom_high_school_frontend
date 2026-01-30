// File: src/lib/validations/assignment.js

// ==================== src/lib/validations/assignment.js ====================
import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  class_level: z.string().min(1, 'Class level is required'),
  due_date: z.string(),
  total_marks: z.number().min(1).default(100),
  attachment_url: z.string().url().optional(),
  is_published: z.boolean().default(false),
});

export const submitAssignmentSchema = z.object({
  assignment: z.string().uuid(),
  submission_text: z.string().optional(),
  attachment_url: z.string().url().optional(),
});