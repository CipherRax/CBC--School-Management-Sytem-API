/**
 * Sport & Creative Activity Types
 *
 * Matches docs/system-data-modules/student-data-module.md §14, §15
 *
 * §14 — Sports Participation
 *   Category: team | individual
 *   Team sports: Football, Rugby, Basketball, Volleyball, Hockey, Netball, Handball, Baseball
 *   Individual sports: Athletics, Tennis, Badminton, Table Tennis, Swimming, Chess
 *
 * §15 — Creative & Arts Activities
 *   Activity types: Drama, Music, Choir, Dance, Poetry, Film, Art
 *   Competition levels: school, county, regional, national
 */

// ═══════════════════════════════════════════════════════
//  Sport Entity
// ═══════════════════════════════════════════════════════

export type SportCategory = 'team' | 'individual';

export interface Sport {
  id: string;
  name: string;
  category: SportCategory;
  coach_id: string | null;
  created_at: string;
}

export interface CreateSportInput {
  name: string;
  category: SportCategory;
  coach_id?: string | null | undefined;
}

export type UpdateSportInput = Partial<CreateSportInput>;

// ═══════════════════════════════════════════════════════
//  Student ↔ Sport Participation
// ═══════════════════════════════════════════════════════

export interface StudentSport {
  id: string;
  student_id: string;
  sport_id: string;
  category: SportCategory;
  position: string | null;
  date_joined: string;
  date_left: string | null;
  coach_id: string | null;
}

export interface JoinSportInput {
  sport_id: string;
  position?: string | null | undefined;
  coach_id?: string | null | undefined;
}

// ═══════════════════════════════════════════════════════
//  Creative & Arts Activities
// ═══════════════════════════════════════════════════════

export type CreativeActivityType =
  | 'Drama'
  | 'Music'
  | 'Choir'
  | 'Dance'
  | 'Poetry'
  | 'Film'
  | 'Art';

export type CompetitionLevel = 'school' | 'county' | 'regional' | 'national';

export interface StudentCreativeActivity {
  id: string;
  student_id: string;
  activity_type: CreativeActivityType;
  competition_level: CompetitionLevel | null;
  date_joined: string;
}

export interface CreateCreativeActivityInput {
  activity_type: CreativeActivityType;
  competition_level?: CompetitionLevel | null | undefined;
}
