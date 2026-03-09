/**
 * Leadership & Club Service
 *
 * Business logic for:
 *   - Assigning and managing student leadership roles (prefects)
 *   - Club/Society CRUD
 *   - Student club membership
 */

import type { FastifyInstance } from 'fastify';
import {
  LeadershipRoleRepository,
  ClubRepository,
  StudentClubRepository,
} from './leadership-club.repository.js';
import { StudentRepository } from '../core/student.repository.js';
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

export class LeadershipClubService {
  private leaderRepo: LeadershipRoleRepository;
  private clubRepo: ClubRepository;
  private studentClubRepo: StudentClubRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.leaderRepo = new LeadershipRoleRepository(fastify.supabase);
    this.clubRepo = new ClubRepository(fastify.supabase);
    this.studentClubRepo = new StudentClubRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ═══════════════════════════════════════════════════
  //  Leadership Roles
  // ═══════════════════════════════════════════════════

  async assignRole(studentId: string, data: CreateLeadershipRoleInput): Promise<StudentLeadershipRole> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.leaderRepo.assign(studentId, data);
  }

  async getStudentLeadershipRoles(studentId: string): Promise<StudentLeadershipRole[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.leaderRepo.findByStudentId(studentId);
  }

  async updateLeadershipRole(roleId: string, data: UpdateLeadershipRoleInput): Promise<StudentLeadershipRole> {
    const role = await this.leaderRepo.findById(roleId);
    if (!role) {
      throw Object.assign(new Error(`Leadership role '${roleId}' not found`), { statusCode: 404 });
    }
    return this.leaderRepo.update(roleId, data);
  }

  // ═══════════════════════════════════════════════════
  //  Club CRUD
  // ═══════════════════════════════════════════════════

  async createClub(data: CreateClubInput): Promise<Club> {
    return this.clubRepo.create(data);
  }

  async getAllClubs(): Promise<Club[]> {
    return this.clubRepo.findAll();
  }

  async getClubById(id: string): Promise<Club> {
    const club = await this.clubRepo.findById(id);
    if (!club) {
      throw Object.assign(new Error(`Club '${id}' not found`), { statusCode: 404 });
    }
    return club;
  }

  async updateClub(id: string, data: UpdateClubInput): Promise<Club> {
    await this.getClubById(id);
    return this.clubRepo.update(id, data);
  }

  async deleteClub(id: string): Promise<void> {
    await this.getClubById(id);
    await this.clubRepo.delete(id);
  }

  // ═══════════════════════════════════════════════════
  //  Student ↔ Club membership
  // ═══════════════════════════════════════════════════

  async joinClub(studentId: string, data: JoinClubInput): Promise<StudentClub> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    await this.getClubById(data.club_id);

    return this.studentClubRepo.join(studentId, data);
  }

  async getStudentClubs(studentId: string): Promise<StudentClub[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.studentClubRepo.findByStudentId(studentId);
  }

  async leaveClub(studentId: string, clubId: string): Promise<void> {
    await this.studentClubRepo.leave(studentId, clubId);
  }
}
