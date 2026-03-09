/**
 * Student Routes
 *
 * Registers all student endpoints with Fastify JSON Schema validation.
 * Mounted at /api/v1/students in app.ts.
 *
 * Endpoints:
 *   POST   /                           → admit new student
 *   GET    /                           → list students (paginated, filtered)
 *   GET    /search                     → search by name or admission number
 *   GET    /:id                        → get single student
 *   PATCH  /:id                        → update student
 *   DELETE /:id                        → soft-delete (discharge) student
 *   POST   /:id/address                → create student address
 *   GET    /:id/address                → get student address
 *   PATCH  /:id/address                → update student address
 *   POST   /:id/guardians              → add guardian
 *   GET    /:id/guardians              → list guardians
 *   PATCH  /:id/guardians/:guardianId  → update guardian
 *   DELETE /:id/guardians/:guardianId  → remove guardian
 *   POST   /:id/enroll                 → enroll student
 *   POST   /:id/promote                → promote student
 *   POST   /:id/transfer               → transfer student
 *   GET    /:id/enrollments            → enrollment history
 *   GET    /:id/enrollment/current     → current active enrollment
 *   POST   /:id/subjects               → enroll in subject
 *   GET    /:id/subjects               → list student subjects
 *   DELETE /:id/subjects/:subjectId    → drop subject
 *   POST   /:id/departments            → join department
 *   GET    /:id/departments            → list student departments
 *   DELETE /:id/departments/:departmentId → leave department
 *   POST   /:id/sports                 → join sport
 *   GET    /:id/sports                 → list student sports
 *   DELETE /:id/sports/:sportId        → leave sport
 *   POST   /:id/creative-activities    → add creative activity
 *   GET    /:id/creative-activities    → list creative activities
 *   POST   /:id/boarding               → assign boarding
 *   GET    /:id/boarding               → boarding history
 *   GET    /:id/boarding/current       → current boarding assignment
 *   PATCH  /:id/boarding/:assignmentId → update boarding assignment
 *   POST   /:id/grades                 → record grade
 *   GET    /:id/grades                 → list student grades
 *   PATCH  /:id/grades/:gradeId        → update grade
 *   DELETE //:id/grades/:gradeId       → delete grade
 *   POST   /:id/attendance             → record attendance
 *   GET    /:id/attendance             → list attendance
 *   PATCH  /:id/attendance/:attendanceId → update attendance
 *   DELETE /:id/attendance/:attendanceId → delete attendance
 *   POST   /:id/discipline             → create discipline record
 *   GET    /:id/discipline             → list discipline records
 *   PATCH  /:id/discipline/:recordId   → update discipline record
 *   DELETE /:id/discipline/:recordId   → delete discipline record
 *   POST   /:id/health                 → create health record
 *   GET    /:id/health                 → list health records
 *   PATCH  /:id/health/:recordId       → update health record
 *   DELETE /:id/health/:recordId       → delete health record
 *   POST   /:id/competitions           → create competition record
 *   GET    /:id/competitions           → list competition records
 *   PATCH  /:id/competitions/:recordId → update competition record
 *   DELETE /:id/competitions/:recordId → delete competition record
 *   POST   /:id/transfers              → create transfer record
 *   GET    /:id/transfers              → list transfer records
 *   PATCH  /:id/transfers/:recordId    → update transfer record
 *   DELETE /:id/transfers/:recordId    → delete transfer record
 *   POST   /:id/national-exams         → create national exam record
 *   GET    /:id/national-exams         → list national exam records
 *   PATCH  /:id/national-exams/:recordId → update national exam record
 *   DELETE /:id/national-exams/:recordId → delete national exam record
 *   POST   /:id/government-records     → create government record
 *   GET    /:id/government-records     → list government records
 *   PATCH  /:id/government-records/:recordId → update government record
 *   DELETE /:id/government-records/:recordId → delete government record
 */

import type { FastifyInstance } from 'fastify';
import CreateStudentSchema from './schemas/create-student.schema.js';
import UpdateStudentSchema from './schemas/update-student.schema.js';
import {
  CreateStudentAddressSchema,
  UpdateStudentAddressSchema,
} from './schemas/student-address.schema.js';
import {
  CreateGuardianSchema,
  UpdateGuardianSchema,
} from './schemas/student-guardian.schema.js';
import {
  EnrollStudentSchema,
  PromoteStudentSchema,
  TransferStudentSchema,
} from './schemas/enrollment.schema.js';
import {
  EnrollStudentSubjectSchema,
  JoinDepartmentSchema,
} from './schemas/department-subject.schema.js';
import {
  admitStudentHandler,
  getAllStudentsHandler,
  getStudentByIdHandler,
  updateStudentHandler,
  dischargeStudentHandler,
  searchStudentsHandler,
} from './core/student.handlers.js';
import {
  createAddressHandler,
  getAddressHandler,
  updateAddressHandler,
} from './address/student-address.handlers.js';
import {
  addGuardianHandler,
  getGuardiansHandler,
  updateGuardianHandler,
  removeGuardianHandler,
} from './guardian/student-guardian.handlers.js';
import {
  enrollStudentHandler,
  promoteStudentHandler,
  transferStudentHandler,
  getEnrollmentHistoryHandler,
  getCurrentEnrollmentHandler,
} from './enrollment/enrollment.handlers.js';
import {
  enrollStudentSubjectHandler,
  getStudentSubjectsHandler,
  dropStudentSubjectHandler,
  joinDepartmentHandler,
  getStudentDepartmentsHandler,
  leaveDepartmentHandler,
} from './department-subject/department-subject.handlers.js';
import {
  AssignLeadershipRoleSchema,
  UpdateLeadershipRoleSchema,
  JoinClubSchema,
} from './schemas/leadership-club.schema.js';
import {
  assignLeadershipRoleHandler,
  getStudentLeadershipRolesHandler,
  updateLeadershipRoleHandler,
  joinClubHandler,
  getStudentClubsHandler,
  leaveClubHandler,
} from './leadership-club/leadership-club.handlers.js';
import {
  JoinSportSchema,
  CreateCreativeActivitySchema,
} from './schemas/sport-creative.schema.js';
import {
  joinSportHandler,
  getStudentSportsHandler,
  leaveSportHandler,
  createCreativeActivityHandler,
  getStudentCreativeActivitiesHandler,
} from './sport-creative/sport-creative.handlers.js';
import {
  AssignBoardingSchema,
  UpdateBoardingSchema,
} from './schemas/boarding.schema.js';
import {
  assignBoardingHandler,
  getStudentBoardingHistoryHandler,
  getCurrentBoardingHandler,
  updateBoardingAssignmentHandler,
} from './boarding/boarding.handlers.js';
import {
  RecordGradeSchema,
  UpdateGradeSchema,
  RecordAttendanceSchema,
  UpdateAttendanceSchema,
} from './schemas/academic-performance.schema.js';
import {
  recordGradeHandler,
  getStudentGradesHandler,
  updateGradeHandler,
  deleteGradeHandler,
  recordAttendanceHandler,
  getStudentAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
} from './academic-performance/academic-performance.handlers.js';
import {
  CreateGovernmentRecordSchema, UpdateGovernmentRecordSchema,
  CreateNationalExamSchema, UpdateNationalExamSchema,
  CreateCompetitionSchema, UpdateCompetitionSchema,
  CreateDisciplineRecordSchema, UpdateDisciplineRecordSchema,
  CreateHealthRecordSchema, UpdateHealthRecordSchema,
  CreateTransferSchema, UpdateTransferSchema,
} from './schemas/advanced-records.schema.js';
import {
  createGovernmentRecordHandler, getGovernmentRecordsHandler, updateGovernmentRecordHandler, deleteGovernmentRecordHandler,
  createNationalExamHandler, getNationalExamsHandler, updateNationalExamHandler, deleteNationalExamHandler,
  createCompetitionHandler, getCompetitionsHandler, updateCompetitionHandler, deleteCompetitionHandler,
  createDisciplineRecordHandler, getDisciplineRecordsHandler, updateDisciplineRecordHandler, deleteDisciplineRecordHandler,
  createHealthRecordHandler, getHealthRecordsHandler, updateHealthRecordHandler, deleteHealthRecordHandler,
  createTransferHandler, getTransfersHandler, updateTransferHandler, deleteTransferHandler,
} from './advanced-records/advanced-records.handlers.js';

export default async function studentRoutes(fastify: FastifyInstance) {
  // ── Core Student CRUD ───────────────────────────────
  fastify.post('/', { schema: CreateStudentSchema }, admitStudentHandler);
  fastify.get('/', getAllStudentsHandler);
  fastify.get('/search', searchStudentsHandler);
  fastify.get('/:id', getStudentByIdHandler);
  fastify.patch('/:id', { schema: UpdateStudentSchema }, updateStudentHandler);
  fastify.delete('/:id', dischargeStudentHandler);

  // ── Student Address ─────────────────────────────────
  fastify.post('/:id/address', { schema: CreateStudentAddressSchema }, createAddressHandler);
  fastify.get('/:id/address', getAddressHandler);
  fastify.patch('/:id/address', { schema: UpdateStudentAddressSchema }, updateAddressHandler);

  // ── Student Guardians ───────────────────────────────
  fastify.post('/:id/guardians', { schema: CreateGuardianSchema }, addGuardianHandler);
  fastify.get('/:id/guardians', getGuardiansHandler);
  fastify.patch('/:id/guardians/:guardianId', { schema: UpdateGuardianSchema }, updateGuardianHandler);
  fastify.delete('/:id/guardians/:guardianId', removeGuardianHandler);

  // ── Academic Enrollment ─────────────────────────────
  fastify.post('/:id/enroll', { schema: EnrollStudentSchema }, enrollStudentHandler);
  fastify.post('/:id/promote', { schema: PromoteStudentSchema }, promoteStudentHandler);
  fastify.post('/:id/transfer', { schema: TransferStudentSchema }, transferStudentHandler);
  fastify.get('/:id/enrollments', getEnrollmentHistoryHandler);
  fastify.get('/:id/enrollment/current', getCurrentEnrollmentHandler);

  // ── Student ↔ Subject ───────────────────────────────
  fastify.post('/:id/subjects', { schema: EnrollStudentSubjectSchema }, enrollStudentSubjectHandler);
  fastify.get('/:id/subjects', getStudentSubjectsHandler);
  fastify.delete('/:id/subjects/:subjectId', dropStudentSubjectHandler);

  // ── Student ↔ Department ────────────────────────────
  fastify.post('/:id/departments', { schema: JoinDepartmentSchema }, joinDepartmentHandler);
  fastify.get('/:id/departments', getStudentDepartmentsHandler);
  fastify.delete('/:id/departments/:departmentId', leaveDepartmentHandler);

  // ── Student Leadership Roles ────────────────────────
  fastify.post('/:id/leadership-roles', { schema: AssignLeadershipRoleSchema }, assignLeadershipRoleHandler);
  fastify.get('/:id/leadership-roles', getStudentLeadershipRolesHandler);
  fastify.patch('/:id/leadership-roles/:roleId', { schema: UpdateLeadershipRoleSchema }, updateLeadershipRoleHandler);

  // ── Student ↔ Club ──────────────────────────────────
  fastify.post('/:id/clubs', { schema: JoinClubSchema }, joinClubHandler);
  fastify.get('/:id/clubs', getStudentClubsHandler);
  fastify.delete('/:id/clubs/:clubId', leaveClubHandler);

  // ── Student ↔ Sport ─────────────────────────────────
  fastify.post('/:id/sports', { schema: JoinSportSchema }, joinSportHandler);
  fastify.get('/:id/sports', getStudentSportsHandler);
  fastify.delete('/:id/sports/:sportId', leaveSportHandler);

  // ── Student ↔ Creative Activities ───────────────────
  fastify.post('/:id/creative-activities', { schema: CreateCreativeActivitySchema }, createCreativeActivityHandler);
  fastify.get('/:id/creative-activities', getStudentCreativeActivitiesHandler);

  // ── Student Boarding ────────────────────────────────
  fastify.post('/:id/boarding', { schema: AssignBoardingSchema }, assignBoardingHandler);
  fastify.get('/:id/boarding', getStudentBoardingHistoryHandler);
  fastify.get('/:id/boarding/current', getCurrentBoardingHandler);
  fastify.patch('/:id/boarding/:assignmentId', { schema: UpdateBoardingSchema }, updateBoardingAssignmentHandler);

  // ── Academic Performance (Grades) ───────────────────
  fastify.post('/:id/grades', { schema: RecordGradeSchema }, recordGradeHandler);
  fastify.get('/:id/grades', getStudentGradesHandler);
  fastify.patch('/:id/grades/:gradeId', { schema: UpdateGradeSchema }, updateGradeHandler);
  fastify.delete('/:id/grades/:gradeId', deleteGradeHandler);

  // ── Attendance Tracking ─────────────────────────────
  fastify.post('/:id/attendance', { schema: RecordAttendanceSchema }, recordAttendanceHandler);
  fastify.get('/:id/attendance', getStudentAttendanceHandler);
  fastify.patch('/:id/attendance/:attendanceId', { schema: UpdateAttendanceSchema }, updateAttendanceHandler);
  fastify.delete('/:id/attendance/:attendanceId', deleteAttendanceHandler);

  // ── Advanced Records ────────────────────────────────

  // Discipline
  fastify.post('/:id/discipline', { schema: CreateDisciplineRecordSchema }, createDisciplineRecordHandler);
  fastify.get('/:id/discipline', getDisciplineRecordsHandler);
  fastify.patch('/:id/discipline/:recordId', { schema: UpdateDisciplineRecordSchema }, updateDisciplineRecordHandler);
  fastify.delete('/:id/discipline/:recordId', deleteDisciplineRecordHandler);

  // Health
  fastify.post('/:id/health', { schema: CreateHealthRecordSchema }, createHealthRecordHandler);
  fastify.get('/:id/health', getHealthRecordsHandler);
  fastify.patch('/:id/health/:recordId', { schema: UpdateHealthRecordSchema }, updateHealthRecordHandler);
  fastify.delete('/:id/health/:recordId', deleteHealthRecordHandler);

  // Competitions
  fastify.post('/:id/competitions', { schema: CreateCompetitionSchema }, createCompetitionHandler);
  fastify.get('/:id/competitions', getCompetitionsHandler);
  fastify.patch('/:id/competitions/:recordId', { schema: UpdateCompetitionSchema }, updateCompetitionHandler);
  fastify.delete('/:id/competitions/:recordId', deleteCompetitionHandler);

  // Transfers
  fastify.post('/:id/transfers', { schema: CreateTransferSchema }, createTransferHandler);
  fastify.get('/:id/transfers', getTransfersHandler);
  fastify.patch('/:id/transfers/:recordId', { schema: UpdateTransferSchema }, updateTransferHandler);
  fastify.delete('/:id/transfers/:recordId', deleteTransferHandler);

  // National Exams
  fastify.post('/:id/national-exams', { schema: CreateNationalExamSchema }, createNationalExamHandler);
  fastify.get('/:id/national-exams', getNationalExamsHandler);
  fastify.patch('/:id/national-exams/:recordId', { schema: UpdateNationalExamSchema }, updateNationalExamHandler);
  fastify.delete('/:id/national-exams/:recordId', deleteNationalExamHandler);

  // Government Records
  fastify.post('/:id/government-records', { schema: CreateGovernmentRecordSchema }, createGovernmentRecordHandler);
  fastify.get('/:id/government-records', getGovernmentRecordsHandler);
  fastify.patch('/:id/government-records/:recordId', { schema: UpdateGovernmentRecordSchema }, updateGovernmentRecordHandler);
  fastify.delete('/:id/government-records/:recordId', deleteGovernmentRecordHandler);
}