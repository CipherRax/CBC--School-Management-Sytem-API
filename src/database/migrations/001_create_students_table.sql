-- ============================================================
-- Migration: 001_create_students_table.sql
-- Domain:    Student Core Identity
-- Source:    docs/system-data-modules/student-data-module.md §1
-- ============================================================
-- Status enum
CREATE TYPE student_status AS ENUM (
  'active',
  'transferred',
  'suspended',
  'graduated',
  'withdrawn',
  'deceased'
);
-- Gender enum
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
-- ── Core Students Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Government / School IDs
  upn TEXT,
  -- Unique Pupil Number / NEMIS number
  admission_number TEXT NOT NULL UNIQUE,
  -- School-assigned admission number
  kcpe_index_number TEXT,
  -- KCPE exam index
  kcse_index_number TEXT,
  -- KCSE exam index
  -- Personal Info
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender NOT NULL,
  nationality TEXT NOT NULL DEFAULT 'Kenyan',
  birth_certificate_number TEXT,
  national_id_number TEXT,
  -- Optional for minors
  passport_number TEXT,
  -- Optional
  -- Additional Profile
  religion TEXT,
  special_needs_flag BOOLEAN NOT NULL DEFAULT FALSE,
  disability_type TEXT,
  profile_photo_url TEXT,
  -- Lifecycle
  status student_status NOT NULL DEFAULT 'active',
  date_admitted DATE NOT NULL,
  date_graduated DATE,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_name ON students(last_name, first_name);
CREATE INDEX idx_students_upn ON students(upn)
WHERE upn IS NOT NULL;
-- ── Auto-update updated_at trigger ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_students_updated_at BEFORE
UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();