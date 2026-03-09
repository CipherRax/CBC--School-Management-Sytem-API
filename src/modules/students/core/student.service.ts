/**
 * Student Service
 *
 * Business-logic layer for the student domain.
 * Orchestrates repository calls and enforces domain rules.
 */

import type { FastifyInstance } from 'fastify';
import { StudentRepository } from './student.repository.js';
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  PaginationParams,
  PaginatedResult,
} from '../types/student.types.js';

export class StudentService {
  private repo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.repo = new StudentRepository(fastify.supabase);
  }

  // ── Admit (Create) ───────────────────────────────────

  async admitStudent(data: CreateStudentInput): Promise<Student> {
    // Business rule: admission_number must be unique
    const existing = await this.repo.findByAdmissionNumber(data.admission_number);
    if (existing) {
      throw Object.assign(
        new Error(`A student with admission number '${data.admission_number}' already exists`),
        { statusCode: 409 },
      );
    }

    return this.repo.create(data);
  }

  // ── List (paginated + filtered) ──────────────────────

  async getAllStudents(
    filters: StudentFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Student>> {
    return this.repo.findAll(filters, pagination);
  }

  // ── Get by ID ────────────────────────────────────────

  async getStudentById(id: string): Promise<Student> {
    const student = await this.repo.findById(id);
    if (!student) {
      throw Object.assign(
        new Error(`Student with id '${id}' not found`),
        { statusCode: 404 },
      );
    }
    return student;
  }

  // ── Update ───────────────────────────────────────────

  async updateStudent(id: string, data: UpdateStudentInput): Promise<Student> {
    // Ensure student exists before updating
    await this.getStudentById(id);
    return this.repo.update(id, data);
  }

  // ── Discharge (Soft Delete) ──────────────────────────

  async dischargeStudent(id: string): Promise<Student> {
    // Ensure student exists before discharging
    await this.getStudentById(id);
    return this.repo.softDelete(id);
  }

  // ── Search ───────────────────────────────────────────

  async searchStudents(query: string): Promise<Student[]> {
    if (!query || query.trim().length === 0) {
      throw Object.assign(
        new Error('Search query must not be empty'),
        { statusCode: 400 },
      );
    }
    return this.repo.search(query.trim());
  }
}