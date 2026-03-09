/**
 * Fastify JSON Schemas — Sports & Creative Activities
 */

// ── Sport CRUD Schemas ──────────────────────────────────

export const CreateSportSchema = {
  body: {
    type: 'object' as const,
    required: ['name', 'category'],
    properties: {
      name:     { type: 'string', minLength: 1 },
      category: { type: 'string', enum: ['team', 'individual'] },
      coach_id: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateSportSchema = {
  params: {
    type: 'object' as const,
    required: ['sportId'],
    properties: {
      sportId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      name:     { type: 'string', minLength: 1 },
      category: { type: 'string', enum: ['team', 'individual'] },
      coach_id: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Student Sport Participation ──────────────────────────

export const JoinSportSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['sport_id'],
    properties: {
      sport_id: { type: 'string', format: 'uuid' },
      position: { type: 'string', minLength: 1 },
      coach_id: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

// ── Creative Activities ──────────────────────────────────

export const CreateCreativeActivitySchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['activity_type'],
    properties: {
      activity_type:     { type: 'string', enum: ['Drama', 'Music', 'Choir', 'Dance', 'Poetry', 'Film', 'Art'] },
      competition_level: { type: 'string', enum: ['school', 'county', 'regional', 'national'] },
    },
    additionalProperties: false,
  },
};
