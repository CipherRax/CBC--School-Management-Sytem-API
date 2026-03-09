/**
 * Department & Subject Repository
 *
 * Supabase data-access for:
 *   - departments
 *   - subjects
 *   - student_subjects (student ↔ subject enrollment)
 *   - student_departments (student ↔ department membership)
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  StudentDepartment,
  CreateStudentDepartmentInput,
} from '../types/department.types.js';
import type {
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
  StudentSubject,
  CreateStudentSubjectInput,
} from '../types/subject.types.js';

// ═══════════════════════════════════════════════════════
//  Department Repository
// ═══════════════════════════════════════════════════════

export class DepartmentRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: CreateDepartmentInput): Promise<Department> {
    const { data: row, error } = await this.supabase
      .from('departments')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create department: ${error.message}`);
    return row as Department;
  }

  async findAll(): Promise<Department[]> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list departments: ${error.message}`);
    return (data ?? []) as Department[];
  }

  async findById(id: string): Promise<Department | null> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get department: ${error.message}`);
    return data as Department;
  }

  async update(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const { data: updated, error } = await this.supabase
      .from('departments')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update department: ${error.message}`);
    return updated as Department;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete department: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Subject Repository
// ═══════════════════════════════════════════════════════

export class SubjectRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: CreateSubjectInput): Promise<Subject> {
    const payload = {
      is_compulsory: data.is_compulsory ?? false,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('subjects')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create subject: ${error.message}`);
    return row as Subject;
  }

  async findAll(): Promise<Subject[]> {
    const { data, error } = await this.supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list subjects: ${error.message}`);
    return (data ?? []) as Subject[];
  }

  async findById(id: string): Promise<Subject | null> {
    const { data, error } = await this.supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get subject: ${error.message}`);
    return data as Subject;
  }

  async findByDepartment(departmentId: string): Promise<Subject[]> {
    const { data, error } = await this.supabase
      .from('subjects')
      .select('*')
      .eq('department_id', departmentId)
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list subjects by department: ${error.message}`);
    return (data ?? []) as Subject[];
  }

  async update(id: string, data: UpdateSubjectInput): Promise<Subject> {
    const { data: updated, error } = await this.supabase
      .from('subjects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update subject: ${error.message}`);
    return updated as Subject;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete subject: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Subject Repository
// ═══════════════════════════════════════════════════════

export class StudentSubjectRepository {
  constructor(private supabase: SupabaseClient) {}

  async enroll(studentId: string, data: CreateStudentSubjectInput): Promise<StudentSubject> {
    const payload = {
      student_id: studentId,
      is_compulsory: data.is_compulsory ?? false,
      status: 'active' as const,
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_subjects')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to enroll student in subject: ${error.message}`);
    return row as StudentSubject;
  }

  async findByStudentId(studentId: string): Promise<StudentSubject[]> {
    const { data, error } = await this.supabase
      .from('student_subjects')
      .select('*')
      .eq('student_id', studentId)
      .order('date_registered', { ascending: false });

    if (error) throw new Error(`Failed to list student subjects: ${error.message}`);
    return (data ?? []) as StudentSubject[];
  }

  async drop(studentId: string, subjectId: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_subjects')
      .update({ status: 'dropped' })
      .eq('student_id', studentId)
      .eq('subject_id', subjectId);

    if (error) throw new Error(`Failed to drop subject: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Department Repository
// ═══════════════════════════════════════════════════════

export class StudentDepartmentRepository {
  constructor(private supabase: SupabaseClient) {}

  async join(studentId: string, data: CreateStudentDepartmentInput): Promise<StudentDepartment> {
    const payload = {
      student_id: studentId,
      role: data.role ?? 'member',
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_departments')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to join department: ${error.message}`);
    return row as StudentDepartment;
  }

  async findByStudentId(studentId: string): Promise<StudentDepartment[]> {
    const { data, error } = await this.supabase
      .from('student_departments')
      .select('*')
      .eq('student_id', studentId)
      .order('date_joined', { ascending: false });

    if (error) throw new Error(`Failed to list student departments: ${error.message}`);
    return (data ?? []) as StudentDepartment[];
  }

  async leave(studentId: string, departmentId: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_departments')
      .update({ date_left: new Date().toISOString().split('T')[0] })
      .eq('student_id', studentId)
      .eq('department_id', departmentId);

    if (error) throw new Error(`Failed to leave department: ${error.message}`);
  }
}
