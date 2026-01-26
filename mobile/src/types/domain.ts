export type UserRole = 'STUDENT' | 'ASSISTANT' | 'HEAD_COACH' | 'INSTRUCTOR';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
}

export type BeltColor =
    | 'WHITE'
    | 'GREY_WHITE' | 'GREY' | 'GREY_BLACK'
    | 'YELLOW_WHITE' | 'YELLOW' | 'YELLOW_BLACK'
    | 'ORANGE_WHITE' | 'ORANGE' | 'ORANGE_BLACK'
    | 'GREEN_WHITE' | 'GREEN' | 'GREEN_BLACK'
    | 'BLUE'
    | 'PURPLE'
    | 'BROWN'
    | 'BLACK'
    | 'RED_BLACK' | 'RED_WHITE' | 'RED';

// Simplified for MVP, but supporting the full kid/adult range if needed. 
// For now, let's stick to the main colors mentioned or standard IBJJF.
// PDF doesn't specify all colors, but "Faixa atual derivada do histórico".

export interface Belt {
    color: BeltColor;
    degrees: number; // 0 to 4 stripes
    awardedAt: string; // ISO date
    awardedBy: string; // Professor ID
}

export type MemberStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'INACTIVE';

export interface TeamMember {
    userId: string;
    teamId: string;
    role: UserRole;
    status: MemberStatus;
    currentBelt: Belt;
    joinedAt: string;
}

export interface Team {
    id: string;
    name: string;
    description?: string;
    headCoachId: string;
    logoUrl?: string;
    memberCount: number;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface WeeklyScheduleItem {
    id: string;
    teamId: string;
    dayOfWeek: DayOfWeek;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    title: string; // e.g. "Fundamentals", "Advanced"
    subtitle?: string;
    instructorIds: string[]; // List of instructor IDs
    type: 'Gi' | 'No-Gi' | 'Kids' | 'Competition'; // Renaming 'categories' to 'type' for consistency with UI reqs or keeping categories if generic
    tags: string[]; // e.g., ["GI", "ADULTS", "BEGINNERS"]
    isRecurring?: boolean;
}

export interface TrainingSession {
    id: string;
    teamId: string;
    scheduleId?: string; // If linked to recurring schedule
    date: string; // ISO Date YYYY-MM-DD
    startTime: string;
    endTime: string;
    title: string;
    instructorId: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface Attendance {
    id: string;
    sessionId: string;
    userId: string;
    checkedInAt: string; // ISO timestamp
    status: 'PRESENT' | 'LATE' | 'EXCUSED';
    verifiedBy?: string; // Professor ID
    isVisitor?: boolean;
}

export interface GraduationRecord {
    id: string;
    userId: string;
    teamId: string;
    oldBelt: Belt;
    newBelt: Belt;
    promotedBy: string; // Professor ID
    promotedAt: string; // ISO timestamp
    notes?: string;
}
