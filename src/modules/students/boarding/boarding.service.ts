/**
 * Boarding & Dormitory Service
 *
 * Business logic for:
 *   - Dormitory CRUD (shared entities)
 *   - Student boarding assignment / reassignment
 */

import type { FastifyInstance } from 'fastify';
import {
  DormitoryRepository,
  StudentBoardingRepository,
} from './boarding.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  Dormitory,
  CreateDormitoryInput,
  UpdateDormitoryInput,
  StudentBoardingAssignment,
  AssignBoardingInput,
  UpdateBoardingInput,
} from '../types/boarding.types.js';

export class BoardingService {
  private dormRepo: DormitoryRepository;
  private boardingRepo: StudentBoardingRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.dormRepo = new DormitoryRepository(fastify.supabase);
    this.boardingRepo = new StudentBoardingRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ═══════════════════════════════════════════════════
  //  Dormitory CRUD
  // ═══════════════════════════════════════════════════

  async createDormitory(data: CreateDormitoryInput): Promise<Dormitory> {
    return this.dormRepo.create(data);
  }

  async getAllDormitories(): Promise<Dormitory[]> {
    return this.dormRepo.findAll();
  }

  async getDormitoryById(id: string): Promise<Dormitory> {
    const dorm = await this.dormRepo.findById(id);
    if (!dorm) {
      throw Object.assign(new Error(`Dormitory '${id}' not found`), { statusCode: 404 });
    }
    return dorm;
  }

  async updateDormitory(id: string, data: UpdateDormitoryInput): Promise<Dormitory> {
    await this.getDormitoryById(id);
    return this.dormRepo.update(id, data);
  }

  async deleteDormitory(id: string): Promise<void> {
    await this.getDormitoryById(id);
    await this.dormRepo.delete(id);
  }

  // ═══════════════════════════════════════════════════
  //  Student Boarding Assignment
  // ═══════════════════════════════════════════════════

  async assignBoarding(studentId: string, data: AssignBoardingInput): Promise<StudentBoardingAssignment> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    await this.getDormitoryById(data.dormitory_id);
    return this.boardingRepo.assign(studentId, data);
  }

  async getStudentBoardingHistory(studentId: string): Promise<StudentBoardingAssignment[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.boardingRepo.findByStudentId(studentId);
  }

  async getCurrentBoarding(studentId: string): Promise<StudentBoardingAssignment | null> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.boardingRepo.findCurrentByStudentId(studentId);
  }

  async updateBoardingAssignment(assignmentId: string, data: UpdateBoardingInput): Promise<StudentBoardingAssignment> {
    const assignment = await this.boardingRepo.findById(assignmentId);
    if (!assignment) {
      throw Object.assign(new Error(`Boarding assignment '${assignmentId}' not found`), { statusCode: 404 });
    }
    return this.boardingRepo.update(assignmentId, data);
  }
}
