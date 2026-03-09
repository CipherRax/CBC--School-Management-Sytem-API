/**
 * Fastify JSON Schemas — Student Enrollment
 *
 * Validates request bodies for enroll, promote, and transfer operations.
 */

const classLevelEnum = ['Form1', 'Form2', 'Form3', 'Form4'];

export const EnrollStudentSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['academic_year', 'term', 'class_level'],
    properties: {
      school_id:         { type: 'string', format: 'uuid' },
      academic_year:     { type: 'string', minLength: 4 },
      term:              { type: 'string', minLength: 1 },
      class_level:       { type: 'string', enum: classLevelEnum },
      stream:            { type: 'string' },
      class_teacher_id:  { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const PromoteStudentSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['academic_year', 'term', 'class_level'],
    properties: {
      academic_year:     { type: 'string', minLength: 4 },
      term:              { type: 'string', minLength: 1 },
      class_level:       { type: 'string', enum: classLevelEnum },
      stream:            { type: 'string' },
      class_teacher_id:  { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const TransferStudentSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['academic_year', 'term', 'class_level'],
    properties: {
      to_school:         { type: 'string' },
      academic_year:     { type: 'string', minLength: 4 },
      term:              { type: 'string', minLength: 1 },
      class_level:       { type: 'string', enum: classLevelEnum },
      stream:            { type: 'string' },
      transfer_reason:   { type: 'string' },
    },
    additionalProperties: false,
  },
};
