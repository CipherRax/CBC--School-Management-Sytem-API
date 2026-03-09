/**
 * Department Types
 *
 * Matches docs/system-architecture/student-domain-architecture.md
 * and docs/system-data-modules/student-data-module.md §6
 *
 * Departments organize subjects and teachers.
 * Core Kenyan departments: Mathematics, Languages, Sciences,
 * Humanities, Technical, Business, Guidance & Counseling, etc.
 */

export interface Department {
  id: string;
  name: string;
  description: string | null;
  head_of_department: string | null;   // FK to teachers (future)
  created_at: string;
}

export interface CreateDepartmentInput {
  name: string;
  description?: string | null | undefined;
  head_of_department?: string | null | undefined;
}

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

// ── Student Department Membership ───────────────────────

export type DepartmentRole = 'member' | 'representative' | 'assistant' | 'leader';

export interface StudentDepartment {
  id: string;
  student_id: string;
  department_id: string;
  role: DepartmentRole;
  date_joined: string;
  date_left: string | null;
}

export interface CreateStudentDepartmentInput {
  department_id: string;
  role?: DepartmentRole | undefined;
}
