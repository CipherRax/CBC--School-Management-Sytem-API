/**
 * Academic Routes
 *
 * Standalone routes for managing shared academic resources.
 * These are not nested under /students because they are shared entities.
 *
 * Mounted at /api/v1/academics in app.ts.
 *
 * Endpoints:
 *   POST   /departments                → create department
 *   GET    /departments                → list all departments
 *   PATCH  /departments/:departmentId  → update department
 *   DELETE /departments/:departmentId  → delete department
 *   POST   /subjects                   → create subject
 *   GET    /subjects                   → list all subjects
 *   PATCH  /subjects/:subjectId        → update subject
 *   DELETE /subjects/:subjectId        → delete subject
 *   POST   /clubs                      → create club
 *   GET    /clubs                      → list all clubs
 *   PATCH  /clubs/:clubId              → update club
 *   DELETE /clubs/:clubId              → delete club
 *   POST   /sports                     → create sport
 *   GET    /sports                     → list all sports
 *   PATCH  /sports/:sportId            → update sport
 *   DELETE /sports/:sportId            → delete sport
 *   POST   /dormitories                → create dormitory
 *   GET    /dormitories                → list all dormitories
 *   PATCH  /dormitories/:dormitoryId   → update dormitory
 *   DELETE /dormitories/:dormitoryId   → delete dormitory
 */

import type { FastifyInstance } from 'fastify';
import {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
  CreateSubjectSchema,
  UpdateSubjectSchema,
} from './schemas/department-subject.schema.js';
import {
  CreateClubSchema,
  UpdateClubSchema,
} from './schemas/leadership-club.schema.js';
import {
  createDepartmentHandler,
  getAllDepartmentsHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
  createSubjectHandler,
  getAllSubjectsHandler,
  updateSubjectHandler,
  deleteSubjectHandler,
} from './department-subject/department-subject.handlers.js';
import {
  createClubHandler,
  getAllClubsHandler,
  updateClubHandler,
  deleteClubHandler,
} from './leadership-club/leadership-club.handlers.js';
import {
  CreateSportSchema,
  UpdateSportSchema,
} from './schemas/sport-creative.schema.js';
import {
  createSportHandler,
  getAllSportsHandler,
  updateSportHandler,
  deleteSportHandler,
} from './sport-creative/sport-creative.handlers.js';
import {
  CreateDormitorySchema,
  UpdateDormitorySchema,
} from './schemas/boarding.schema.js';
import {
  createDormitoryHandler,
  getAllDormitoriesHandler,
  updateDormitoryHandler,
  deleteDormitoryHandler,
} from './boarding/boarding.handlers.js';

export default async function academicRoutes(fastify: FastifyInstance) {
  // ── Departments ─────────────────────────────────────
  fastify.post('/departments', { schema: CreateDepartmentSchema }, createDepartmentHandler);
  fastify.get('/departments', getAllDepartmentsHandler);
  fastify.patch('/departments/:departmentId', { schema: UpdateDepartmentSchema }, updateDepartmentHandler);
  fastify.delete('/departments/:departmentId', deleteDepartmentHandler);

  // ── Subjects ────────────────────────────────────────
  fastify.post('/subjects', { schema: CreateSubjectSchema }, createSubjectHandler);
  fastify.get('/subjects', getAllSubjectsHandler);
  fastify.patch('/subjects/:subjectId', { schema: UpdateSubjectSchema }, updateSubjectHandler);
  fastify.delete('/subjects/:subjectId', deleteSubjectHandler);

  // ── Clubs ───────────────────────────────────────────
  fastify.post('/clubs', { schema: CreateClubSchema }, createClubHandler);
  fastify.get('/clubs', getAllClubsHandler);
  fastify.patch('/clubs/:clubId', { schema: UpdateClubSchema }, updateClubHandler);
  fastify.delete('/clubs/:clubId', deleteClubHandler);

  // ── Sports ──────────────────────────────────────────
  fastify.post('/sports', { schema: CreateSportSchema }, createSportHandler);
  fastify.get('/sports', getAllSportsHandler);
  fastify.patch('/sports/:sportId', { schema: UpdateSportSchema }, updateSportHandler);
  fastify.delete('/sports/:sportId', deleteSportHandler);

  // ── Dormitories ─────────────────────────────────────
  fastify.post('/dormitories', { schema: CreateDormitorySchema }, createDormitoryHandler);
  fastify.get('/dormitories', getAllDormitoriesHandler);
  fastify.patch('/dormitories/:dormitoryId', { schema: UpdateDormitorySchema }, updateDormitoryHandler);
  fastify.delete('/dormitories/:dormitoryId', deleteDormitoryHandler);
}
