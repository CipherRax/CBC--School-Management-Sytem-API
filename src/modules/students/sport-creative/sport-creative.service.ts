/**
 * Sport & Creative Activity Service
 *
 * Business logic for:
 *   - Sport CRUD (shared entities)
 *   - Student sport participation
 *   - Student creative activity enrollment
 */

import type { FastifyInstance } from 'fastify';
import {
  SportRepository,
  StudentSportRepository,
  StudentCreativeActivityRepository,
} from './sport-creative.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  Sport,
  CreateSportInput,
  UpdateSportInput,
  StudentSport,
  JoinSportInput,
  StudentCreativeActivity,
  CreateCreativeActivityInput,
} from '../types/sport.types.js';

export class SportCreativeService {
  private sportRepo: SportRepository;
  private studentSportRepo: StudentSportRepository;
  private creativeRepo: StudentCreativeActivityRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.sportRepo = new SportRepository(fastify.supabase);
    this.studentSportRepo = new StudentSportRepository(fastify.supabase);
    this.creativeRepo = new StudentCreativeActivityRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ═══════════════════════════════════════════════════
  //  Sport CRUD
  // ═══════════════════════════════════════════════════

  async createSport(data: CreateSportInput): Promise<Sport> {
    return this.sportRepo.create(data);
  }

  async getAllSports(): Promise<Sport[]> {
    return this.sportRepo.findAll();
  }

  async getSportById(id: string): Promise<Sport> {
    const sport = await this.sportRepo.findById(id);
    if (!sport) {
      throw Object.assign(new Error(`Sport '${id}' not found`), { statusCode: 404 });
    }
    return sport;
  }

  async updateSport(id: string, data: UpdateSportInput): Promise<Sport> {
    await this.getSportById(id);
    return this.sportRepo.update(id, data);
  }

  async deleteSport(id: string): Promise<void> {
    await this.getSportById(id);
    await this.sportRepo.delete(id);
  }

  // ═══════════════════════════════════════════════════
  //  Student ↔ Sport Participation
  // ═══════════════════════════════════════════════════

  async joinSport(studentId: string, data: JoinSportInput): Promise<StudentSport> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    const sport = await this.getSportById(data.sport_id);
    return this.studentSportRepo.join(studentId, data, sport.category);
  }

  async getStudentSports(studentId: string): Promise<StudentSport[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.studentSportRepo.findByStudentId(studentId);
  }

  async leaveSport(studentId: string, sportId: string): Promise<void> {
    await this.studentSportRepo.leave(studentId, sportId);
  }

  // ═══════════════════════════════════════════════════
  //  Student ↔ Creative Activity
  // ═══════════════════════════════════════════════════

  async createCreativeActivity(studentId: string, data: CreateCreativeActivityInput): Promise<StudentCreativeActivity> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.creativeRepo.create(studentId, data);
  }

  async getStudentCreativeActivities(studentId: string): Promise<StudentCreativeActivity[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.creativeRepo.findByStudentId(studentId);
  }
}
