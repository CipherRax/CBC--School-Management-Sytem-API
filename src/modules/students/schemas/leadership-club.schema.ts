/**
 * Fastify JSON Schemas — Leadership & Clubs
 */

// ── Leadership Role Schemas ─────────────────────────────

export const AssignLeadershipRoleSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['role'],
    properties: {
      role:          { type: 'string', minLength: 1 },
      department_id: { type: 'string', format: 'uuid' },
      date_assigned: { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
};

export const UpdateLeadershipRoleSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'roleId'],
    properties: {
      id:     { type: 'string', format: 'uuid' },
      roleId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      role:          { type: 'string', minLength: 1 },
      department_id: { type: 'string', format: 'uuid' },
      date_ended:    { type: 'string', format: 'date' },
      status:        { type: 'string', enum: ['active', 'completed'] },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Club Schemas ────────────────────────────────────────

export const CreateClubSchema = {
  body: {
    type: 'object' as const,
    required: ['name'],
    properties: {
      name:           { type: 'string', minLength: 1 },
      category:       { type: 'string', enum: ['Academic', 'Social', 'Religious', 'Community', 'Special Interest'] },
      teacher_patron: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateClubSchema = {
  params: {
    type: 'object' as const,
    required: ['clubId'],
    properties: {
      clubId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      name:           { type: 'string', minLength: 1 },
      category:       { type: 'string', enum: ['Academic', 'Social', 'Religious', 'Community', 'Special Interest'] },
      teacher_patron: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Student Club Membership ─────────────────────────────

export const JoinClubSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['club_id'],
    properties: {
      club_id: { type: 'string', format: 'uuid' },
      role:    { type: 'string', enum: ['member', 'secretary', 'chairperson', 'treasurer'], default: 'member' },
    },
    additionalProperties: false,
  },
};
