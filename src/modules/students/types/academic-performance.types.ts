/**
 * Academic Performance & Attendance Types
 *
 * Matches docs/system-data-modules/student-data-module.md §8, §10
 *
 * §8 — Student Academic Performance (Grades)
 *   Exam types: CAT | Midterm | Endterm | KCSE
 *
 * §10 — Attendance Tracking
 *   Sessions: morning | afternoon | full_day
 *   Status: present | absent | sick | suspended
 */

// ═══════════════════════════════════════════════════════
//  Student Grade
// ═══════════════════════════════════════════════════════

export type ExamType = 'CAT' | 'Midterm' | 'Endterm' | 'KCSE';

export interface StudentGrade {
  id: string;
  student_id: string;
  subject_id: string;
  exam_id: string | null;           // Nullable if ad-hoc, but usually links to an Exam entity
  exam_type: ExamType;
  score: number;
  grade: string | null;             // e.g. 'A', 'B+'
  points: number | null;            // e.g. 12, 11
  teacher_comment: string | null;
  exam_date: string;
  recorded_at: string;
}

export interface RecordGradeInput {
  subject_id: string;
  exam_id?: string | null | undefined;
  exam_type: ExamType;
  score: number;
  grade?: string | null | undefined;
  points?: number | null | undefined;
  teacher_comment?: string | null | undefined;
  exam_date: string;
}

export type UpdateGradeInput = Partial<RecordGradeInput>;

// ═══════════════════════════════════════════════════════
//  Student Attendance
// ═══════════════════════════════════════════════════════

export type AttendanceSession = 'morning' | 'afternoon' | 'full_day';
export type AttendanceStatus = 'present' | 'absent' | 'sick' | 'suspended';

export interface StudentAttendance {
  id: string;
  student_id: string;
  date: string;
  session: AttendanceSession;
  status: AttendanceStatus;
  remarks: string | null;
  recorded_by_teacher: string | null; // FK to Teacher
  recorded_at: string;
}

export interface RecordAttendanceInput {
  date: string;
  session: AttendanceSession;
  status: AttendanceStatus;
  remarks?: string | null | undefined;
  recorded_by_teacher?: string | null | undefined;
}

export type UpdateAttendanceInput = Partial<RecordAttendanceInput>;
