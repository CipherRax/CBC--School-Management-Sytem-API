/**
 * Fastify JSON Schemas — Academic Performance & Attendance
 */

// ── Student Grades Schemas ──────────────────────────────

export const RecordGradeSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['subject_id', 'exam_type', 'score', 'exam_date'],
    properties: {
      subject_id:      { type: 'string', format: 'uuid' },
      exam_id:         { type: 'string', format: 'uuid' },
      exam_type:       { type: 'string', enum: ['CAT', 'Midterm', 'Endterm', 'KCSE'] },
      score:           { type: 'number', minimum: 0, maximum: 100 },
      grade:           { type: 'string' },
      points:          { type: 'integer', minimum: 0, maximum: 12 },
      teacher_comment: { type: 'string' },
      exam_date:       { type: 'string', format: 'date' },
    },
    additionalProperties: false,
  },
};

export const UpdateGradeSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'gradeId'],
    properties: {
      id:      { type: 'string', format: 'uuid' },
      gradeId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      subject_id:      { type: 'string', format: 'uuid' },
      exam_id:         { type: 'string', format: 'uuid' },
      exam_type:       { type: 'string', enum: ['CAT', 'Midterm', 'Endterm', 'KCSE'] },
      score:           { type: 'number', minimum: 0, maximum: 100 },
      grade:           { type: 'string' },
      points:          { type: 'integer', minimum: 0, maximum: 12 },
      teacher_comment: { type: 'string' },
      exam_date:       { type: 'string', format: 'date' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

// ── Student Attendance Schemas ──────────────────────────

export const RecordAttendanceSchema = {
  params: {
    type: 'object' as const,
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['date', 'session', 'status'],
    properties: {
      date:                { type: 'string', format: 'date' },
      session:             { type: 'string', enum: ['morning', 'afternoon', 'full_day'] },
      status:              { type: 'string', enum: ['present', 'absent', 'sick', 'suspended'] },
      remarks:             { type: 'string' },
      recorded_by_teacher: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const UpdateAttendanceSchema = {
  params: {
    type: 'object' as const,
    required: ['id', 'attendanceId'],
    properties: {
      id:           { type: 'string', format: 'uuid' },
      attendanceId: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      date:                { type: 'string', format: 'date' },
      session:             { type: 'string', enum: ['morning', 'afternoon', 'full_day'] },
      status:              { type: 'string', enum: ['present', 'absent', 'sick', 'suspended'] },
      remarks:             { type: 'string' },
      recorded_by_teacher: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};
