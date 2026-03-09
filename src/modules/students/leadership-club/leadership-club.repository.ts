/**
 * Leadership & Club Repository
 *
 * Supabase data-access for:
 *   - student_leadership_roles (prefect assignments)
 *   - clubs (club/society entities)
 *   - student_clubs (student ↔ club membership)
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentLeadershipRole,
  CreateLeadershipRoleInput,
  UpdateLeadershipRoleInput,
  Club,
  CreateClubInput,
  UpdateClubInput,
  StudentClub,
  JoinClubInput,
} from '../types/leadership-club.types.js';

// ═══════════════════════════════════════════════════════
//  Leadership Role Repository
// ═══════════════════════════════════════════════════════

export class LeadershipRoleRepository {
  constructor(private supabase: SupabaseClient) {}

  async assign(studentId: string, data: CreateLeadershipRoleInput): Promise<StudentLeadershipRole> {
    const payload = {
      student_id: studentId,
      status: 'active' as const,
      date_assigned: data.date_assigned ?? new Date().toISOString().split('T')[0],
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_leadership_roles')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to assign leadership role: ${error.message}`);
    return row as StudentLeadershipRole;
  }

  async findByStudentId(studentId: string): Promise<StudentLeadershipRole[]> {
    const { data, error } = await this.supabase
      .from('student_leadership_roles')
      .select('*')
      .eq('student_id', studentId)
      .order('date_assigned', { ascending: false });

    if (error) throw new Error(`Failed to list leadership roles: ${error.message}`);
    return (data ?? []) as StudentLeadershipRole[];
  }

  async findById(id: string): Promise<StudentLeadershipRole | null> {
    const { data, error } = await this.supabase
      .from('student_leadership_roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get leadership role: ${error.message}`);
    return data as StudentLeadershipRole;
  }

  async update(id: string, data: UpdateLeadershipRoleInput): Promise<StudentLeadershipRole> {
    const { data: updated, error } = await this.supabase
      .from('student_leadership_roles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update leadership role: ${error.message}`);
    return updated as StudentLeadershipRole;
  }
}

// ═══════════════════════════════════════════════════════
//  Club Repository
// ═══════════════════════════════════════════════════════

export class ClubRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: CreateClubInput): Promise<Club> {
    const { data: row, error } = await this.supabase
      .from('clubs')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create club: ${error.message}`);
    return row as Club;
  }

  async findAll(): Promise<Club[]> {
    const { data, error } = await this.supabase
      .from('clubs')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list clubs: ${error.message}`);
    return (data ?? []) as Club[];
  }

  async findById(id: string): Promise<Club | null> {
    const { data, error } = await this.supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get club: ${error.message}`);
    return data as Club;
  }

  async update(id: string, data: UpdateClubInput): Promise<Club> {
    const { data: updated, error } = await this.supabase
      .from('clubs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update club: ${error.message}`);
    return updated as Club;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('clubs')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete club: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Club Membership Repository
// ═══════════════════════════════════════════════════════

export class StudentClubRepository {
  constructor(private supabase: SupabaseClient) {}

  async join(studentId: string, data: JoinClubInput): Promise<StudentClub> {
    const payload = {
      student_id: studentId,
      role: data.role ?? 'member',
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_clubs')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to join club: ${error.message}`);
    return row as StudentClub;
  }

  async findByStudentId(studentId: string): Promise<StudentClub[]> {
    const { data, error } = await this.supabase
      .from('student_clubs')
      .select('*')
      .eq('student_id', studentId)
      .order('date_joined', { ascending: false });

    if (error) throw new Error(`Failed to list student clubs: ${error.message}`);
    return (data ?? []) as StudentClub[];
  }

  async leave(studentId: string, clubId: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_clubs')
      .update({ date_left: new Date().toISOString().split('T')[0] })
      .eq('student_id', studentId)
      .eq('club_id', clubId);

    if (error) throw new Error(`Failed to leave club: ${error.message}`);
  }
}
