/**
 * Leadership & Club Handlers
 *
 * Endpoint handlers for:
 *   - Student leadership role assignment
 *   - Club CRUD
 *   - Student club membership
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { LeadershipClubService } from './leadership-club.service.js';
import type {
  CreateLeadershipRoleInput,
  UpdateLeadershipRoleInput,
  CreateClubInput,
  UpdateClubInput,
  JoinClubInput,
} from '../types/leadership-club.types.js';

// ═══════════════════════════════════════════════════════
//  Leadership Role Handlers
// ═══════════════════════════════════════════════════════

export const assignLeadershipRoleHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateLeadershipRoleInput }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const role = await service.assignRole(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Leadership role assigned', data: role });
};

export const getStudentLeadershipRolesHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const roles = await service.getStudentLeadershipRoles(request.params.id);
  return reply.send({ success: true, data: roles });
};

export const updateLeadershipRoleHandler = async (
  request: FastifyRequest<{ Params: { id: string; roleId: string }; Body: UpdateLeadershipRoleInput }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const role = await service.updateLeadershipRole(request.params.roleId, request.body);
  return reply.send({ success: true, message: 'Leadership role updated', data: role });
};

// ═══════════════════════════════════════════════════════
//  Club CRUD Handlers
// ═══════════════════════════════════════════════════════

export const createClubHandler = async (
  request: FastifyRequest<{ Body: CreateClubInput }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const club = await service.createClub(request.body);
  return reply.code(201).send({ success: true, message: 'Club created', data: club });
};

export const getAllClubsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const clubs = await service.getAllClubs();
  return reply.send({ success: true, data: clubs });
};

export const updateClubHandler = async (
  request: FastifyRequest<{ Params: { clubId: string }; Body: UpdateClubInput }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const club = await service.updateClub(request.params.clubId, request.body);
  return reply.send({ success: true, message: 'Club updated', data: club });
};

export const deleteClubHandler = async (
  request: FastifyRequest<{ Params: { clubId: string } }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  await service.deleteClub(request.params.clubId);
  return reply.send({ success: true, message: 'Club deleted' });
};

// ═══════════════════════════════════════════════════════
//  Student ↔ Club Membership Handlers
// ═══════════════════════════════════════════════════════

export const joinClubHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: JoinClubInput }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const membership = await service.joinClub(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Joined club', data: membership });
};

export const getStudentClubsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  const clubs = await service.getStudentClubs(request.params.id);
  return reply.send({ success: true, data: clubs });
};

export const leaveClubHandler = async (
  request: FastifyRequest<{ Params: { id: string; clubId: string } }>,
  reply: FastifyReply,
) => {
  const service = new LeadershipClubService(request.server);
  await service.leaveClub(request.params.id, request.params.clubId);
  return reply.send({ success: true, message: 'Left club' });
};
