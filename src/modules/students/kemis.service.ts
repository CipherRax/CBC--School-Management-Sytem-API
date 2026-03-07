import axios from 'axios';

export class KemisService {
  private readonly apiUrl = process.env.KEMIS_API_URL;
  private readonly apiKey = process.env.KEMIS_API_KEY;

  async registerStudent(studentData: any) {
    try {
      // Mapping your local data to KEMIS expected fields
      const kemisPayload = {
        first_name: studentData.firstName,
        last_name: studentData.secondName,
        dob: studentData.dateOfBirth,
        gender: studentData.gender.toUpperCase(),
        parent_phone: studentData.guardian_contact,
        // KEMIS often uses UPI or birth certificate numbers
        upi_number: studentData.upi || null 
      };

      const response = await axios.post(`${this.apiUrl}/learner/register`, kemisPayload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      // Log the specific error from KEMIS for debugging
      console.error('KEMIS API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to sync with KEMIS');
    }
  }
}