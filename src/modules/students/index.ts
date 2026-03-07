
import type { FastifyInstance } from 'fastify';
import  CreateStudentSchema  from './student.schema.js';
import { registerStudentHandler, syncToKemisHandler } from './student.handlers.js';

export default async function studentModule(fastify: FastifyInstance) {
  // Local registration route
  fastify.post('/register', { schema: CreateStudentSchema }, registerStudentHandler);

  // Separate KEMIS registration route
  fastify.post('/kemis-sync', { schema: CreateStudentSchema }, syncToKemisHandler);
}