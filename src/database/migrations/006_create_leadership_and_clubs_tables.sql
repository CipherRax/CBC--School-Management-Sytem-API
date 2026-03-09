-- ============================================================
-- Migration: 006_create_leadership_and_clubs_tables.sql
-- Domain:    Student Leadership (Prefects) & Clubs/Societies
-- Source:    docs/system-data-modules/student-data-module.md §12, §13
-- ============================================================
-- ── Student Leadership Roles (Prefects) ─────────────────
CREATE TYPE leadership_status AS ENUM ('active', 'completed');
CREATE TABLE IF NOT EXISTS student_leadership_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  -- e.g. 'Head Boy', 'Class Prefect', 'Games Captain'
  department_id UUID REFERENCES departments(id),
  date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
  date_ended DATE,
  status leadership_status NOT NULL DEFAULT 'active'
);
CREATE INDEX idx_student_leadership_student_id ON student_leadership_roles(student_id);
-- ── Clubs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  -- e.g. 'Academic', 'Social', 'Religious', 'Community', 'Special Interest'
  teacher_patron UUID,
  -- FK to teachers (added later)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Student Club Membership ─────────────────────────────
CREATE TYPE club_membership_role AS ENUM (
  'member',
  'secretary',
  'chairperson',
  'treasurer'
);
CREATE TABLE IF NOT EXISTS student_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id),
  role club_membership_role NOT NULL DEFAULT 'member',
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  date_left DATE,
  UNIQUE(student_id, club_id)
);
CREATE INDEX idx_student_clubs_student_id ON student_clubs(student_id);
CREATE INDEX idx_student_clubs_club_id ON student_clubs(club_id);