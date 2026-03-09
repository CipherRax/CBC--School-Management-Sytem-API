/**
 * Department & Subject Handlers
 *
 * Endpoint handlers for:
 *   - Department CRUD
 *   - Subject CRUD
 *   - Student ↔ Subject enrollment
 *   - Student ↔ Department membership
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { DepartmentSubjectService } from './department-subject.service.js';
import type { CreateDepartmentInput, UpdateDepartmentInput, CreateStudentDepartmentInput } from '../types/department.types.js';
import type { CreateSubjectInput, UpdateSubjectInput, CreateStudentSubjectInput } from '../types/subject.types.js';

// ═══════════════════════════════════════════════════════
//  Department Handlers
// ═══════════════════════════════════════════════════════

export const createDepartmentHandler = async (
  request: FastifyRequest<{ Body: CreateDepartmentInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const dept = await service.createDepartment(request.body);
  return reply.code(201).send({ success: true, message: 'Department created', data: dept });
};

export const getAllDepartmentsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const departments = await service.getAllDepartments();
  return reply.send({ success: true, data: departments });
};

export const updateDepartmentHandler = async (
  request: FastifyRequest<{ Params: { departmentId: string }; Body: UpdateDepartmentInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const dept = await service.updateDepartment(request.params.departmentId, request.body);
  return reply.send({ success: true, message: 'Department updated', data: dept });
};

export const deleteDepartmentHandler = async (
  request: FastifyRequest<{ Params: { departmentId: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  await service.deleteDepartment(request.params.departmentId);
  return reply.send({ success: true, message: 'Department deleted' });
};

// ═══════════════════════════════════════════════════════
//  Subject Handlers
// ═══════════════════════════════════════════════════════

export const createSubjectHandler = async (
  request: FastifyRequest<{ Body: CreateSubjectInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const subject = await service.createSubject(request.body);
  return reply.code(201).send({ success: true, message: 'Subject created', data: subject });
};

export const getAllSubjectsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const subjects = await service.getAllSubjects();
  return reply.send({ success: true, data: subjects });
};

export const updateSubjectHandler = async (
  request: FastifyRequest<{ Params: { subjectId: string }; Body: UpdateSubjectInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const subject = await service.updateSubject(request.params.subjectId, request.body);
  return reply.send({ success: true, message: 'Subject updated', data: subject });
};

export const deleteSubjectHandler = async (
  request: FastifyRequest<{ Params: { subjectId: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  await service.deleteSubject(request.params.subjectId);
  return reply.send({ success: true, message: 'Subject deleted' });
};

// ═══════════════════════════════════════════════════════
//  Student ↔ Subject Handlers
// ═══════════════════════════════════════════════════════

export const enrollStudentSubjectHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateStudentSubjectInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const subject = await service.enrollStudentInSubject(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Student enrolled in subject', data: subject });
};

export const getStudentSubjectsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const subjects = await service.getStudentSubjects(request.params.id);
  return reply.send({ success: true, data: subjects });
};

export const dropStudentSubjectHandler = async (
  request: FastifyRequest<{ Params: { id: string; subjectId: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  await service.dropStudentSubject(request.params.id, request.params.subjectId);
  return reply.send({ success: true, message: 'Subject dropped' });
};

// ═══════════════════════════════════════════════════════
//  Student ↔ Department Handlers
// ═══════════════════════════════════════════════════════

export const joinDepartmentHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateStudentDepartmentInput }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const membership = await service.joinDepartment(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Joined department', data: membership });
};

export const getStudentDepartmentsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  const departments = await service.getStudentDepartments(request.params.id);
  return reply.send({ success: true, data: departments });
};

export const leaveDepartmentHandler = async (
  request: FastifyRequest<{ Params: { id: string; departmentId: string } }>,
  reply: FastifyReply,
) => {
  const service = new DepartmentSubjectService(request.server);
  await service.leaveDepartment(request.params.id, request.params.departmentId);
  return reply.send({ success: true, message: 'Left department' });
};
