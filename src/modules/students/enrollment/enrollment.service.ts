/**
 * Enrollment Service
 *
 * Business logic for student academic enrollment.
 *
 * Key domain rules (from docs/system-architecture/student-domain-architecture.md):
 *   - Academic history must NEVER be overwritten
 *   - Enrollment records are historical and append-only
 *   - When a student is promoted/transferred, the old enrollment is marked 'completed'/'transferred'
 *     and a new enrollment record is created
 */

import type { FastifyInstance } from 'fastify';
import { EnrollmentRepository } from './enrollment.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  StudentEnrollment,
  CreateEnrollmentInput,
  PromoteStudentInput,
  TransferStudentInput,
} from '../types/enrollment.types.js';

export class EnrollmentService {
  private enrollmentRepo: EnrollmentRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.enrollmentRepo = new EnrollmentRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ── Enroll student for the first time ─────────────────

  async enrollStudent(studentId: string, data: CreateEnrollmentInput): Promise<StudentEnrollment> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    // Check if student already has an active enrollment
    const active = await this.enrollmentRepo.findActiveEnrollment(studentId);
    if (active) {
      throw Object.assign(
        new Error(
          `Student already has an active enrollment in ${active.class_level} (${active.academic_year} ${active.term}). ` +
          `Use /promote or /transfer to change placement.`
        ),
        { statusCode: 409 },
      );
    }

    return this.enrollmentRepo.create(studentId, data);
  }

  // ── Promote student to next level ─────────────────────

  async promoteStudent(studentId: string, data: PromoteStudentInput): Promise<StudentEnrollment> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    // Find and close the current active enrollment
    const active = await this.enrollmentRepo.findActiveEnrollment(studentId);
    if (active) {
      await this.enrollmentRepo.updateStatus(active.id, 'completed');
    }

    // Create new enrollment at the promoted level
    return this.enrollmentRepo.create(studentId, {
      school_id: active?.school_id,
      academic_year: data.academic_year,
      term: data.term,
      class_level: data.class_level,
      stream: data.stream ?? active?.stream,
      class_teacher_id: data.class_teacher_id,
    });
  }

  // ── Transfer student ──────────────────────────────────

  async transferStudent(studentId: string, data: TransferStudentInput): Promise<StudentEnrollment> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    // Close current active enrollment as 'transferred'
    const active = await this.enrollmentRepo.findActiveEnrollment(studentId);
    if (active) {
      await this.enrollmentRepo.updateStatus(active.id, 'transferred');
    }

    // If this is an inter-school transfer, update student status
    if (data.to_school) {
      await this.studentRepo.update(studentId, { status: 'transferred' });
    }

    // Create new enrollment record
    return this.enrollmentRepo.create(studentId, {
      school_id: null,   // New school context
      academic_year: data.academic_year,
      term: data.term,
      class_level: data.class_level,
      stream: data.stream,
    });
  }

  // ── Get enrollment history ────────────────────────────

  async getEnrollmentHistory(studentId: string): Promise<StudentEnrollment[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    return this.enrollmentRepo.findByStudentId(studentId);
  }

  // ── Get current active enrollment ─────────────────────

  async getCurrentEnrollment(studentId: string): Promise<StudentEnrollment> {
    const enrollment = await this.enrollmentRepo.findActiveEnrollment(studentId);
    if (!enrollment) {
      throw Object.assign(
        new Error(`No active enrollment found for student '${studentId}'`),
        { statusCode: 404 },
      );
    }
    return enrollment;
  }
}
