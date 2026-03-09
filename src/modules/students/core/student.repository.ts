/**
 * Student Repository
 *
 * Data-access layer for the `students` table via Supabase.
 * All database operations are isolated here — the service layer
 * never touches Supabase directly.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  PaginationParams,
  PaginatedResult,
} from '../types/student.types.js';

const TABLE = 'students';

export class StudentRepository {
  constructor(private supabase: SupabaseClient) {}

  // ── CREATE ────────────────────────────────────────────

  async create(data: CreateStudentInput): Promise<Student> {
    const payload = {
      ...data,
      status: 'active' as const,
      special_needs_flag: data.special_needs_flag ?? false,
    };

    const { data: rows, error } = await this.supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create student: ${error.message}`);
    return rows as Student;
  }

  // ── READ — paginated list ─────────────────────────────

  async findAll(
    filters: StudentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Student>> {
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from(TABLE)
      .select('*', { count: 'exact' });

    // Apply optional filters
    if (filters.status)      query = query.eq('status', filters.status);
    if (filters.gender)       query = query.eq('gender', filters.gender);
    if (filters.nationality)  query = query.eq('nationality', filters.nationality);

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: rows, count, error } = await query;

    if (error) throw new Error(`Failed to list students: ${error.message}`);

    return {
      data: (rows ?? []) as Student[],
      meta: {
        page,
        limit,
        total: count ?? 0,
      },
    };
  }

  // ── READ — single by id ──────────────────────────────

  async findById(id: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;   // not found
    if (error) throw new Error(`Failed to get student: ${error.message}`);

    return data as Student;
  }

  // ── READ — by admission number ───────────────────────

  async findByAdmissionNumber(admissionNumber: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .eq('admission_number', admissionNumber)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to find student: ${error.message}`);

    return data as Student;
  }

  // ── UPDATE ────────────────────────────────────────────

  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    const { data: updated, error } = await this.supabase
      .from(TABLE)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update student: ${error.message}`);
    return updated as Student;
  }

  // ── SOFT DELETE — set status to 'withdrawn' ───────────

  async softDelete(id: string): Promise<Student> {
    return this.update(id, { status: 'withdrawn' });
  }

  // ── SEARCH — by name or admission number ──────────────

  async search(query: string): Promise<Student[]> {
    // Supabase ilike for partial matching across name fields
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('*')
      .or(
        `first_name.ilike.%${query}%,` +
        `middle_name.ilike.%${query}%,` +
        `last_name.ilike.%${query}%,` +
        `admission_number.ilike.%${query}%`
      )
      .order('last_name', { ascending: true })
      .limit(50);

    if (error) throw new Error(`Failed to search students: ${error.message}`);
    return (data ?? []) as Student[];
  }
}
