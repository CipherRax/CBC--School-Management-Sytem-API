# Database Migrations

This folder contains SQL migration files for the EduCore backend.

## How to Run

These migrations should be run **in order** against your Supabase project via the Supabase SQL Editor or CLI.

```
001_create_students_table.sql           — Core student identity + enums + trigger
002_create_student_addresses_table.sql  — Student address (Kenyan geography)
003_create_student_guardians_table.sql  — Student guardians
004_create_enrollments_table.sql        — Academic enrollment (Form1–4)
005_create_departments_and_subjects_tables.sql — Departments, subjects, student linkage
006_create_leadership_and_clubs_tables.sql     — Prefect roles, clubs, memberships
007_create_sports_and_creative_activities_tables.sql — Sports, creative activities
008_create_boarding_tables.sql          — Dormitories, boarding assignments
009_create_academic_performance_tables.sql     — Grades, attendance, national exams
010_create_advanced_student_tables.sql  — Govt records, discipline, health, competitions, transfers, fees, schedules
```

## Important

- Run `001` first — it creates the `update_updated_at_column()` trigger function reused by later migrations.
- Migrations are **idempotent** (`CREATE TABLE IF NOT EXISTS`) — safe to re-run.
- All foreign keys to `students(id)` use `ON DELETE CASCADE`.
