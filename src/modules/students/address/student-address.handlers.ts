/**
 * Student Address Handlers
 *
 * Endpoint handlers for student address operations.
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentAddressService } from './student-address.service.js';
import type { CreateStudentAddressInput, UpdateStudentAddressInput } from '../types/student-address.types.js';

// ── POST /students/:id/address ──────────────────────────

export const createAddressHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateStudentAddressInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentAddressService(request.server);
  const address = await service.createAddress(request.params.id, request.body);
  return reply.code(201).send({
    success: true,
    message: 'Student address created successfully',
    data: address,
  });
};

// ── GET /students/:id/address ───────────────────────────

export const getAddressHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new StudentAddressService(request.server);
  const address = await service.getAddress(request.params.id);
  return reply.send({ success: true, data: address });
};

// ── PATCH /students/:id/address ─────────────────────────

export const updateAddressHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateStudentAddressInput }>,
  reply: FastifyReply,
) => {
  const service = new StudentAddressService(request.server);
  const address = await service.updateAddress(request.params.id, request.body);
  return reply.send({
    success: true,
    message: 'Student address updated successfully',
    data: address,
  });
};
