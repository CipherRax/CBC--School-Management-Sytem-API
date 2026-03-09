/**
 * Fastify JSON Schema — Update Student
 *
 * Validates the request body when updating an existing student.
 * All fields are optional (partial update / PATCH semantics).
 */

const UpdateStudentSchema = {
  body: {
    type: 'object' as const,
    properties: {
      upn:                      { type: 'string' },
      admission_number:         { type: 'string' },
      kcpe_index_number:        { type: 'string' },
      kcse_index_number:        { type: 'string' },

      first_name:               { type: 'string', minLength: 1 },
      middle_name:              { type: 'string' },
      last_name:                { type: 'string', minLength: 1 },

      date_of_birth:            { type: 'string', format: 'date' },
      gender:                   { type: 'string', enum: ['male', 'female', 'other'] },

      nationality:              { type: 'string', minLength: 1 },
      birth_certificate_number: { type: 'string' },
      national_id_number:       { type: 'string' },
      passport_number:          { type: 'string' },

      religion:                 { type: 'string' },
      special_needs_flag:       { type: 'boolean' },
      disability_type:          { type: 'string' },

      profile_photo_url:        { type: 'string', format: 'uri' },

      status:                   { type: 'string', enum: ['active', 'transferred', 'suspended', 'graduated', 'withdrawn', 'deceased'] },

      date_admitted:            { type: 'string', format: 'date' },
      date_graduated:           { type: 'string', format: 'date' },
    },
    additionalProperties: false,
    minProperties: 1,       // At least one field must be provided
  },
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data:    { type: 'object' },
      },
    },
  },
};

export default UpdateStudentSchema;
