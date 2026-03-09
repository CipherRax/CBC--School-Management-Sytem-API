/**
 * Student Address Service
 *
 * Business logic for managing student addresses.
 */

import type { FastifyInstance } from 'fastify';
import { StudentAddressRepository } from './student-address.repository.js';
import { StudentRepository } from '../core/student.repository.js';
import type {
  StudentAddress,
  CreateStudentAddressInput,
  UpdateStudentAddressInput,
} from '../types/student-address.types.js';

export class StudentAddressService {
  private addressRepo: StudentAddressRepository;
  private studentRepo: StudentRepository;

  constructor(fastify: FastifyInstance) {
    this.addressRepo = new StudentAddressRepository(fastify.supabase);
    this.studentRepo = new StudentRepository(fastify.supabase);
  }

  async createAddress(studentId: string, data: CreateStudentAddressInput): Promise<StudentAddress> {
    // Validate student exists
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw Object.assign(new Error(`Student '${studentId}' not found`), { statusCode: 404 });
    }

    // Check if address already exists
    const existing = await this.addressRepo.findByStudentId(studentId);
    if (existing) {
      throw Object.assign(
        new Error('Student already has an address. Use PATCH to update.'),
        { statusCode: 409 },
      );
    }

    return this.addressRepo.create(studentId, data);
  }

  async getAddress(studentId: string): Promise<StudentAddress> {
    const address = await this.addressRepo.findByStudentId(studentId);
    if (!address) {
      throw Object.assign(
        new Error(`No address found for student '${studentId}'`),
        { statusCode: 404 },
      );
    }
    return address;
  }

  async updateAddress(studentId: string, data: UpdateStudentAddressInput): Promise<StudentAddress> {
    // Ensure address exists before updating
    await this.getAddress(studentId);
    return this.addressRepo.update(studentId, data);
  }
}
