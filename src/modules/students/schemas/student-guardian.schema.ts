/**
 * Fastify JSON Schemas — Student Guardian
 */

export const CreateGuardianSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['guardian_type', 'first_name', 'last_name', 'phone_number'],
    properties: {
      guardian_type:            { type: 'string', enum: ['father', 'mother', 'guardian', 'sponsor'] },

      first_name:              { type: 'string', minLength: 1 },
      last_name:               { type: 'string', minLength: 1 },

      phone_number:            { type: 'string', minLength: 1 },
      alternative_phone:       { type: 'string' },
      email:                   { type: 'string', format: 'email' },

      national_id:             { type: 'string' },

      occupation:              { type: 'string' },
      employer:                { type: 'string' },

      relationship_to_student: { type: 'string' },

      is_primary_contact:      { type: 'boolean', default: false },
      is_fee_payer:            { type: 'boolean', default: false },

      address_id:              { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateGuardianSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'guardianId'],
    properties: {
      id:         { type: 'string', format: 'uuid' },
      guardianId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      guardian_type:            { type: 'string', enum: ['father', 'mother', 'guardian', 'sponsor'] },

      first_name:              { type: 'string', minLength: 1 },
      last_name:               { type: 'string', minLength: 1 },

      phone_number:            { type: 'string', minLength: 1 },
      alternative_phone:       { type: 'string' },
      email:                   { type: 'string', format: 'email' },

      national_id:             { type: 'string' },

      occupation:              { type: 'string' },
      employer:                { type: 'string' },

      relationship_to_student: { type: 'string' },

      is_primary_contact:      { type: 'boolean' },
      is_fee_payer:            { type: 'boolean' },

      address_id:              { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};
