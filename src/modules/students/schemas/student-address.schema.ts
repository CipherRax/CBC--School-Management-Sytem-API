/**
 * Fastify JSON Schema — Student Address
 */

export const CreateStudentAddressSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      country:        { type: 'string', default: 'Kenya' },
      county:         { type: 'string' },
      sub_county:     { type: 'string' },
      ward:           { type: 'string' },
      location:       { type: 'string' },
      village:        { type: 'string' },
      postal_address: { type: 'string' },
      postal_code:    { type: 'string' },
      gps_lat:        { type: 'number' },
      gps_lng:        { type: 'number' },
    },
    additionalProperties: false,
  },
};

export const UpdateStudentAddressSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      country:        { type: 'string' },
      county:         { type: 'string' },
      sub_county:     { type: 'string' },
      ward:           { type: 'string' },
      location:       { type: 'string' },
      village:        { type: 'string' },
      postal_address: { type: 'string' },
      postal_code:    { type: 'string' },
      gps_lat:        { type: 'number' },
      gps_lng:        { type: 'number' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};
