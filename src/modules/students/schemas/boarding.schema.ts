/**
 * Fastify JSON Schemas — Boarding & Dormitory
 */

// ── Dormitory CRUD Schemas ──────────────────────────────

export const CreateDormitorySchema = {
  body: {
    type: 'object' as const,
    required: ['name'],
    properties: {
      name:         { type: 'string', minLength: 1 },
      capacity:     { type: 'integer', minimum: 1 },
      house_master: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateDormitorySchema = {
  params: {
    type: 'object' as const,
    required: ['dormitoryId'],
    properties: {
      dormitoryId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      name:         { type: 'string', minLength: 1 },
      capacity:     { type: 'integer', minimum: 1 },
      house_master: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Student Boarding Assignment Schemas ──────────────────

export const AssignBoardingSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['dormitory_id'],
    properties: {
      dormitory_id:  { type: 'string', format: 'uuid' },
      house_id:      { type: 'string', format: 'uuid' },
      bed_number:    { type: 'string', minLength: 1 },
      date_assigned: { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
};

export const UpdateBoardingSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'assignmentId'],
    properties: {
      id:           { type: 'string', format: 'uuid' },
      assignmentId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      dormitory_id:  { type: 'string', format: 'uuid' },
      house_id:      { type: 'string', format: 'uuid' },
      bed_number:    { type: 'string', minLength: 1 },
      date_released: { type: 'string', format: 'date' },
      status:        { type: 'string', enum: ['active', 'moved', 'completed'] },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};
