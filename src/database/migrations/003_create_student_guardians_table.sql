-- ============================================================
-- Migration: 003_create_student_guardians_table.sql
-- Domain:    Student Guardian Relationship
-- Source:    docs/system-data-modules/student-data-module.md §3
-- ============================================================
-- Guardian type enum
CREATE TYPE guardian_type AS ENUM ('father', 'mother', 'guardian', 'sponsor');
CREATE TABLE IF NOT EXISTS student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_type guardian_type NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  alternative_phone TEXT,
  email TEXT,
  national_id TEXT,
  occupation TEXT,
  employer TEXT,
  relationship_to_student TEXT,
  is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
  is_fee_payer BOOLEAN NOT NULL DEFAULT FALSE,
  address_id UUID REFERENCES student_addresses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_student_guardians_student_id ON student_guardians(student_id);
CREATE INDEX idx_student_guardians_phone ON student_guardians(phone_number);