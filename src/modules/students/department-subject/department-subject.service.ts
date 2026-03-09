/**
 * Department & Subject Service
 *
 * Business logic for departments, subjects, and student linkage.
 */

import type { FastifyInstance } from 'fastify';
import {
  DepartmentRepository,
  SubjectRepository,
  StudentSubjectRepository,
  StudentDepartmentRepository,
} from './department-subject.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  StudentDepartment,
  CreateStudentDepartmentInput,
} from '../types/department.types.js';
import type {
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
  StudentSubject,
  CreateStudentSubjectInput,
} from '../types/subject.types.js';

export class DepartmentSubjectService {
  private deptRepo: DepartmentRepository;
  private subjectRepo: SubjectRepository;
  private studentSubjectRepo: StudentSubjectRepository;
  private studentDeptRepo: StudentDepartmentRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.deptRepo = new DepartmentRepository(fastify.supabase);
    this.subjectRepo = new SubjectRepository(fastify.supabase);
    this.studentSubjectRepo = new StudentSubjectRepository(fastify.supabase);
    this.studentDeptRepo = new StudentDepartmentRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  // ═══════════════════════════════════════════════════
  //  Department operations
  // ═══════════════════════════════════════════════════

  async createDepartment(data: CreateDepartmentInput): Promise<Department> {
    return this.deptRepo.create(data);
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.deptRepo.findAll();
  }

  async getDepartmentById(id: string): Promise<Department> {
    const dept = await this.deptRepo.findById(id);
    if (!dept) {
      throw Object.assign(new Error(`Department '${id}' not found`), { statusCode: 404 });
    }
    return dept;
  }

  async updateDepartment(id: string, data: UpdateDepartmentInput): Promise<Department> {
    await this.getDepartmentById(id);
    return this.deptRepo.update(id, data);
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.getDepartmentById(id);
    await this.deptRepo.delete(id);
  }

  // ═══════════════════════════════════════════════════
  //  Subject operations
  // ═══════════════════════════════════════════════════

  async createSubject(data: CreateSubjectInput): Promise<Subject> {
    // Validate department exists if provided
    if (data.department_id) {
      await this.getDepartmentById(data.department_id);
    }
    return this.subjectRepo.create(data);
  }

  async getAllSubjects(): Promise<Subject[]> {
    return this.subjectRepo.findAll();
  }

  async getSubjectById(id: string): Promise<Subject> {
    const subject = await this.subjectRepo.findById(id);
    if (!subject) {
      throw Object.assign(new Error(`Subject '${id}' not found`), { statusCode: 404 });
    }
    return subject;
  }

  async getSubjectsByDepartment(departmentId: string): Promise<Subject[]> {
    await this.getDepartmentById(departmentId);
    return this.subjectRepo.findByDepartment(departmentId);
  }

  async updateSubject(id: string, data: UpdateSubjectInput): Promise<Subject> {
    await this.getSubjectById(id);
    return this.subjectRepo.update(id, data);
  }

  async deleteSubject(id: string): Promise<void> {
    await this.getSubjectById(id);
    await this.subjectRepo.delete(id);
  }

  // ═══════════════════════════════════════════════════
  //  Student ↔ Subject enrollment
  // ═══════════════════════════════════════════════════

  async enrollStudentInSubject(studentId: string, data: CreateStudentSubjectInput): Promise<StudentSubject> {
    // Validate both student and subject exist
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    await this.getSubjectById(data.subject_id);

    return this.studentSubjectRepo.enroll(studentId, data);
  }

  async getStudentSubjects(studentId: string): Promise<StudentSubject[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.studentSubjectRepo.findByStudentId(studentId);
  }

  async dropStudentSubject(studentId: string, subjectId: string): Promise<void> {
    await this.studentSubjectRepo.drop(studentId, subjectId);
  }

  // ═══════════════════════════════════════════════════
  //  Student ↔ Department membership
  // ═══════════════════════════════════════════════════

  async joinDepartment(studentId: string, data: CreateStudentDepartmentInput): Promise<StudentDepartment> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    await this.getDepartmentById(data.department_id);

    return this.studentDeptRepo.join(studentId, data);
  }

  async getStudentDepartments(studentId: string): Promise<StudentDepartment[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }
    return this.studentDeptRepo.findByStudentId(studentId);
  }

  async leaveDepartment(studentId: string, departmentId: string): Promise<void> {
    await this.studentDeptRepo.leave(studentId, departmentId);
  }
}
