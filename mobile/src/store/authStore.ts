import { create } from 'zustand';
import { User, TeamMember } from '../types/domain';

interface AuthState {
    user: User | null;
    teamMember: TeamMember | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Mock Data Generators
const createMockUser = (email: string): User => ({
    id: 'u1',
    name: 'Leandro',
    email: email,
    createdAt: new Date().toISOString(),
});

const createMockMember = (): TeamMember => ({
    userId: 'u1',
    teamId: 't1', // Alliance
    role: 'HEAD_COACH',
    status: 'ACTIVE',
    currentBelt: {
        color: 'BLUE',
        degrees: 2,
        awardedAt: '2025-01-01T00:00:00Z',
        awardedBy: 'p1'
    },
    joinedAt: new Date().toISOString()
});

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    teamMember: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });

        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = createMockUser(email || 'demo@jitsu.com');
                const member = createMockMember();

                set({
                    user,
                    teamMember: member,
                    isAuthenticated: true,
                    isLoading: false
                });
                resolve();
            }, 1000);
        });
    },

    logout: () => set({ user: null, teamMember: null, isAuthenticated: false }),
}));
