/**
 * Advanced Student Records Handlers
 *
 * Endpoint handlers for 6 advanced student data models:
 *   - Government IDs
 *   - National Exams
 *   - Competitions
 *   - Discipline
 *   - Health
 *   - Transfers
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { AdvancedRecordsService } from './advanced-records.service.js';
import type {
  CreateGovernmentRecordInput, UpdateGovernmentRecordInput,
  CreateNationalExamInput, UpdateNationalExamInput,
  CreateCompetitionInput, UpdateCompetitionInput,
  CreateDisciplineRecordInput, UpdateDisciplineRecordInput,
  CreateHealthRecordInput, UpdateHealthRecordInput,
  CreateTransferInput, UpdateTransferInput,
} from '../types/advanced-records.types.js';

// ═══════════════════════════════════════════════════════
//  1. Government Records Handlers
// ═══════════════════════════════════════════════════════

export const createGovernmentRecordHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateGovernmentRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createGovernmentRecord(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Government record created', data: record });
};

export const getGovernmentRecordsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getGovernmentRecords(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateGovernmentRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateGovernmentRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateGovernmentRecord(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'Government record updated', data: record });
};

export const deleteGovernmentRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteGovernmentRecord(request.params.recordId);
  return reply.send({ success: true, message: 'Government record deleted' });
};

// ═══════════════════════════════════════════════════════
//  2. National Exams Handlers
// ═══════════════════════════════════════════════════════

export const createNationalExamHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateNationalExamInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createNationalExam(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'National exam record created', data: record });
};

export const getNationalExamsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getNationalExams(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateNationalExamHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateNationalExamInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateNationalExam(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'National exam record updated', data: record });
};

export const deleteNationalExamHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteNationalExam(request.params.recordId);
  return reply.send({ success: true, message: 'National exam record deleted' });
};

// ═══════════════════════════════════════════════════════
//  3. Competitions Handlers
// ═══════════════════════════════════════════════════════

export const createCompetitionHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateCompetitionInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createCompetition(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Competition record created', data: record });
};

export const getCompetitionsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getCompetitions(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateCompetitionHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateCompetitionInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateCompetition(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'Competition record updated', data: record });
};

export const deleteCompetitionHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteCompetition(request.params.recordId);
  return reply.send({ success: true, message: 'Competition record deleted' });
};

// ═══════════════════════════════════════════════════════
//  4. Discipline Records Handlers
// ═══════════════════════════════════════════════════════

export const createDisciplineRecordHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateDisciplineRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createDisciplineRecord(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Discipline record created', data: record });
};

export const getDisciplineRecordsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getDisciplineRecords(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateDisciplineRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateDisciplineRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateDisciplineRecord(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'Discipline record updated', data: record });
};

export const deleteDisciplineRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteDisciplineRecord(request.params.recordId);
  return reply.send({ success: true, message: 'Discipline record deleted' });
};

// ═══════════════════════════════════════════════════════
//  5. Health Records Handlers
// ═══════════════════════════════════════════════════════

export const createHealthRecordHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateHealthRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createHealthRecord(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Health record created', data: record });
};

export const getHealthRecordsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getHealthRecords(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateHealthRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateHealthRecordInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateHealthRecord(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'Health record updated', data: record });
};

export const deleteHealthRecordHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteHealthRecord(request.params.recordId);
  return reply.send({ success: true, message: 'Health record deleted' });
};

// ═══════════════════════════════════════════════════════
//  6. Student Transfers Handlers
// ═══════════════════════════════════════════════════════

export const createTransferHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateTransferInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.createTransfer(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Transfer record created', data: record });
};

export const getTransfersHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const records = await service.getTransfers(request.params.id);
  return reply.send({ success: true, data: records });
};

export const updateTransferHandler = async (
  request: FastifyRequest<{ Params: { recordId: string }; Body: UpdateTransferInput }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  const record = await service.updateTransfer(request.params.recordId, request.body);
  return reply.send({ success: true, message: 'Transfer record updated', data: record });
};

export const deleteTransferHandler = async (
  request: FastifyRequest<{ Params: { recordId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AdvancedRecordsService(request.server);
  await service.deleteTransfer(request.params.recordId);
  return reply.send({ success: true, message: 'Transfer record deleted' });
};
