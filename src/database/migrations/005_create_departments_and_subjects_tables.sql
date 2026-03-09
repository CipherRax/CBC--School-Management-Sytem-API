-- ============================================================
-- Migration: 005_create_departments_and_subjects_tables.sql
-- Domain:    Academic Departments & Subjects
-- Source:    docs/system-data-modules/student-data-module.md §6, §7
--            docs/system-architecture/student-domain-architecture.md
-- ============================================================
-- ── Departments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  head_of_department UUID,
  -- FK to teachers (added later)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Subjects ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  subject_code TEXT UNIQUE,
  is_compulsory BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_subjects_department_id ON subjects(department_id);
-- ── Student Subject Enrollment ──────────────────────────
-- Subject enrollment status
CREATE TYPE subject_enrollment_status AS ENUM ('active', 'dropped', 'completed');
CREATE TABLE IF NOT EXISTS student_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  is_compulsory BOOLEAN NOT NULL DEFAULT FALSE,
  subject_category TEXT,
  -- e.g. 'COMPULSORY', 'SCIENCES', 'HUMANITIES', 'BUSINESS', 'TECHNICAL'
  teacher_id UUID,
  -- FK to teachers (added later)
  date_registered DATE NOT NULL DEFAULT CURRENT_DATE,
  status subject_enrollment_status NOT NULL DEFAULT 'active',
  UNIQUE(student_id, subject_id) -- A student can only be enrolled in a subject once
);
CREATE INDEX idx_student_subjects_student_id ON student_subjects(student_id);
CREATE INDEX idx_student_subjects_subject_id ON student_subjects(subject_id);
-- ── Student Department Membership ───────────────────────
CREATE TYPE department_role AS ENUM (
  'member',
  'representative',
  'assistant',
  'leader'
);
CREATE TABLE IF NOT EXISTS student_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id),
  role department_role NOT NULL DEFAULT 'member',
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  date_left DATE,
  UNIQUE(student_id, department_id)
);
CREATE INDEX idx_student_departments_student_id ON student_departments(student_id);
CREATE INDEX idx_student_departments_department_id ON student_departments(department_id);