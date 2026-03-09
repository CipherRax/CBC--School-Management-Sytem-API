/**
 * Fastify JSON Schemas — Departments & Subjects
 */

// ── Department Schemas ──────────────────────────────────

export const CreateDepartmentSchema = {
  body: {
    type: 'object' as const,
    required: ['name'],
    properties: {
      name:               { type: 'string', minLength: 1 },
      description:        { type: 'string' },
      head_of_department: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateDepartmentSchema = {
  params: {
    type: 'object' as const,
    required: ['departmentId'],
    properties: {
      departmentId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      name:               { type: 'string', minLength: 1 },
      description:        { type: 'string' },
      head_of_department: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Subject Schemas ─────────────────────────────────────

export const CreateSubjectSchema = {
  body: {
    type: 'object' as const,
    required: ['name'],
    properties: {
      name:          { type: 'string', minLength: 1 },
      department_id: { type: 'string', format: 'uuid' },
      subject_code:  { type: 'string' },
      is_compulsory: { type: 'boolean', default: false },
    },
    additionalProperties: false,
  },
};

export const UpdateSubjectSchema = {
  params: {
    type: 'object' as const,
    required: ['subjectId'],
    properties: {
      subjectId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      name:          { type: 'string', minLength: 1 },
      department_id: { type: 'string', format: 'uuid' },
      subject_code:  { type: 'string' },
      is_compulsory: { type: 'boolean' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Student Subject Enrollment ──────────────────────────

export const EnrollStudentSubjectSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['subject_id'],
    properties: {
      subject_id:       { type: 'string', format: 'uuid' },
      is_compulsory:    { type: 'boolean', default: false },
      subject_category: { type: 'string', enum: ['COMPULSORY', 'SCIENCES', 'HUMANITIES', 'BUSINESS', 'TECHNICAL'] },
      teacher_id:       { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

// ── Student Department Membership ───────────────────────

export const JoinDepartmentSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['department_id'],
    properties: {
      department_id: { type: 'string', format: 'uuid' },
      role:          { type: 'string', enum: ['member', 'representative', 'assistant', 'leader'], default: 'member' },
    },
    additionalProperties: false,
  },
};
