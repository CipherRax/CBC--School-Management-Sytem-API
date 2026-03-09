/**
 * Student Domain Types
 *
 * Matches the Student Data Model from:
 * docs/system-data-modules/student-data-module.md — Section 1 (Core Student Identity)
 */

// ── Status Enums ────────────────────────────────────────

export type StudentStatus =
  | 'active'
  | 'transferred'
  | 'suspended'
  | 'graduated'
  | 'withdrawn'
  | 'deceased';

export type Gender = 'male' | 'female' | 'other';

// ── Core Student Entity ─────────────────────────────────

export interface Student {
  id: string;                          // UUID — primary key
  upn: string | null;                  // Unique Pupil Number / NEMIS number
  admission_number: string;            // School-assigned admission number
  kcpe_index_number: string | null;    // KCPE exam index
  kcse_index_number: string | null;    // KCSE exam index

  first_name: string;
  middle_name: string | null;
  last_name: string;

  date_of_birth: string;               // ISO date string
  gender: Gender;

  nationality: string;
  birth_certificate_number: string | null;
  national_id_number: string | null;   // Optional for minors
  passport_number: string | null;      // Optional

  religion: string | null;
  special_needs_flag: boolean;
  disability_type: string | null;

  profile_photo_url: string | null;

  status: StudentStatus;

  date_admitted: string;               // ISO date string
  date_graduated: string | null;       // ISO date string, null if not yet graduated

  created_at: string;                  // ISO timestamp
  updated_at: string;                  // ISO timestamp
}

// ── DTOs ────────────────────────────────────────────────

/** Fields required when admitting (creating) a new student */
export interface CreateStudentInput {
  upn?: string | null;
  admission_number: string;
  kcpe_index_number?: string | null;

  first_name: string;
  middle_name?: string | null;
  last_name: string;

  date_of_birth: string;
  gender: Gender;

  nationality: string;
  birth_certificate_number?: string | null;
  national_id_number?: string | null;
  passport_number?: string | null;

  religion?: string | null;
  special_needs_flag?: boolean;
  disability_type?: string | null;

  profile_photo_url?: string | null;

  date_admitted: string;
}

/** Fields that can be updated on an existing student */
export interface UpdateStudentInput {
  upn?: string | null;
  admission_number?: string;
  kcpe_index_number?: string | null;
  kcse_index_number?: string | null;

  first_name?: string;
  middle_name?: string | null;
  last_name?: string;

  date_of_birth?: string;
  gender?: Gender;

  nationality?: string;
  birth_certificate_number?: string | null;
  national_id_number?: string | null;
  passport_number?: string | null;

  religion?: string | null;
  special_needs_flag?: boolean;
  disability_type?: string | null;

  profile_photo_url?: string | null;

  status?: StudentStatus;

  date_admitted?: string;
  date_graduated?: string | null;
}

// ── Query / Pagination ──────────────────────────────────

export interface StudentFilters {
  status?: StudentStatus;
  gender?: Gender;
  nationality?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
