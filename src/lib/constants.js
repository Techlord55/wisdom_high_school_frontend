// File: src/lib/constants.js
// ==================== src/lib/constants.js ====================
export const APP_NAME = 'Wisdom High School';
export const APP_DESCRIPTION = 'School Management System';

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const EXAM_TYPES = {
  QUIZ: 'quiz',
  TEST: 'test',
  MIDTERM: 'midterm',
  FINAL: 'final',
  ASSIGNMENT: 'assignment',
};

export const PAYMENT_METHODS = {
  MTN: 'mtn',
  ORANGE: 'orange',
  BANK: 'bank',
  CASH: 'cash',
  STRIPE: 'stripe',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
};

export const CLASS_LEVELS = [
  'Form 1',
  'Form 2',
  'Form 3',
  'Form 4',
  'Form 5',
];

export const SECTIONS = {
  GRAMMAR: 'grammar',
  TECHNICAL: 'technical',
};

export const TERMS = ['1', '2', '3'];