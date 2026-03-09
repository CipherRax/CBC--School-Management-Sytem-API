/**
 * Advanced Student Records Repository
 *
 * Supabase data-access for:
 *   - student_government_records
 *   - student_national_exams
 *   - student_competitions
 *   - student_discipline_records
 *   - student_health_records
 *   - student_transfers
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  StudentGovernmentRecord, CreateGovernmentRecordInput, UpdateGovernmentRecordInput,
  StudentNationalExam, CreateNationalExamInput, UpdateNationalExamInput,
  StudentCompetition, CreateCompetitionInput, UpdateCompetitionInput,
  StudentDisciplineRecord, CreateDisciplineRecordInput, UpdateDisciplineRecordInput,
  StudentHealthRecord, CreateHealthRecordInput, UpdateHealthRecordInput,
  StudentTransfer, CreateTransferInput, UpdateTransferInput,
} from '../types/advanced-records.types.js';

// ═══════════════════════════════════════════════════════
// Base Repository Pattern for 1:N and 1:1 Advanced Records
// ═══════════════════════════════════════════════════════

export class AdvancedRecordsRepository {
  constructor(private supabase: SupabaseClient) {}

  // ── 1. Government Records ─────────────────────────────

  async createGovernmentRecord(studentId: string, data: CreateGovernmentRecordInput): Promise<StudentGovernmentRecord> {
    const payload = { student_id: studentId, verification_status: 'pending', ...data };
    const { data: row, error } = await this.supabase.from('student_government_records').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create government record: ${error.message}`);
    return row as StudentGovernmentRecord;
  }

  async getGovernmentRecords(studentId: string): Promise<StudentGovernmentRecord[]> {
    const { data, error } = await this.supabase.from('student_government_records').select('*').eq('student_id', studentId);
    if (error) throw new Error(`Failed to list government records: ${error.message}`);
    return (data ?? []) as StudentGovernmentRecord[];
  }

  async updateGovernmentRecord(id: string, data: UpdateGovernmentRecordInput): Promise<StudentGovernmentRecord> {
    const { data: row, error } = await this.supabase.from('student_government_records').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update government record: ${error.message}`);
    return row as StudentGovernmentRecord;
  }

  async deleteGovernmentRecord(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_government_records').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete government record: ${error.message}`);
  }

  // ── 2. National Exams ─────────────────────────────────

  async createNationalExam(studentId: string, data: CreateNationalExamInput): Promise<StudentNationalExam> {
    const payload = { student_id: studentId, results_status: 'Pending', ...data };
    const { data: row, error } = await this.supabase.from('student_national_exams').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create national exam record: ${error.message}`);
    return row as StudentNationalExam;
  }

  async getNationalExams(studentId: string): Promise<StudentNationalExam[]> {
    const { data, error } = await this.supabase.from('student_national_exams').select('*').eq('student_id', studentId).order('registration_year', { ascending: false });
    if (error) throw new Error(`Failed to list national exam records: ${error.message}`);
    return (data ?? []) as StudentNationalExam[];
  }

  async updateNationalExam(id: string, data: UpdateNationalExamInput): Promise<StudentNationalExam> {
    const { data: row, error } = await this.supabase.from('student_national_exams').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update national exam record: ${error.message}`);
    return row as StudentNationalExam;
  }

  async deleteNationalExam(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_national_exams').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete national exam record: ${error.message}`);
  }

  // ── 3. Competitions ───────────────────────────────────

  async createCompetition(studentId: string, data: CreateCompetitionInput): Promise<StudentCompetition> {
    const payload = { student_id: studentId, ...data };
    const { data: row, error } = await this.supabase.from('student_competitions').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create competition record: ${error.message}`);
    return row as StudentCompetition;
  }

  async getCompetitions(studentId: string): Promise<StudentCompetition[]> {
    const { data, error } = await this.supabase.from('student_competitions').select('*').eq('student_id', studentId);
    if (error) throw new Error(`Failed to list competition records: ${error.message}`);
    return (data ?? []) as StudentCompetition[];
  }

  async updateCompetition(id: string, data: UpdateCompetitionInput): Promise<StudentCompetition> {
    const { data: row, error } = await this.supabase.from('student_competitions').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update competition record: ${error.message}`);
    return row as StudentCompetition;
  }

  async deleteCompetition(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_competitions').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete competition record: ${error.message}`);
  }

  // ── 4. Discipline Records ─────────────────────────────

  async createDisciplineRecord(studentId: string, data: CreateDisciplineRecordInput): Promise<StudentDisciplineRecord> {
    const payload = { student_id: studentId, ...data };
    const { data: row, error } = await this.supabase.from('student_discipline_records').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create discipline record: ${error.message}`);
    return row as StudentDisciplineRecord;
  }

  async getDisciplineRecords(studentId: string): Promise<StudentDisciplineRecord[]> {
    const { data, error } = await this.supabase.from('student_discipline_records').select('*').eq('student_id', studentId).order('incident_date', { ascending: false });
    if (error) throw new Error(`Failed to list discipline records: ${error.message}`);
    return (data ?? []) as StudentDisciplineRecord[];
  }

  async updateDisciplineRecord(id: string, data: UpdateDisciplineRecordInput): Promise<StudentDisciplineRecord> {
    const { data: row, error } = await this.supabase.from('student_discipline_records').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update discipline record: ${error.message}`);
    return row as StudentDisciplineRecord;
  }

  async deleteDisciplineRecord(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_discipline_records').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete discipline record: ${error.message}`);
  }

  // ── 5. Health Records ─────────────────────────────────

  async createHealthRecord(studentId: string, data: CreateHealthRecordInput): Promise<StudentHealthRecord> {
    const payload = { student_id: studentId, ...data };
    const { data: row, error } = await this.supabase.from('student_health_records').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create health record: ${error.message}`);
    return row as StudentHealthRecord;
  }

  async getHealthRecords(studentId: string): Promise<StudentHealthRecord[]> {
    const { data, error } = await this.supabase.from('student_health_records').select('*').eq('student_id', studentId);
    if (error) throw new Error(`Failed to list health records: ${error.message}`);
    return (data ?? []) as StudentHealthRecord[];
  }

  async updateHealthRecord(id: string, data: UpdateHealthRecordInput): Promise<StudentHealthRecord> {
    const { data: row, error } = await this.supabase.from('student_health_records').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update health record: ${error.message}`);
    return row as StudentHealthRecord;
  }

  async deleteHealthRecord(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_health_records').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete health record: ${error.message}`);
  }

  // ── 6. Student Transfers ──────────────────────────────

  async createTransfer(studentId: string, data: CreateTransferInput): Promise<StudentTransfer> {
    const payload = { student_id: studentId, approval_status: 'Pending', ...data };
    const { data: row, error } = await this.supabase.from('student_transfers').insert([payload]).select().single();
    if (error) throw new Error(`Failed to create transfer record: ${error.message}`);
    return row as StudentTransfer;
  }

  async getTransfers(studentId: string): Promise<StudentTransfer[]> {
    const { data, error } = await this.supabase.from('student_transfers').select('*').eq('student_id', studentId);
    if (error) throw new Error(`Failed to list transfer records: ${error.message}`);
    return (data ?? []) as StudentTransfer[];
  }

  async updateTransfer(id: string, data: UpdateTransferInput): Promise<StudentTransfer> {
    const { data: row, error } = await this.supabase.from('student_transfers').update(data).eq('id', id).select().single();
    if (error) throw new Error(`Failed to update transfer record: ${error.message}`);
    return row as StudentTransfer;
  }

  async deleteTransfer(id: string): Promise<void> {
    const { error } = await this.supabase.from('student_transfers').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete transfer record: ${error.message}`);
  }
}
