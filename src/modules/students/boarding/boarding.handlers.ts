/**
 * Boarding & Dormitory Handlers
 *
 * Endpoint handlers for:
 *   - Dormitory CRUD (shared academic resources)
 *   - Student boarding assignment management
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { BoardingService } from './boarding.service.js';
import type {
  CreateDormitoryInput,
  UpdateDormitoryInput,
  AssignBoardingInput,
  UpdateBoardingInput,
} from '../types/boarding.types.js';

// ═══════════════════════════════════════════════════════
//  Dormitory CRUD Handlers
// ═══════════════════════════════════════════════════════

export const createDormitoryHandler = async (
  request: FastifyRequest<{ Body: CreateDormitoryInput }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const dorm = await service.createDormitory(request.body);
  return reply.code(201).send({ success: true, message: 'Dormitory created', data: dorm });
};

export const getAllDormitoriesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const dorms = await service.getAllDormitories();
  return reply.send({ success: true, data: dorms });
};

export const updateDormitoryHandler = async (
  request: FastifyRequest<{ Params: { dormitoryId: string }; Body: UpdateDormitoryInput }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const dorm = await service.updateDormitory(request.params.dormitoryId, request.body);
  return reply.send({ success: true, message: 'Dormitory updated', data: dorm });
};

export const deleteDormitoryHandler = async (
  request: FastifyRequest<{ Params: { dormitoryId: string } }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  await service.deleteDormitory(request.params.dormitoryId);
  return reply.send({ success: true, message: 'Dormitory deleted' });
};

// ═══════════════════════════════════════════════════════
//  Student Boarding Assignment Handlers
// ═══════════════════════════════════════════════════════

export const assignBoardingHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: AssignBoardingInput }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const assignment = await service.assignBoarding(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Boarding assigned', data: assignment });
};

export const getStudentBoardingHistoryHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const assignments = await service.getStudentBoardingHistory(request.params.id);
  return reply.send({ success: true, data: assignments });
};

export const getCurrentBoardingHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const current = await service.getCurrentBoarding(request.params.id);
  return reply.send({ success: true, data: current });
};

export const updateBoardingAssignmentHandler = async (
  request: FastifyRequest<{ Params: { id: string; assignmentId: string }; Body: UpdateBoardingInput }>,
  reply: FastifyReply,
) => {
  const service = new BoardingService(request.server);
  const assignment = await service.updateBoardingAssignment(request.params.assignmentId, request.body);
  return reply.send({ success: true, message: 'Boarding assignment updated', data: assignment });
};
