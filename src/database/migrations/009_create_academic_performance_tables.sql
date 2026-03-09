-- ============================================================
-- Migration: 009_create_academic_performance_tables.sql
-- Domain:    Grades, Attendance, National Exams
-- Source:    docs/system-data-modules/student-data-module.md §8, §9, §10
-- ============================================================
-- ── Student Grades / Academic Performance ───────────────
CREATE TYPE exam_type AS ENUM ('CAT', 'Midterm', 'Endterm', 'KCSE');
CREATE TABLE IF NOT EXISTS student_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  exam_id UUID,
  -- FK to exams table (future module)
  exam_type exam_type NOT NULL,
  score DECIMAL(5, 2),
  grade TEXT,
  -- e.g. 'A', 'B+', 'C-'
  points INTEGER,
  teacher_comment TEXT,
  exam_date DATE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_student_grades_student_id ON student_grades(student_id);
CREATE INDEX idx_student_grades_subject_id ON student_grades(subject_id);
-- ── Student Attendance ──────────────────────────────────
CREATE TYPE attendance_session AS ENUM ('morning', 'afternoon', 'full_day');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'sick', 'suspended');
CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session attendance_session NOT NULL,
  status attendance_status NOT NULL,
  remarks TEXT,
  recorded_by_teacher UUID,
  -- FK to teachers (added later)
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
-- ── National Examination Records ────────────────────────
CREATE TYPE national_exam_type AS ENUM ('KCPE', 'KCSE');
CREATE TABLE IF NOT EXISTS student_national_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_type national_exam_type NOT NULL,
  index_number TEXT NOT NULL,
  registration_year INTEGER NOT NULL,
  exam_center_code TEXT,
  results_status TEXT,
  -- e.g. 'pending', 'released'
  mean_grade TEXT,
  mean_points DECIMAL(4, 2),
  certificate_number TEXT
);
CREATE INDEX idx_student_national_exams_student_id ON student_national_exams(student_id);