/**
 * Student Guardian Handlers
 *
 * Endpoint handlers for student-guardian relationship operations.
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentGuardianService } from './student-guardian.service.js';
import type { CreateGuardianInput, UpdateGuardianInput } from '../types/student-guardian.types.js';

// ── POST /students/:id/guardians ────────────────────────

export const addGuardianHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateGuardianInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentGuardianService(request.server);
  const guardian = await service.addGuardian(request.params.id, request.body);
  return reply.code(201).send({
    success: true,
    message: 'Guardian added successfully',
    data: guardian,
  });
};

// ── GET /students/:id/guardians ─────────────────────────

export const getGuardiansHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentGuardianService(request.server);
  const guardians = await service.getGuardians(request.params.id);
  return reply.send({ success: true, data: guardians });
};

// ── PATCH /students/:id/guardians/:guardianId ───────────

export const updateGuardianHandler = async (
  request: FastifyRequest<{ Params: { id: string; guardianId: string }; Body: UpdateGuardianInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentGuardianService(request.server);
  const guardian = await service.updateGuardian(request.params.guardianId, request.body);
  return reply.send({
    success: true,
    message: 'Guardian updated successfully',
    data: guardian,
  });
};

// ── DELETE /students/:id/guardians/:guardianId ──────────

export const removeGuardianHandler = async (
  request: FastifyRequest<{ Params: { id: string; guardianId: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentGuardianService(request.server);
  await service.removeGuardian(request.params.guardianId);
  return reply.send({
    success: true,
    message: 'Guardian removed successfully',
  });
};
