/**
 * Academic Performance & Attendance Service
 *
 * Business logic for:
 *   - Recording and retrieving student grades
 *   - Recording and retrieving student attendance
 */

import type { FastifyInstance } from 'fastify';
import {
  StudentGradeRepository,
  StudentAttendanceRepository,
} from './academic-performance.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  StudentGrade,
  RecordGradeInput,
  UpdateGradeInput,
  StudentAttendance,
  RecordAttendanceInput,
  UpdateAttendanceInput,
} from '../types/academic-performance.types.js';

export class AcademicPerformanceService {
  private gradeRepo: StudentGradeRepository;
  private attendanceRepo: StudentAttendanceRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.gradeRepo = new StudentGradeRepository(fastify.supabase);
    this.attendanceRepo = new StudentAttendanceRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ═══════════════════════════════════════════════════
  //  Student Grades
  // ═══════════════════════════════════════════════════

  async recordGrade(studentId: string, data: RecordGradeInput): Promise<StudentGrade> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.gradeRepo.recordGrade(studentId, data);
  }

  async getStudentGrades(studentId: string): Promise<StudentGrade[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.gradeRepo.findByStudentId(studentId);
  }

  async updateGrade(gradeId: string, data: UpdateGradeInput): Promise<StudentGrade> {
    const grade = await this.gradeRepo.findById(gradeId);
    if (!grade) {
      throw Object.assign(new Error(`Grade record '${gradeId}' not found`), { statusCode: 404 });
    }
    return this.gradeRepo.update(gradeId, data);
  }

  async deleteGrade(gradeId: string): Promise<void> {
    const grade = await this.gradeRepo.findById(gradeId);
    if (!grade) {
      throw Object.assign(new Error(`Grade record '${gradeId}' not found`), { statusCode: 404 });
    }
    await this.gradeRepo.delete(gradeId);
  }

  // ═══════════════════════════════════════════════════
  //  Student Attendance
  // ═══════════════════════════════════════════════════

  async recordAttendance(studentId: string, data: RecordAttendanceInput): Promise<StudentAttendance> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.attendanceRepo.recordAttendance(studentId, data);
  }

  async getStudentAttendance(studentId: string): Promise<StudentAttendance[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.attendanceRepo.findByStudentId(studentId);
  }

  async updateAttendance(attendanceId: string, data: UpdateAttendanceInput): Promise<StudentAttendance> {
    const attendance = await this.attendanceRepo.findById(attendanceId);
    if (!attendance) {
      throw Object.assign(new Error(`Attendance record '${attendanceId}' not found`), { statusCode: 404 });
    }
    return this.attendanceRepo.update(attendanceId, data);
  }

  async deleteAttendance(attendanceId: string): Promise<void> {
    const attendance = await this.attendanceRepo.findById(attendanceId);
    if (!attendance) {
      throw Object.assign(new Error(`Attendance record '${attendanceId}' not found`), { statusCode: 404 });
    }
    await this.attendanceRepo.delete(attendanceId);
  }
}
