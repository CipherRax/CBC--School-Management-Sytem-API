/**
 * Student Address Types
 *
 * Matches docs/system-data-modules/student-data-module.md §4
 */

export interface StudentAddress {
  id: string;
  student_id: string;

  country: string;
  county: string | null;
  sub_county: string | null;
  ward: string | null;
  location: string | null;
  village: string | null;

  postal_address: string | null;
  postal_code: string | null;

  gps_lat: number | null;
  gps_lng: number | null;

  created_at: string;
  updated_at: string;
}

export interface CreateStudentAddressInput {
  country?: string;
  county?: string | null;
  sub_county?: string | null;
  ward?: string | null;
  location?: string | null;
  village?: string | null;
  postal_address?: string | null;
  postal_code?: string | null;
  gps_lat?: number | null;
  gps_lng?: number | null;
}

export type UpdateStudentAddressInput = Partial<CreateStudentAddressInput>;
