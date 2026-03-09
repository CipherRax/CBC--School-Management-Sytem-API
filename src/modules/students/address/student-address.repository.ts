/**
 * Student Address Repository
 *
 * Supabase data-access for the `student_addresses` table.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentAddress,
  CreateStudentAddressInput,
  UpdateStudentAddressInput,
} from '../types/student-address.types.js';

const TABLE = 'student_addresses';

export class StudentAddressRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(studentId: string, data: CreateStudentAddressInput): Promise<StudentAddress> {
    const payload = {
      student_id: studentId,
      country: data.country ?? 'Kenya',
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create address: ${error.message}`);
    return row as StudentAddress;
  }

  async findByStudentId(studentId: string): Promise<StudentAddress | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get address: ${error.message}`);
    return data as StudentAddress;
  }

  async update(studentId: string, data: UpdateStudentAddressInput): Promise<StudentAddress> {
    const { data: updated, error } = await this.supabase
      .from(TABLE)
      .update(data)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update address: ${error.message}`);
    return updated as StudentAddress;
  }
}
