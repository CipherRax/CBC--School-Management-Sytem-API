-- ============================================================
-- Migration: 007_create_sports_and_creative_activities_tables.sql
-- Domain:    Sports & Creative Arts Activities
-- Source:    docs/system-data-modules/student-data-module.md §14, §15
-- ============================================================
-- ── Sports ──────────────────────────────────────────────
CREATE TYPE sport_type AS ENUM ('team', 'individual');
CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type sport_type NOT NULL
);
-- ── Student Sport Participation ─────────────────────────
CREATE TABLE IF NOT EXISTS student_sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id),
  category sport_type NOT NULL,
  -- team or individual
  position TEXT,
  -- e.g. 'goalkeeper', 'striker', etc.
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  date_left DATE,
  coach_id UUID,
  -- FK to teachers (added later)
  UNIQUE(student_id, sport_id)
);
CREATE INDEX idx_student_sports_student_id ON student_sports(student_id);
-- ── Creative Activities ─────────────────────────────────
CREATE TYPE competition_level AS ENUM ('school', 'county', 'regional', 'national');
CREATE TABLE IF NOT EXISTS student_creative_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  -- e.g. 'Drama', 'Music', 'Choir', 'Dance', 'Poetry', 'Film', 'Art'
  competition_level competition_level,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX idx_student_creative_student_id ON student_creative_activities(student_id);