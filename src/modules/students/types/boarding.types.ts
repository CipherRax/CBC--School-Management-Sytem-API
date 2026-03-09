/**
 * Boarding & Dormitory Types
 *
 * Matches docs/system-data-modules/student-data-module.md §11
 *
 * §11 — Boarding & Dormitory System
 *   Dormitory entity (shared resource) + student boarding assignment
 */

// ═══════════════════════════════════════════════════════
//  Dormitory Entity
// ═══════════════════════════════════════════════════════

export interface Dormitory {
  id: string;
  name: string;
  capacity: number | null;
  house_master: string | null;       // FK to teachers (future)
  created_at: string;
}

export interface CreateDormitoryInput {
  name: string;
  capacity?: number | null | undefined;
  house_master?: string | null | undefined;
}

export type UpdateDormitoryInput = Partial<CreateDormitoryInput>;

// ═══════════════════════════════════════════════════════
//  Student Boarding Assignment
// ═══════════════════════════════════════════════════════

export type BoardingStatus = 'active' | 'moved' | 'completed';

export interface StudentBoardingAssignment {
  id: string;
  student_id: string;
  house_id: string | null;
  dormitory_id: string;
  bed_number: string | null;
  date_assigned: string;
  date_released: string | null;
  status: BoardingStatus;
}

export interface AssignBoardingInput {
  dormitory_id: string;
  house_id?: string | null | undefined;
  bed_number?: string | null | undefined;
  date_assigned?: string | undefined;
}

export interface UpdateBoardingInput {
  dormitory_id?: string | undefined;
  house_id?: string | null | undefined;
  bed_number?: string | null | undefined;
  date_released?: string | null | undefined;
  status?: BoardingStatus | undefined;
}
