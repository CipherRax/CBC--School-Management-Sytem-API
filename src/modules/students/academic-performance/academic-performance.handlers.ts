/**
 * Academic Performance & Attendance Handlers
 *
 * Endpoint handlers for:
 *   - Recording student grades
 *   - Recording student attendance
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import { AcademicPerformanceService } from './academic-performance.service.js';
import type {
  RecordGradeInput,
  UpdateGradeInput,
  RecordAttendanceInput,
  UpdateAttendanceInput,
} from '../types/academic-performance.types.js';

// ═══════════════════════════════════════════════════════
//  Student Grades Handlers
// ═══════════════════════════════════════════════════════

export const recordGradeHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: RecordGradeInput }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const grade = await service.recordGrade(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Grade recorded', data: grade });
};

export const getStudentGradesHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const grades = await service.getStudentGrades(request.params.id);
  return reply.send({ success: true, data: grades });
};

export const updateGradeHandler = async (
  request: FastifyRequest<{ Params: { id: string; gradeId: string }; Body: UpdateGradeInput }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const grade = await service.updateGrade(request.params.gradeId, request.body);
  return reply.send({ success: true, message: 'Grade updated', data: grade });
};

export const deleteGradeHandler = async (
  request: FastifyRequest<{ Params: { id: string; gradeId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  await service.deleteGrade(request.params.gradeId);
  return reply.send({ success: true, message: 'Grade deleted' });
};

// ═══════════════════════════════════════════════════════
//  Student Attendance Handlers
// ═══════════════════════════════════════════════════════

export const recordAttendanceHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: RecordAttendanceInput }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const attendance = await service.recordAttendance(request.params.id, request.body);
  return reply.code(201).send({ success: true, message: 'Attendance recorded', data: attendance });
};

export const getStudentAttendanceHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const attendanceRecords = await service.getStudentAttendance(request.params.id);
  return reply.send({ success: true, data: attendanceRecords });
};

export const updateAttendanceHandler = async (
  request: FastifyRequest<{ Params: { id: string; attendanceId: string }; Body: UpdateAttendanceInput }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  const attendance = await service.updateAttendance(request.params.attendanceId, request.body);
  return reply.send({ success: true, message: 'Attendance updated', data: attendance });
};

export const deleteAttendanceHandler = async (
  request: FastifyRequest<{ Params: { id: string; attendanceId: string } }>,
  reply: FastifyReply,
) => {
  const service = new AcademicPerformanceService(request.server);
  await service.deleteAttendance(request.params.attendanceId);
  return reply.send({ success: true, message: 'Attendance deleted' });
};
