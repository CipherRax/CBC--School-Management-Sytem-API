-- ============================================================
-- Migration: 002_create_student_addresses_table.sql
-- Domain:    Student Address
-- Source:    docs/system-data-modules/student-data-module.md §4
-- ============================================================
CREATE TABLE IF NOT EXISTS student_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  -- Kenyan address hierarchy
  country TEXT NOT NULL DEFAULT 'Kenya',
  county TEXT,
  sub_county TEXT,
  ward TEXT,
  location TEXT,
  village TEXT,
  -- Postal
  postal_address TEXT,
  postal_code TEXT,
  -- GPS coordinates
  gps_lat DECIMAL(10, 7),
  gps_lng DECIMAL(10, 7),
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_student_addresses_student_id ON student_addresses(student_id);
-- ── Auto-update trigger ─────────────────────────────────
CREATE TRIGGER trg_student_addresses_updated_at BEFORE
UPDATE ON student_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();