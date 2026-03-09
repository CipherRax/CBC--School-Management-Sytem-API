/**
 * Sport & Creative Activity Repository
 *
 * Supabase data-access for:
 *   - sports (sport entities)
 *   - student_sports (student ↔ sport participation)
 *   - student_creative_activities (student ↔ creative arts)
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Sport,
  CreateSportInput,
  UpdateSportInput,
  StudentSport,
  JoinSportInput,
  StudentCreativeActivity,
  CreateCreativeActivityInput,
} from '../types/sport.types.js';

// ═══════════════════════════════════════════════════════
//  Sport Repository
// ═══════════════════════════════════════════════════════

export class SportRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(data: CreateSportInput): Promise<Sport> {
    const { data: row, error } = await this.supabase
      .from('sports')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create sport: ${error.message}`);
    return row as Sport;
  }

  async findAll(): Promise<Sport[]> {
    const { data, error } = await this.supabase
      .from('sports')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to list sports: ${error.message}`);
    return (data ?? []) as Sport[];
  }

  async findById(id: string): Promise<Sport | null> {
    const { data, error } = await this.supabase
      .from('sports')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw new Error(`Failed to get sport: ${error.message}`);
    return data as Sport;
  }

  async update(id: string, data: UpdateSportInput): Promise<Sport> {
    const { data: updated, error } = await this.supabase
      .from('sports')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update sport: ${error.message}`);
    return updated as Sport;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('sports')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete sport: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Sport Participation Repository
// ═══════════════════════════════════════════════════════

export class StudentSportRepository {
  constructor(private supabase: SupabaseClient) {}

  async join(studentId: string, data: JoinSportInput, sportCategory: string): Promise<StudentSport> {
    const payload = {
      student_id: studentId,
      category: sportCategory,
      date_joined: new Date().toISOString().split('T')[0],
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_sports')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to join sport: ${error.message}`);
    return row as StudentSport;
  }

  async findByStudentId(studentId: string): Promise<StudentSport[]> {
    const { data, error } = await this.supabase
      .from('student_sports')
      .select('*')
      .eq('student_id', studentId)
      .order('date_joined', { ascending: false });

    if (error) throw new Error(`Failed to list student sports: ${error.message}`);
    return (data ?? []) as StudentSport[];
  }

  async leave(studentId: string, sportId: string): Promise<void> {
    const { error } = await this.supabase
      .from('student_sports')
      .update({ date_left: new Date().toISOString().split('T')[0] })
      .eq('student_id', studentId)
      .eq('sport_id', sportId);

    if (error) throw new Error(`Failed to leave sport: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════
//  Student Creative Activity Repository
// ═══════════════════════════════════════════════════════

export class StudentCreativeActivityRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(studentId: string, data: CreateCreativeActivityInput): Promise<StudentCreativeActivity> {
    const payload = {
      student_id: studentId,
      date_joined: new Date().toISOString().split('T')[0],
      ...data,
    };

    const { data: row, error } = await this.supabase
      .from('student_creative_activities')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create creative activity: ${error.message}`);
    return row as StudentCreativeActivity;
  }

  async findByStudentId(studentId: string): Promise<StudentCreativeActivity[]> {
    const { data, error } = await this.supabase
      .from('student_creative_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('date_joined', { ascending: false });

    if (error) throw new Error(`Failed to list creative activities: ${error.message}`);
    return (data ?? []) as StudentCreativeActivity[];
  }
}
