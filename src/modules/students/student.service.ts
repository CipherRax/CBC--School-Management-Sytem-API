import type { FastifyInstance } from 'fastify';
import axios from 'axios';

export class StudentService {
  constructor(private fastify: FastifyInstance) {}

  // 1. Local Database Registration
  async registerInLocalDB(studentData: any) {
    const { data, error } = await this.fastify.supabase
      .from('students')
      .insert([studentData])
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  // 2. KEMIS External Registration
  async registerInKEMIS(studentData: any) {
    //TODO: Map studentData to KEMIS required format if necessary
    // KEMIS usually requires a specific format or Auth header
    const response = await axios.post(process.env.KEMIS_API_URL!, studentData, {
      headers: { 'Authorization': `Bearer ${process.env.KEMIS_API_KEY}` }
    });
    
    return response.data;
  }
}