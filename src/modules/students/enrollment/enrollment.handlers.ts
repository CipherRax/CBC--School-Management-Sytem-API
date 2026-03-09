/**
 * Enrollment Handlers
 *
 * Endpoint handlers for student enrollment operations.
 *
 * Workflow:
 *   Admission → Enroll → (per year) Promote → ... → Graduate / Transfer
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { EnrollmentService } from './enrollment.service.js';
import type {
  CreateEnrollmentInput,
  PromoteStudentInput,
  TransferStudentInput,
} from '../types/enrollment.types.js';

// ── POST /students/:id/enroll ───────────────────────────

export const enrollStudentHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateEnrollmentInput }>,
  reply: FastifyReply,
) => {
  const service = new EnrollmentService(request.server);
  const enrollment = await service.enrollStudent(request.params.id, request.body);
  return reply.code(201).send({
    success: true,
    message: 'Student enrolled successfully',
    data: enrollment,
  });
};

// ── POST /students/:id/promote ──────────────────────────

export const promoteStudentHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: PromoteStudentInput }>,
  reply: FastifyReply,
) => {
  const service = new EnrollmentService(request.server);
  const enrollment = await service.promoteStudent(request.params.id, request.body);
  return reply.code(201).send({
    success: true,
    message: 'Student promoted successfully',
    data: enrollment,
  });
};

// ── POST /students/:id/transfer ─────────────────────────

export const transferStudentHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: TransferStudentInput }>,
  reply: FastifyReply,
) => {
  const service = new EnrollmentService(request.server);
  const enrollment = await service.transferStudent(request.params.id, request.body);
  return reply.code(201).send({
    success: true,
    message: 'Student transferred successfully',
    data: enrollment,
  });
};

// ── GET /students/:id/enrollments ───────────────────────

export const getEnrollmentHistoryHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new EnrollmentService(request.server);
  const enrollments = await service.getEnrollmentHistory(request.params.id);
  return reply.send({ success: true, data: enrollments });
};

// ── GET /students/:id/enrollment/current ────────────────

export const getCurrentEnrollmentHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new EnrollmentService(request.server);
  const enrollment = await service.getCurrentEnrollment(request.params.id);
  return reply.send({ success: true, data: enrollment });
};
