/**
 * Subject Types
 *
 * Matches docs/system-data-modules/student-data-module.md §7
 *
 * Students study 7–9 subjects in secondary school.
 * Subjects belong to departments and have categories:
 * COMPULSORY, SCIENCES, HUMANITIES, BUSINESS, TECHNICAL.
 */

export interface Subject {
  id: string;
  name: string;
  department_id: string | null;
  subject_code: string | null;
  is_compulsory: boolean;
  created_at: string;
}

export interface CreateSubjectInput {
  name: string;
  department_id?: string | null | undefined;
  subject_code?: string | null | undefined;
  is_compulsory?: boolean | undefined;
}

export type UpdateSubjectInput = Partial<CreateSubjectInput>;

// ── Student Subject Enrollment ──────────────────────────

export type SubjectEnrollmentStatus = 'active' | 'dropped' | 'completed';

export type SubjectCategory =
  | 'COMPULSORY'
  | 'SCIENCES'
  | 'HUMANITIES'
  | 'BUSINESS'
  | 'TECHNICAL';

export interface StudentSubject {
  id: string;
  student_id: string;
  subject_id: string;
  is_compulsory: boolean;
  subject_category: SubjectCategory | null;
  teacher_id: string | null;
  date_registered: string;
  status: SubjectEnrollmentStatus;
}

export interface CreateStudentSubjectInput {
  subject_id: string;
  is_compulsory?: boolean | undefined;
  subject_category?: SubjectCategory | null | undefined;
  teacher_id?: string | null | undefined;
}
