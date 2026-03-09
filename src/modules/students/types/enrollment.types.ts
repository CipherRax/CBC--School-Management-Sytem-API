/**
 * Enrollment Types
 *
 * Matches docs/system-data-modules/student-data-module.md §5
 *
 * Students are enrolled in classes per academic year.
 * Enrollment records are historical — they are never overwritten,
 * allowing the system to answer "which class was student X in during 2023?"
 */

export type ClassLevel = 'Form1' | 'Form2' | 'Form3' | 'Form4';

export type EnrollmentStatus = 'active' | 'transferred' | 'repeated' | 'completed';

export interface StudentEnrollment {
  id: string;
  student_id: string;

  school_id: string | null;          // Multi-tenant (nullable until tenant system is built)

  academic_year: string;             // e.g. '2024', '2025'
  term: string;                      // e.g. 'Term 1', 'Term 2', 'Term 3'

  class_level: ClassLevel;
  stream: string | null;             // e.g. 'A', 'B', 'North', 'West'

  class_teacher_id: string | null;   // FK to teachers

  status: EnrollmentStatus;

  created_at: string;
  updated_at: string;
}

/** Used when enrolling a student for the first time or into a new year */
export interface CreateEnrollmentInput {
  school_id?: string | null | undefined;
  academic_year: string;
  term: string;
  class_level: ClassLevel;
  stream?: string | null | undefined;
  class_teacher_id?: string | null | undefined;
}

/** Used when promoting a student to the next form */
export interface PromoteStudentInput {
  academic_year: string;
  term: string;
  class_level: ClassLevel;
  stream?: string | null;
  class_teacher_id?: string | null;
}

/** Used when transferring a student to another stream or school */
export interface TransferStudentInput {
  to_school?: string | null | undefined;         // If inter-school transfer
  academic_year: string;
  term: string;
  class_level: ClassLevel;
  stream?: string | null | undefined;
  transfer_reason?: string | undefined;
}
