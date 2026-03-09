/**
 * Student Guardian Repository
 *
 * Supabase data-access for the `student_guardians` table.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentGuardian,
  CreateGuardianInput,
  UpdateGuardianInput,
} from '../types/student-guardian.types.js';

const TABLE = 'student_guardians';

export class StudentGuardianRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(studentId: string, data: CreateGuardianInput): Promise<StudentGuardian> {
    const payload = {
      student_id: studentId,
      is_primary_contact: data.is_primary_contact ?? false,
      is_fee_payer: data.is_fee_payer ?? false,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create guardian: ${error.message}`);
    return row as StudentGuardian;
  }

  async findByStudentId(studentId: string): Promise<StudentGuardian[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('student_id', studentId)
      .order('is_primary_contact', { ascending: false });

    if (error) throw new Error(`Failed to list guardians: ${error.message}`);
    return (data ?? []) as StudentGuardian[];
  }

  async findById(id: string): Promise<StudentGuardian | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get guardian: ${error.message}`);
    return data as StudentGuardian;
  }

  async update(id: string, data: UpdateGuardianInput): Promise<StudentGuardian> {
    const { data: updated, error } = await this.supabase
      .from(TABLE)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update guardian: ${error.message}`);
    return updated as StudentGuardian;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete guardian: ${error.message}`);
  }
}
