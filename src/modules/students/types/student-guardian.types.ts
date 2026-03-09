/**
 * Student Guardian Types
 *
 * Matches docs/system-data-modules/student-data-module.md §3
 */

export type GuardianType = 'father' | 'mother' | 'guardian' | 'sponsor';

export interface StudentGuardian {
  id: string;
  student_id: string;

  guardian_type: GuardianType;

  first_name: string;
  last_name: string;

  phone_number: string;
  alternative_phone: string | null;
  email: string | null;

  national_id: string | null;

  occupation: string | null;
  employer: string | null;

  relationship_to_student: string | null;

  is_primary_contact: boolean;
  is_fee_payer: boolean;

  address_id: string | null;

  created_at: string;
}

export interface CreateGuardianInput {
  guardian_type: GuardianType;

  first_name: string;
  last_name: string;

  phone_number: string;
  alternative_phone?: string | null;
  email?: string | null;

  national_id?: string | null;

  occupation?: string | null;
  employer?: string | null;

  relationship_to_student?: string | null;

  is_primary_contact?: boolean;
  is_fee_payer?: boolean;

  address_id?: string | null;
}

export type UpdateGuardianInput = Partial<CreateGuardianInput>;
