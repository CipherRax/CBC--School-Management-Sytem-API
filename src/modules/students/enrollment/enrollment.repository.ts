/**
 * Enrollment Repository
 *
 * Supabase data-access for the `student_enrollments` table.
 *
 * Enrollment records are append-only and historical.
 * A student's current enrollment is the latest record with status = 'active'.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentEnrollment,
  CreateEnrollmentInput,
  EnrollmentStatus,
} from '../types/enrollment.types.js';

const TABLE = 'student_enrollments';

export class EnrollmentRepository {
  constructor(private supabase: SupabaseClient) {}

  // ── CREATE ────────────────────────────────────────────

  async create(studentId: string, data: CreateEnrollmentInput): Promise<StudentEnrollment> {
    const payload = {
      student_id: studentId,
      status: 'active' as EnrollmentStatus,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create enrollment: ${error.message}`);
    return row as StudentEnrollment;
  }

  // ── READ — all enrollments for a student (history) ────

  async findByStudentId(studentId: string): Promise<StudentEnrollment[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list enrollments: ${error.message}`);
    return (data ?? []) as StudentEnrollment[];
  }

  // ── READ — current active enrollment ──────────────────

  async findActiveEnrollment(studentId: string): Promise<StudentEnrollment | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get active enrollment: ${error.message}`);
    return data as StudentEnrollment;
  }

  // ── UPDATE — change status of an enrollment ───────────

  async updateStatus(id: string, status: EnrollmentStatus): Promise<StudentEnrollment> {
    const { data: updated, error } = await this.supabase
      .from(TABLE)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update enrollment status: ${error.message}`);
    return updated as StudentEnrollment;
  }
}
