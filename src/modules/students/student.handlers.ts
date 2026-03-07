import type { FastifyReply, FastifyRequest } from 'fastify';
import { StudentService } from './student.service.js';
import { KemisService } from './kemis.service.js';

export const registerStudentHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new StudentService(request.server);
  
  const { 
    firstName, 
    secondName, 
    age, 
    gender, 
    guardian_contact, 
    address, 
    dateOfBirth 
  } = request.body as any;

  const dbData = {
    // These keys MUST match the columns in your Supabase 'students' table
    first_name: firstName,
    second_name: secondName,
    age: age,
    gender: gender,
    guardian_contact: guardian_contact,
    address: address,
    date_of_birth: dateOfBirth 
  };

  try {
    const result = await service.registerInLocalDB(dbData);
    return reply.code(201).send({ success: true, data: result });
  } catch (error: any) {
    // This will help us see if it's a DB constraint or a Cache issue
    request.log.error(error); 
    return reply.code(500).send({ error: 'Database Error', message: error.message });
  }
};


export const registerKemisHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new StudentService(request.server);
  const result = await service.registerInKEMIS(request.body);
  return reply.send({ message: 'KEMIS registration successful', kemis_ref: result.id });
};


export const syncToKemisHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const kemisService = new KemisService();
  
  try {
    // You can either pass the body directly or fetch the student from your DB first
    const result = await kemisService.registerStudent(request.body);
    
    return reply.send({
      success: true,
      message: 'Student synced with KEMIS successfully',
      kemis_data: result
    });
  } catch (error: any) {
    return reply.code(502).send({ 
      error: 'KEMIS Integration Error', 
      message: error.message 
    });
  }
};