/**
 * Student Module
 *
 * Fastify plugin that registers all student routes.
 * Mounted in app.ts via: fastify.register(studentModule, { prefix: '/api/v1/students' })
 */

import type { FastifyInstance } from 'fastify';
import studentRoutes from './student.routes.js';

export default async function studentModule(fastify: FastifyInstance) {
  fastify.register(studentRoutes);
}