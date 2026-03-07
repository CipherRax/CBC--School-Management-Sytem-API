

const CreateStudentSchema = {
  body: {
    type: 'object',
    required: [
      'firstName', 
      'secondName', 
      'age', 
      'gender', 
      'guardian_contact', 
      'address',
      'dateOfBirth'

    ],
    properties: {
      firstName: { type: 'string' },
      secondName: { type: 'string' },
      age: { type: 'number' },
      gender: { type: 'string', enum: ['male', 'female', 'other'] },
      guardian_contact: { type: 'string' },
      address: { type: 'string' },
      dateOfBirth: { type: 'string', format: 'date' }
    }
  }
};

export default CreateStudentSchema