/**
 * Student Guardian Service
 *
 * Business logic for managing student-guardian relationships.
 * A student can have multiple guardians (father, mother, guardian, sponsor).
 */

import type { FastifyInstance } from 'fastify';
import { StudentGuardianRepository } from './student-guardian.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  StudentGuardian,
  CreateGuardianInput,
  UpdateGuardianInput,
} from '../types/student-guardian.types.js';

export class StudentGuardianService {
  private guardianRepo: StudentGuardianRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.guardianRepo = new StudentGuardianRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  async addGuardian(studentId: string, data: CreateGuardianInput): Promise<StudentGuardian> {
    // Validate student exists
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    return this.guardianRepo.create(studentId, data);
  }

  async getGuardians(studentId: string): Promise<StudentGuardian[]> {
    // Validate student exists
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    return this.guardianRepo.findByStudentId(studentId);
  }

  async updateGuardian(guardianId: string, data: UpdateGuardianInput): Promise<StudentGuardian> {
    const guardian = await this.guardianRepo.findById(guardianId);
    if (!guardian) {
      throw Object.assign(new Error(`Guardian '${guardianId}' not found`), { statusCode: 404 });
    }

    return this.guardianRepo.update(guardianId, data);
  }

  async removeGuardian(guardianId: string): Promise<void> {
    const guardian = await this.guardianRepo.findById(guardianId);
    if (!guardian) {
      throw Object.assign(new Error(`Guardian '${guardianId}' not found`), { statusCode: 404 });
    }

    await this.guardianRepo.delete(guardianId);
  }
}
