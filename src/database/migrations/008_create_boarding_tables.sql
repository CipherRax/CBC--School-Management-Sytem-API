-- ============================================================
-- Migration: 008_create_boarding_tables.sql
-- Domain:    Boarding & Dormitory System
-- Source:    docs/system-data-modules/student-data-module.md §11
--            docs/system-architecture/student-domain-architecture.md
-- ============================================================
-- ── Dormitories ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dormitories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  house_master UUID,
  -- FK to teachers (added later)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Student Boarding Assignment ─────────────────────────
CREATE TYPE boarding_status AS ENUM ('active', 'moved', 'completed');
CREATE TABLE IF NOT EXISTS student_boarding_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  house_id UUID,
  -- For house-based competitions (optional)
  dormitory_id UUID NOT NULL REFERENCES dormitories(id),
  bed_number TEXT,
  date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
  date_released DATE,
  status boarding_status NOT NULL DEFAULT 'active'
);
CREATE INDEX idx_student_boarding_student_id ON student_boarding_assignments(student_id);
CREATE INDEX idx_student_boarding_dormitory_id ON student_boarding_assignments(dormitory_id);