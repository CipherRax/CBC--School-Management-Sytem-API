/**
 * Leadership & Club Types
 *
 * Matches docs/system-data-modules/student-data-module.md §12, §13
 *
 * §12 — Student Leadership Roles (Prefects)
 *   e.g. Head Boy, Head Girl, Class Prefect, Games Captain,
 *   Dining Hall Prefect, Dormitory Prefect, etc.
 *
 * §13 — Clubs & Societies
 *   Categories: Academic, Social, Religious, Community, Special Interest
 *   Roles: member, secretary, chairperson, treasurer
 */

// ═══════════════════════════════════════════════════════
//  Leadership Roles (Prefects)
// ═══════════════════════════════════════════════════════

export type LeadershipStatus = 'active' | 'completed';

export interface StudentLeadershipRole {
  id: string;
  student_id: string;
  role: string;                       // e.g. 'Head Boy', 'Class Prefect'
  department_id: string | null;       // Optional link to department
  date_assigned: string;
  date_ended: string | null;
  status: LeadershipStatus;
}

export interface CreateLeadershipRoleInput {
  role: string;
  department_id?: string | null | undefined;
  date_assigned?: string | undefined;
}

export interface UpdateLeadershipRoleInput {
  role?: string | undefined;
  department_id?: string | null | undefined;
  date_ended?: string | null | undefined;
  status?: LeadershipStatus | undefined;
}

// ═══════════════════════════════════════════════════════
//  Clubs & Societies
// ═══════════════════════════════════════════════════════

export type ClubCategory =
  | 'Academic'
  | 'Social'
  | 'Religious'
  | 'Community'
  | 'Special Interest';

export interface Club {
  id: string;
  name: string;
  category: ClubCategory | null;
  teacher_patron: string | null;      // FK to teachers (future)
  created_at: string;
}

export interface CreateClubInput {
  name: string;
  category?: ClubCategory | null | undefined;
  teacher_patron?: string | null | undefined;
}

export type UpdateClubInput = Partial<CreateClubInput>;

// ── Student Club Membership ─────────────────────────────

export type ClubMembershipRole = 'member' | 'secretary' | 'chairperson' | 'treasurer';

export interface StudentClub {
  id: string;
  student_id: string;
  club_id: string;
  role: ClubMembershipRole;
  date_joined: string;
  date_left: string | null;
}

export interface JoinClubInput {
  club_id: string;
  role?: ClubMembershipRole | undefined;
}
