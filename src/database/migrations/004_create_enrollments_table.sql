-- ============================================================
-- Migration: 004_create_enrollments_table.sql
-- Domain:    Student Academic Enrollment
-- Source:    docs/system-data-modules/student-data-module.md §5
-- ============================================================
-- Class level enum (Kenyan secondary school)
CREATE TYPE class_level AS ENUM ('Form1', 'Form2', 'Form3', 'Form4');
-- Enrollment status enum
CREATE TYPE enrollment_status AS ENUM ('active', 'transferred', 'repeated', 'completed');
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID,
  -- For multi-tenant (nullable until tenant system is built)
  academic_year TEXT NOT NULL,
  -- e.g. '2024', '2025'
  term TEXT NOT NULL,
  -- e.g. 'Term 1', 'Term 2', 'Term 3'
  class_level class_level NOT NULL,
  stream TEXT,
  -- e.g. 'A', 'B', 'North', 'West'
  class_teacher_id UUID,
  -- FK to teachers (added later)
  status enrollment_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_academic_year ON student_enrollments(academic_year);
CREATE INDEX idx_student_enrollments_class_level ON student_enrollments(class_level);
-- ── Auto-update trigger ─────────────────────────────────
CREATE TRIGGER trg_student_enrollments_updated_at BEFORE
UPDATE ON student_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();