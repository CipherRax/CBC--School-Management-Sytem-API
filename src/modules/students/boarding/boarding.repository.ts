/**
 * Boarding & Dormitory Repository
 *
 * Supabase data-access for:
 *   - dormitories (shared entities)
 *   - student_boarding_assignments (student ↔ dormitory)
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Dormitory,
  CreateDormitoryInput,
  UpdateDormitoryInput,
  StudentBoardingAssignment,
  AssignBoardingInput,
  UpdateBoardingInput,
} from '../types/boarding.types.js';

// ═══════════════════════════════════════════════════════
//  Dormitory Repository
// ═══════════════════════════════════════════════════════

export class DormitoryRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: CreateDormitoryInput): Promise<Dormitory> {
    const { data: row, error } = await this.supabase
      .from('dormitories')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create dormitory: ${error.message}`);
    return row as Dormitory;
  }

  async findAll(): Promise<Dormitory[]> {
    const { data, error } = await this.supabase
      .from('dormitories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list dormitories: ${error.message}`);
    return (data ?? []) as Dormitory[];
  }

  async findById(id: string): Promise<Dormitory | null> {
    const { data, error } = await this.supabase
      .from('dormitories')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get dormitory: ${error.message}`);
    return data as Dormitory;
  }

  async update(id: string, data: UpdateDormitoryInput): Promise<Dormitory> {
    const { data: updated, error } = await this.supabase
      .from('dormitories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update dormitory: ${error.message}`);
    return updated as Dormitory;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('dormitories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete dormitory: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Boarding Assignment Repository
// ═══════════════════════════════════════════════════════

export class StudentBoardingRepository {
  constructor(private supabase: SupabaseClient) {}

  async assign(studentId: string, data: AssignBoardingInput): Promise<StudentBoardingAssignment> {
    const payload = {
      student_id: studentId,
      status: 'active' as const,
      date_assigned: data.date_assigned ?? new Date().toISOString().split('T')[0],
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_boarding_assignments')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to assign boarding: ${error.message}`);
    return row as StudentBoardingAssignment;
  }

  async findByStudentId(studentId: string): Promise<StudentBoardingAssignment[]> {
    const { data, error } = await this.supabase
      .from('student_boarding_assignments')
      .select('*')
      .eq('student_id', studentId)
      .order('date_assigned', { ascending: false });

    if (error) throw new Error(`Failed to list boarding assignments: ${error.message}`);
    return (data ?? []) as StudentBoardingAssignment[];
  }

  async findCurrentByStudentId(studentId: string): Promise<StudentBoardingAssignment | null> {
    const { data, error } = await this.supabase
      .from('student_boarding_assignments')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get current boarding: ${error.message}`);
    return data as StudentBoardingAssignment;
  }

  async findById(id: string): Promise<StudentBoardingAssignment | null> {
    const { data, error } = await this.supabase
      .from('student_boarding_assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get boarding assignment: ${error.message}`);
    return data as StudentBoardingAssignment;
  }

  async update(id: string, data: UpdateBoardingInput): Promise<StudentBoardingAssignment> {
    const { data: updated, error } = await this.supabase
      .from('student_boarding_assignments')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update boarding assignment: ${error.message}`);
    return updated as StudentBoardingAssignment;
  }
}
