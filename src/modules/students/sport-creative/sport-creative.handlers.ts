/**
 * Sport & Creative Activity Handlers
 *
 * Endpoint handlers for:
 *   - Sport CRUD (shared academic resources)
 *   - Student sport participation
 *   - Student creative activity enrollment
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { SportCreativeService } from './sport-creative.service.js';
import type {
  CreateSportInput,
  UpdateSportInput,
  JoinSportInput,
  CreateCreativeActivityInput,
} from '../types/sport.types.js';

// ═══════════════════════════════════════════════════════
//  Sport CRUD Handlers
// ═══════════════════════════════════════════════════════

export const createSportHandler = async (
  request: FastifyRequest<{ Body: CreateSportInput }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const sport = await service.createSport(request.body);
  return reply.code(201).send({ success: true, message: 'Sport created', data: sport });
};

export const getAllSportsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const sports = await service.getAllSports();
  return reply.send({ success: true, data: sports });
};

export const updateSportHandler = async (
  request: FastifyRequest<{ Params: { sportId: string }; Body: UpdateSportInput }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const sport = await service.updateSport(request.params.sportId, request.body);
  return reply.send({ success: true, message: 'Sport updated', data: sport });
};

export const deleteSportHandler = async (
  request: FastifyRequest<{ Params: { sportId: string } }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  await service.deleteSport(request.params.sportId);
  return reply.send({ success: true, message: 'Sport deleted' });
};

// ═══════════════════════════════════════════════════════
//  Student ↔ Sport Participation Handlers
// ═══════════════════════════════════════════════════════

export const joinSportHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: JoinSportInput }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const participation = await service.joinSport(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Joined sport', data: participation });
};

export const getStudentSportsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const sports = await service.getStudentSports(request.params.id);
  return reply.send({ success: true, data: sports });
};

export const leaveSportHandler = async (
  request: FastifyRequest<{ Params: { id: string; sportId: string } }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  await service.leaveSport(request.params.id, request.params.sportId);
  return reply.send({ success: true, message: 'Left sport' });
};

// ═══════════════════════════════════════════════════════
//  Student ↔ Creative Activity Handlers
// ═══════════════════════════════════════════════════════

export const createCreativeActivityHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateCreativeActivityInput }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const activity = await service.createCreativeActivity(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Creative activity added', data: activity });
};

export const getStudentCreativeActivitiesHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new SportCreativeService(request.server);
  const activities = await service.getStudentCreativeActivities(request.params.id);
  return reply.send({ success: true, data: activities });
};
