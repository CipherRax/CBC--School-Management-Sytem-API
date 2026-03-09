/**
 * Advanced Student Records Service
 *
 * Business logic for:
 *   - Government IDs
 *   - National Exams
 *   - Competitions
 *   - Discipline
 *   - Health
 *   - Transfers
 */

import type { FastifyInstance } from 'fastify';
import { AdvancedRecordsRepository } from './advanced-records.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  StudentGovernmentRecord, CreateGovernmentRecordInput, UpdateGovernmentRecordInput,
  StudentNationalExam, CreateNationalExamInput, UpdateNationalExamInput,
  StudentCompetition, CreateCompetitionInput, UpdateCompetitionInput,
  StudentDisciplineRecord, CreateDisciplineRecordInput, UpdateDisciplineRecordInput,
  StudentHealthRecord, CreateHealthRecordInput, UpdateHealthRecordInput,
  StudentTransfer, CreateTransferInput, UpdateTransferInput,
} from '../types/advanced-records.types.js';

export class AdvancedRecordsService {
  private repo: AdvancedRecordsRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.repo = new AdvancedRecordsRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  private async ensureStudent(id: string) {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw Object.assign(new Error(`Student '${id}' not found`), { statusCode: 404 });
    }
    return student;
  }

  // ── 1. Government Records ─────────────────────────────
  async createGovernmentRecord(studentId: string, data: CreateGovernmentRecordInput) {
    await this.ensureStudent(studentId);
    return this.repo.createGovernmentRecord(studentId, data);
  }
  async getGovernmentRecords(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getGovernmentRecords(studentId);
  }
  async updateGovernmentRecord(id: string, data: UpdateGovernmentRecordInput) {
    return this.repo.updateGovernmentRecord(id, data);
  }
  async deleteGovernmentRecord(id: string) {
    return this.repo.deleteGovernmentRecord(id);
  }

  // ── 2. National Exams ─────────────────────────────────
  async createNationalExam(studentId: string, data: CreateNationalExamInput) {
    await this.ensureStudent(studentId);
    return this.repo.createNationalExam(studentId, data);
  }
  async getNationalExams(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getNationalExams(studentId);
  }
  async updateNationalExam(id: string, data: UpdateNationalExamInput) {
    return this.repo.updateNationalExam(id, data);
  }
  async deleteNationalExam(id: string) {
    return this.repo.deleteNationalExam(id);
  }

  // ── 3. Competitions ───────────────────────────────────
  async createCompetition(studentId: string, data: CreateCompetitionInput) {
    await this.ensureStudent(studentId);
    return this.repo.createCompetition(studentId, data);
  }
  async getCompetitions(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getCompetitions(studentId);
  }
  async updateCompetition(id: string, data: UpdateCompetitionInput) {
    return this.repo.updateCompetition(id, data);
  }
  async deleteCompetition(id: string) {
    return this.repo.deleteCompetition(id);
  }

  // ── 4. Discipline Records ─────────────────────────────
  async createDisciplineRecord(studentId: string, data: CreateDisciplineRecordInput) {
    await this.ensureStudent(studentId);
    return this.repo.createDisciplineRecord(studentId, data);
  }
  async getDisciplineRecords(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getDisciplineRecords(studentId);
  }
  async updateDisciplineRecord(id: string, data: UpdateDisciplineRecordInput) {
    return this.repo.updateDisciplineRecord(id, data);
  }
  async deleteDisciplineRecord(id: string) {
    return this.repo.deleteDisciplineRecord(id);
  }

  // ── 5. Health Records ─────────────────────────────────
  async createHealthRecord(studentId: string, data: CreateHealthRecordInput) {
    await this.ensureStudent(studentId);
    return this.repo.createHealthRecord(studentId, data);
  }
  async getHealthRecords(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getHealthRecords(studentId);
  }
  async updateHealthRecord(id: string, data: UpdateHealthRecordInput) {
    return this.repo.updateHealthRecord(id, data);
  }
  async deleteHealthRecord(id: string) {
    return this.repo.deleteHealthRecord(id);
  }

  // ── 6. Student Transfers ──────────────────────────────
  async createTransfer(studentId: string, data: CreateTransferInput) {
    await this.ensureStudent(studentId);
    return this.repo.createTransfer(studentId, data);
  }
  async getTransfers(studentId: string) {
    await this.ensureStudent(studentId);
    return this.repo.getTransfers(studentId);
  }
  async updateTransfer(id: string, data: UpdateTransferInput) {
    return this.repo.updateTransfer(id, data);
  }
  async deleteTransfer(id: string) {
    return this.repo.deleteTransfer(id);
  }
}
