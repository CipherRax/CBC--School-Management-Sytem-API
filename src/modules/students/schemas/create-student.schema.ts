/**
 * Fastify JSON Schema — Create Student
 *
 * Validates the request body when admitting a new student.
 * Fields match docs/system-data-modules/student-data-module.md Section 1.
 */

const CreateStudentSchema = {
  body: {
    type: 'object' as const,
    required: [
      'admission_number',
      'first_name',
      'last_name',
      'date_of_birth',
      'gender',
      'nationality',
      'date_admitted',
    ],
    properties: {
      upn:                      { type: 'string' },
      admission_number:         { type: 'string' },
      kcpe_index_number:        { type: 'string' },

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
      special_needs_flag:       { type: 'boolean', default: false },
      disability_type:          { type: 'string' },

      profile_photo_url:        { type: 'string', format: 'uri' },

      date_admitted:            { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object' as const,
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data:    { type: 'object' },
      },
    },
  },
};

export default CreateStudentSchema;
