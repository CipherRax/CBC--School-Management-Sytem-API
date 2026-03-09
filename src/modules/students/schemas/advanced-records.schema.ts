/**
 * Fastify JSON Schemas — Advanced Student Records
 */

// ── 1. Government Identification Schemas ───────────────

export const CreateGovernmentRecordSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    properties: {
      nemis_upi:                { type: 'string' },
      kemis_upi:                { type: 'string' },
      birth_certificate_number: { type: 'string' },
      huduma_namba:             { type: 'string' },
      national_id_number:       { type: 'string' },
      registered_by_school_id:  { type: 'string' },
      registration_date:        { type: 'string', format: 'date' },
      verification_status:      { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const UpdateGovernmentRecordSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    ...CreateGovernmentRecordSchema.body,
    minProperties: 1,
  },
};

// ── 2. National Examination Schemas ─────────────────────

export const CreateNationalExamSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    required: ['exam_type', 'index_number', 'registration_year'],
    properties: {
      exam_type:          { type: 'string', enum: ['KCPE', 'KCSE'] },
      index_number:       { type: 'string', minLength: 1 },
      registration_year:  { type: 'integer', minimum: 1900, maximum: 2100 },
      exam_center_code:   { type: 'string' },
      results_status:     { type: 'string' },
      mean_grade:         { type: 'string' },
      mean_points:        { type: 'integer', minimum: 0, maximum: 84 },
      certificate_number: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const UpdateNationalExamSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    type: 'object' as const,
    properties: CreateNationalExamSchema.body.properties,
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── 3. Competitions Participation Schemas ───────────────

export const CreateCompetitionSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    required: ['competition_name', 'level'],
    properties: {
      competition_name: { type: 'string', minLength: 1 },
      level:            { type: 'string', enum: ['school', 'county', 'regional', 'national'] },
      position:         { type: 'string' },
      award:            { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const UpdateCompetitionSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    type: 'object' as const,
    properties: CreateCompetitionSchema.body.properties,
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── 4. Discipline Records Schemas ───────────────────────

export const CreateDisciplineRecordSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    required: ['incident_type', 'description', 'incident_date'],
    properties: {
      incident_type:   { type: 'string', minLength: 1 },
      description:     { type: 'string', minLength: 1 },
      reported_by:     { type: 'string', format: 'uuid' },
      action_taken:    { type: 'string' },
      suspension_days: { type: 'integer', minimum: 0 },
      incident_date:   { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
};

export const UpdateDisciplineRecordSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    type: 'object' as const,
    properties: CreateDisciplineRecordSchema.body.properties,
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── 5. Health Records Schemas ───────────────────────────

// Typically Health Records are 1:1, so we might just use 'id' in params representing the student id.
// To keep symmetry with 1:N relations, we'll offer a create that can be used once, and an update.
export const CreateHealthRecordSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    properties: {
      blood_group:        { type: 'string' },
      allergies:          { type: 'string' },
      chronic_conditions: { type: 'string' },
      medical_notes:      { type: 'string' },
      last_checkup_date:  { type: 'string', format: 'date' },
      nhif_number:        { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const UpdateHealthRecordSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    ...CreateHealthRecordSchema.body,
    minProperties: 1,
  },
};

// ── 6. Student Transfers Schemas ────────────────────────

export const CreateTransferSchema = {
  params: { type: 'object' as const, required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
  body: {
    type: 'object' as const,
    properties: {
      from_school:     { type: 'string' },
      to_school:       { type: 'string' },
      transfer_reason: { type: 'string' },
      approval_status: { type: 'string' },
      transfer_date:   { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
};

export const UpdateTransferSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'recordId'],
    properties: { id: { type: 'string', format: 'uuid' }, recordId: { type: 'string', format: 'uuid' } },
  },
  body: {
    ...CreateTransferSchema.body,
    minProperties: 1,
  },
};
