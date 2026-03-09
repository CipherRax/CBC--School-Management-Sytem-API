/**
 * Academic Performance & Attendance Repository
 *
 * Supabase data-access for:
 *   - student_grades
 *   - student_attendance
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentGrade,
  RecordGradeInput,
  UpdateGradeInput,
  StudentAttendance,
  RecordAttendanceInput,
  UpdateAttendanceInput,
} from '../types/academic-performance.types.js';

// ═══════════════════════════════════════════════════════
//  Student Grade Repository
// ═══════════════════════════════════════════════════════

export class StudentGradeRepository {
  constructor(private supabase: SupabaseClient) {}

  async recordGrade(studentId: string, data: RecordGradeInput): Promise<StudentGrade> {
    const payload = {
      student_id: studentId,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_grades')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to record grade: ${error.message}`);
    return row as StudentGrade;
  }

  async findByStudentId(studentId: string): Promise<StudentGrade[]> {
    const { data, error } = await this.supabase
      .from('student_grades')
      .select('*')
      .eq('student_id', studentId)
      .order('exam_date', { ascending: false });

    if (error) throw new Error(`Failed to list student grades: ${error.message}`);
    return (data ?? []) as StudentGrade[];
  }

  async findById(id: string): Promise<StudentGrade | null> {
    const { data, error } = await this.supabase
      .from('student_grades')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get grade: ${error.message}`);
    return data as StudentGrade;
  }

  async update(id: string, data: UpdateGradeInput): Promise<StudentGrade> {
    const { data: updated, error } = await this.supabase
      .from('student_grades')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update grade: ${error.message}`);
    return updated as StudentGrade;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_grades')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete grade: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Attendance Repository
// ═══════════════════════════════════════════════════════

export class StudentAttendanceRepository {
  constructor(private supabase: SupabaseClient) {}

  async recordAttendance(studentId: string, data: RecordAttendanceInput): Promise<StudentAttendance> {
    const payload = {
      student_id: studentId,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_attendance')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to record attendance: ${error.message}`);
    return row as StudentAttendance;
  }

  async findByStudentId(studentId: string): Promise<StudentAttendance[]> {
    const { data, error } = await this.supabase
      .from('student_attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to list student attendance: ${error.message}`);
    return (data ?? []) as StudentAttendance[];
  }

  async findById(id: string): Promise<StudentAttendance | null> {
    const { data, error } = await this.supabase
      .from('student_attendance')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get attendance record: ${error.message}`);
    return data as StudentAttendance;
  }

  async update(id: string, data: UpdateAttendanceInput): Promise<StudentAttendance> {
    const { data: updated, error } = await this.supabase
      .from('student_attendance')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update attendance record: ${error.message}`);
    return updated as StudentAttendance;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_attendance')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete attendance record: ${error.message}`);
  }
}
