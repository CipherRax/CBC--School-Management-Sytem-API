-- ============================================================
-- Migration: 010_create_advanced_student_tables.sql
-- Domain:    Discipline, Health, Competitions, Transfers,
--            Government Records, Fees, Schedules
-- Source:    docs/system-data-modules/student-data-module.md §2, §16–§21
-- ============================================================
-- ── Government Identification Records ───────────────────
-- §2 — StudentGovernmentRecord
CREATE TABLE IF NOT EXISTS student_government_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  nemis_upi TEXT,
  kemis_upi TEXT,
  birth_certificate_number TEXT,
  huduma_namba TEXT,
  national_id_number TEXT,
  registered_by_school_id UUID,
  registration_date DATE,
  verification_status TEXT,
  -- e.g. 'pending', 'verified', 'rejected'
  last_synced_at TIMESTAMPTZ
);
CREATE INDEX idx_student_govt_records_student_id ON student_government_records(student_id);
-- ── Discipline Records ──────────────────────────────────
-- §17 — StudentDisciplineRecord
CREATE TABLE IF NOT EXISTS student_discipline_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  reported_by UUID,
  -- FK to users/teachers
  action_taken TEXT,
  suspension_days INTEGER DEFAULT 0,
  incident_date DATE NOT NULL
);
CREATE INDEX idx_student_discipline_student_id ON student_discipline_records(student_id);
-- ── Health Records ──────────────────────────────────────
-- §18 — StudentHealthRecord
CREATE TABLE IF NOT EXISTS student_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  blood_group TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  medical_notes TEXT,
  last_checkup_date DATE,
  nhif_number TEXT
);
-- ── Competition Participation ───────────────────────────
-- §16 — StudentCompetition
CREATE TABLE IF NOT EXISTS student_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  competition_name TEXT NOT NULL,
  -- e.g. 'Science Congress', 'Drama Festival'
  level competition_level NOT NULL,
  -- Reuses enum from migration 007
  position TEXT,
  award TEXT
);
CREATE INDEX idx_student_competitions_student_id ON student_competitions(student_id);
-- ── Student Transfers ───────────────────────────────────
-- §21 — StudentTransfer
CREATE TABLE IF NOT EXISTS student_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  from_school TEXT NOT NULL,
  to_school TEXT NOT NULL,
  transfer_reason TEXT,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  -- e.g. 'pending', 'approved', 'rejected'
  transfer_date DATE NOT NULL
);
CREATE INDEX idx_student_transfers_student_id ON student_transfers(student_id);
-- ── Student Fee Account ─────────────────────────────────
-- §19 — StudentFeeAccount
CREATE TYPE fee_sponsor AS ENUM ('government', 'parent', 'scholarship');
CREATE TABLE IF NOT EXISTS student_fee_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  total_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(12, 2) NOT NULL DEFAULT 0,
  balance DECIMAL(12, 2) GENERATED ALWAYS AS (total_fee - amount_paid) STORED,
  sponsor fee_sponsor,
  last_payment_date DATE
);
CREATE INDEX idx_student_fee_accounts_student_id ON student_fee_accounts(student_id);
-- ── Student Daily Schedule ──────────────────────────────
-- §20 — StudentSchedule
CREATE TABLE IF NOT EXISTS student_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  -- e.g. 'Monday', 'Tuesday'
  time_slot TEXT NOT NULL,
  -- e.g. '08:00-09:00'
  activity_type TEXT NOT NULL,
  -- e.g. 'Class', 'Prep', 'Games', 'Clubs', 'Meal', 'Assembly'
  location TEXT
);
CREATE INDEX idx_student_schedules_student_id ON student_schedules(student_id);