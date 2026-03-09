/**
 * Student Handlers
 *
 * Each handler corresponds to one endpoint.
 * Handlers instantiate the service, call the appropriate method,
 * and return a structured response.
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentService } from './student.service.js';
import type {
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  Gender,
  StudentStatus,
} from '../types/student.types.js';

// ── POST /students ──────────────────────────────────────

export const admitStudentHandler = async (
  request: FastifyRequest<{ Body: CreateStudentInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);
  const student = await service.admitStudent(request.body);
  return reply.code(201).send({
    success: true,
    message: 'Student admitted successfully',
    data: student,
  });
};

// ── GET /students ───────────────────────────────────────

export const getAllStudentsHandler = async (
  request: FastifyRequest<{
    Querystring: {
      page?: string;
      limit?: string;
      status?: StudentStatus;
      gender?: Gender;
      nationality?: string;
    };
  }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);

  const page  = Math.max(1, parseInt(request.query.page  ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(request.query.limit ?? '20', 10) || 20));

  const filters: StudentFilters = {};
  if (request.query.status)      filters.status      = request.query.status;
  if (request.query.gender)       filters.gender       = request.query.gender;
  if (request.query.nationality)  filters.nationality  = request.query.nationality;

  const result = await service.getAllStudents(filters, { page, limit });
  return reply.send({ success: true, ...result });
};

// ── GET /students/:id ───────────────────────────────────

export const getStudentByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);
  const student = await service.getStudentById(request.params.id);
  return reply.send({ success: true, data: student });
};

// ── PATCH /students/:id ─────────────────────────────────

export const updateStudentHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateStudentInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);
  const student = await service.updateStudent(request.params.id, request.body);
  return reply.send({
    success: true,
    message: 'Student updated successfully',
    data: student,
  });
};

// ── DELETE /students/:id ────────────────────────────────

export const dischargeStudentHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);
  const student = await service.dischargeStudent(request.params.id);
  return reply.send({
    success: true,
    message: 'Student discharged (status set to withdrawn)',
    data: student,
  });
};

// ── GET /students/search ────────────────────────────────

export const searchStudentsHandler = async (
  request: FastifyRequest<{ Querystring: { q?: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentService(request.server);
  const query = request.query.q ?? '';
  const results = await service.searchStudents(query);
  return reply.send({ success: true, data: results });
};