/**
 * Advanced Student Records Types
 *
 * Matches docs/system-data-modules/student-data-module.md
 *   §2  — Government Identification
 *   §9  — National Examination Records
 *   §16 — Competitions Participation
 *   §17 — Discipline Records
 *   §18 — Health Records
 *   §21 — Student Transfers
 */

// ═══════════════════════════════════════════════════════
//  1. Government Identification (§2)
// ═══════════════════════════════════════════════════════

export interface StudentGovernmentRecord {
  id: string;
  student_id: string;
  nemis_upi: string | null;
  kemis_upi: string | null;
  birth_certificate_number: string | null;
  huduma_namba: string | null;
  national_id_number: string | null;
  registered_by_school_id: string | null;
  registration_date: string | null;
  verification_status: string;
  last_synced_at: string | null;
}

export interface CreateGovernmentRecordInput {
  nemis_upi?: string | null | undefined;
  kemis_upi?: string | null | undefined;
  birth_certificate_number?: string | null | undefined;
  huduma_namba?: string | null | undefined;
  national_id_number?: string | null | undefined;
  registered_by_school_id?: string | null | undefined;
  registration_date?: string | null | undefined;
  verification_status?: string | undefined; // default 'pending'
}

export type UpdateGovernmentRecordInput = Partial<CreateGovernmentRecordInput>;

// ═══════════════════════════════════════════════════════
//  2. National Examination Records (§9)
// ═══════════════════════════════════════════════════════

export type NationalExamType = 'KCPE' | 'KCSE';

export interface StudentNationalExam {
  id: string;
  student_id: string;
  exam_type: NationalExamType;
  index_number: string;
  registration_year: number;
  exam_center_code: string | null;
  results_status: string;           // 'Pending', 'Released', 'Withheld'
  mean_grade: string | null;
  mean_points: number | null;
  certificate_number: string | null;
}

export interface CreateNationalExamInput {
  exam_type: NationalExamType;
  index_number: string;
  registration_year: number;
  exam_center_code?: string | null | undefined;
  results_status?: string | undefined; // default 'Pending'
  mean_grade?: string | null | undefined;
  mean_points?: number | null | undefined;
  certificate_number?: string | null | undefined;
}

export type UpdateNationalExamInput = Partial<CreateNationalExamInput>;

// ═══════════════════════════════════════════════════════
//  3. Competitions Participation (§16)
// ═══════════════════════════════════════════════════════

export type CompetitionLevel = 'school' | 'county' | 'regional' | 'national';

export interface StudentCompetition {
  id: string;
  student_id: string;
  competition_name: string;
  level: CompetitionLevel;
  position: string | null;
  award: string | null;
}

export interface CreateCompetitionInput {
  competition_name: string;
  level: CompetitionLevel;
  position?: string | null | undefined;
  award?: string | null | undefined;
}

export type UpdateCompetitionInput = Partial<CreateCompetitionInput>;

// ═══════════════════════════════════════════════════════
//  4. Discipline Records (§17)
// ═══════════════════════════════════════════════════════

export interface StudentDisciplineRecord {
  id: string;
  student_id: string;
  incident_type: string;
  description: string;
  reported_by: string | null; // FK to Teacher
  action_taken: string | null;
  suspension_days: number | null;
  incident_date: string;
}

export interface CreateDisciplineRecordInput {
  incident_type: string;
  description: string;
  reported_by?: string | null | undefined;
  action_taken?: string | null | undefined;
  suspension_days?: number | null | undefined;
  incident_date: string;
}

export type UpdateDisciplineRecordInput = Partial<CreateDisciplineRecordInput>;

// ═══════════════════════════════════════════════════════
//  5. Health Records (§18)
// ═══════════════════════════════════════════════════════

export interface StudentHealthRecord {
  id: string;
  student_id: string;
  blood_group: string | null;
  allergies: string | null;
  chronic_conditions: string | null;
  medical_notes: string | null;
  last_checkup_date: string | null;
  nhif_number: string | null;
}

export interface CreateHealthRecordInput {
  blood_group?: string | null | undefined;
  allergies?: string | null | undefined;
  chronic_conditions?: string | null | undefined;
  medical_notes?: string | null | undefined;
  last_checkup_date?: string | null | undefined;
  nhif_number?: string | null | undefined;
}

export type UpdateHealthRecordInput = Partial<CreateHealthRecordInput>;

// ═══════════════════════════════════════════════════════
//  6. Student Transfers (§21)
// ═══════════════════════════════════════════════════════

export interface StudentTransfer {
  id: string;
  student_id: string;
  from_school: string | null;
  to_school: string | null;
  transfer_reason: string | null;
  approval_status: string;        // 'Pending', 'Approved', 'Rejected'
  transfer_date: string | null;
}

export interface CreateTransferInput {
  from_school?: string | null | undefined;
  to_school?: string | null | undefined;
  transfer_reason?: string | null | undefined;
  approval_status?: string | undefined; // default 'Pending'
  transfer_date?: string | null | undefined;
}

export type UpdateTransferInput = Partial<CreateTransferInput>;
