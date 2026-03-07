import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentService } from './student.service.js';

export const registerStudentHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new StudentService(request.server);
  const result = await service.registerInLocalDB(request.body);
  return reply.code(201).send({ message: 'Student registered locally', data: result });
};

export const registerKemisHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new StudentService(request.server);
  const result = await service.registerInKEMIS(request.body);
  return reply.send({ message: 'KEMIS registration successful', kemis_ref: result.id });
};