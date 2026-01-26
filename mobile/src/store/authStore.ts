import { create } from 'zustand';
import { User, TeamMember } from '../types/domain';

interface AuthState {
    user: User | null;
    teamMember: TeamMember | null;
    isAuthenticated: boolean;
    login: (user: User, member?: TeamMember) => void;
    logout: () => void;
}

// Mock Data
export const MOCK_USER: User = {
    id: 'u1',
    name: 'Leandro Leg',
    email: 'leo@jitsu.com',
    createdAt: new Date().toISOString(),
};

export const MOCK_MEMBER: TeamMember = {
    userId: 'u1',
    teamId: 't1',
    role: 'STUDENT',
    status: 'ACTIVE',
    currentBelt: {
        color: 'BLUE',
        degrees: 2,
        awardedAt: '2025-01-01T00:00:00Z',
        awardedBy: 'p1'
    },
    joinedAt: new Date().toISOString()
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null, // Start null to force login
    teamMember: null,
    isAuthenticated: false,
    login: (user, member) => set({ user, teamMember: member, isAuthenticated: true }),
    logout: () => set({ user: null, teamMember: null, isAuthenticated: false }),
}));
