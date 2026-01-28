// src/services/mockService.ts

import { WeeklyScheduleItem } from '../types/domain';

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    // Adicionado para suportar ranking futuro
    beltColor?: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';
}

export interface Team {
    id: string;
    name: string;
    acronym: string; // EX: "GB-BH" (Essencial para cards pequenos)
    role: 'OWNER' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
    logoUrl?: string;
    unreadMessagesCount: number; // Se > 99, a UI deve tratar
    badgeCount: number; // Para novos posts/avisos no mural
    membersCount: number; // "85 Atletas"
    nextSession?: string; // "Hoje, 19:00" (Opcional, para atalho rápido)
}

export interface FeedPost {
    id: string;
    teamId: string;
    author: User;
    content: string;
    createdAt: string; // ISO date string
    likes: number;
    commentsCount: number;
    type: 'announcement' | 'event' | 'post';
    pinned?: boolean; // Novo: Para fixar avisos no topo
}

export interface ChatMessage {
    id: string;
    teamId: string;
    sender: User;
    content: string;
    createdAt: string;
}

// --- MOCK DATA ---

const MOCK_USER: User = {
    id: 'u1',
    name: 'Leandro',
    avatarUrl: 'https://i.pravatar.cc/150?u=leandro',
    beltColor: 'BLUE'
};

const MOCK_TEAMS: Team[] = [
    // Cenário 1: Aluno ativo, uso normal
    {
        id: 't1',
        name: 'Alliance Jiu Jitsu HQ',
        acronym: 'ALL-HQ',
        role: 'STUDENT',
        logoUrl: 'https://ui-avatars.com/api/?name=Alliance+HQ&background=0f172a&color=fff',
        unreadMessagesCount: 5,
        badgeCount: 2,
        membersCount: 342,
        nextSession: '19:00'
    },
    // Cenário 2: Instrutor, grupo bombando (Teste do +99)
    {
        id: 't2',
        name: 'Gracie Barra - Centro',
        acronym: 'GB-CEN',
        role: 'INSTRUCTOR',
        logoUrl: 'https://ui-avatars.com/api/?name=GB+Centro&background=red&color=fff',
        unreadMessagesCount: 124,
        badgeCount: 5,
        membersCount: 85,
    },
    // Cenário 3: Admin, grupo novo ou inativo (Teste visual clean)
    {
        id: 't3',
        name: 'Checkmat SP',
        acronym: 'CKM-SP',
        role: 'ADMIN',
        logoUrl: 'https://ui-avatars.com/api/?name=Checkmat&background=blue&color=fff',
        unreadMessagesCount: 0,
        badgeCount: 0,
        membersCount: 12,
    },
];

const MOCK_FEED: FeedPost[] = [
    {
        id: 'p1',
        teamId: 't1',
        author: { id: 'u2', name: 'Mestre Fabio', beltColor: 'BLACK' },
        content: '⚠ ATENÇÃO: O treino de hoje focará em passagem de guarda. Todos no tatame às 19h com kimono limpo!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 15,
        commentsCount: 3,
        type: 'announcement',
        pinned: true
    },
    {
        id: 'p2',
        teamId: 't1',
        author: { id: 'u3', name: 'Instrutor João', beltColor: 'BROWN' },
        content: 'Seminário confirmado para o próximo sábado. Inscrições na recepção. O valor é R$ 80,00 para membros.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        likes: 42,
        commentsCount: 8,
        type: 'event',
    },
];

const MOCK_CHAT: ChatMessage[] = [
    {
        id: 'm1',
        teamId: 't1',
        sender: { id: 'u4', name: 'Pedro' },
        content: 'Alguém vai no treino das 7h amanhã?',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'm2',
        teamId: 't1',
        sender: { id: 'u5', name: 'Lucas' },
        content: 'Eu vou! O mestre confirmou presença.',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
        id: 'm3',
        teamId: 't1',
        sender: { id: 'u1', name: 'Leandro' }, // O próprio usuário (Teste de alinhamento à direita)
        content: 'Também estarei lá oss',
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    },
];

const LATENCY_MS = 800; // Simula delay de rede 3G/4G

export class MockService {
    private static delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // --- TEAMS ---

    static async getUserTeams(): Promise<Team[]> {
        await this.delay(LATENCY_MS);
        return [...MOCK_TEAMS];
    }

    static async createTeam(data: { name: string; logoUrl?: string; acronym?: string }): Promise<Team> {
        await this.delay(LATENCY_MS);

        // Gera sigla automática se não vier (Ex: "Nova Equipe" -> "NE")
        const autoAcronym = data.acronym || data.name.substring(0, 3).toUpperCase();

        const newTeam: Team = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name,
            acronym: autoAcronym,
            role: 'OWNER', // Quem cria é o dono
            logoUrl: data.logoUrl,
            unreadMessagesCount: 0,
            badgeCount: 0,
            membersCount: 1 // Começa só com o criador
        };

        return newTeam;
    }

    static async joinTeam(code: string): Promise<Team> {
        await this.delay(LATENCY_MS);

        if (!code || code.length < 3) {
            throw new Error('Código de equipe inválido.');
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            name: `Team ${code.toUpperCase()}`,
            acronym: code.substring(0, 3).toUpperCase(),
            role: 'STUDENT', // Entra como aluno por padrão
            unreadMessagesCount: 0,
            badgeCount: 0,
            membersCount: 42,
            logoUrl: 'https://ui-avatars.com/api/?name=New+Team&background=random',
        };
    }

    // --- COMMUNITY (FEED & CHAT) ---

    static async getTeamFeed(teamId: string): Promise<FeedPost[]> {
        await this.delay(LATENCY_MS);
        // Retorna posts simulados atrelados ao ID do time
        return MOCK_FEED.map(post => ({ ...post, teamId }));
    }

    static async getTeamChat(teamId: string): Promise<ChatMessage[]> {
        await this.delay(LATENCY_MS);
        // Retorna chat simulado
        return MOCK_CHAT.map(msg => ({ ...msg, teamId }));
    }

    // --- SCHEDULE ---

    static async getInstructorsByTeam(teamId: string): Promise<{ id: string; name: string; role: 'HEAD_COACH' | 'INSTRUCTOR' | 'ASSISTANT' | 'STUDENT' }[]> {
        await this.delay(LATENCY_MS);
        // Mock returning instructors
        return [
            { id: 'u2', name: 'Mestre Fabio', role: 'HEAD_COACH' },
            { id: 'u3', name: 'Instrutor João', role: 'INSTRUCTOR' },
            { id: 'u6', name: 'Monitor Ana', role: 'ASSISTANT' },
        ];
    }

    static async getWeeklySchedule(teamId: string): Promise<WeeklyScheduleItem[]> {
        await this.delay(LATENCY_MS);

        // Mock Schedule Data covering Monday to Sunday
        const schedule: WeeklyScheduleItem[] = [
            // MONDAY
            {
                id: 's1', teamId, dayOfWeek: 'MONDAY', startTime: '06:00', endTime: '07:00',
                title: 'Jiu-Jitsu Fundamentals', instructorIds: ['u2'], type: 'Gi', tags: ['GI', 'BEGINNERS'], isRecurring: true
            },
            {
                id: 's2', teamId, dayOfWeek: 'MONDAY', startTime: '12:00', endTime: '13:00',
                title: 'All Levels', instructorIds: ['u3'], type: 'No-Gi', tags: ['NOGI', 'ALL LEVELS'], isRecurring: true
            },
            {
                id: 's3', teamId, dayOfWeek: 'MONDAY', startTime: '18:00', endTime: '18:45',
                title: 'Kids Class', instructorIds: ['u2'], type: 'Kids', tags: ['GI', 'KIDS'], isRecurring: true
            },
            {
                id: 's4', teamId, dayOfWeek: 'MONDAY', startTime: '19:00', endTime: '20:30',
                title: 'Competition Training', instructorIds: ['u2'], type: 'Competition', tags: ['GI', 'COMP'], isRecurring: true
            },
            // TUESDAY
            {
                id: 's5', teamId, dayOfWeek: 'TUESDAY', startTime: '07:00', endTime: '08:00',
                title: 'Drills & Techniques', instructorIds: ['u3'], type: 'Gi', tags: ['GI', 'DRILLS'], isRecurring: true
            },
            {
                id: 's6', teamId, dayOfWeek: 'TUESDAY', startTime: '12:00', endTime: '13:00',
                title: 'Advanced Concepts', instructorIds: ['u2'], type: 'Gi', tags: ['GI', 'ADVANCED'], isRecurring: true
            },
            {
                id: 's7', teamId, dayOfWeek: 'TUESDAY', startTime: '19:00', endTime: '20:00',
                title: 'No-Gi Fundamentals', instructorIds: ['u3'], type: 'No-Gi', tags: ['NOGI', 'BEGINNERS'], isRecurring: true
            },
            {
                id: 's8', teamId, dayOfWeek: 'TUESDAY', startTime: '20:00', endTime: '21:00',
                title: 'Open Mat', instructorIds: [], type: 'Gi', tags: ['GI', 'SPARRING'], isRecurring: true
            },
            // WEDNESDAY
            {
                id: 's9', teamId, dayOfWeek: 'WEDNESDAY', startTime: '06:00', endTime: '07:00',
                title: 'Jiu-Jitsu Fundamentals', instructorIds: ['u2'], type: 'Gi', tags: ['GI', 'BEGINNERS'], isRecurring: true
            },
            {
                id: 's10', teamId, dayOfWeek: 'WEDNESDAY', startTime: '12:00', endTime: '13:00',
                title: 'All Levels', instructorIds: ['u3'], type: 'No-Gi', tags: ['NOGI', 'ALL LEVELS'], isRecurring: true
            },
            {
                id: 's11', teamId, dayOfWeek: 'WEDNESDAY', startTime: '18:00', endTime: '18:45',
                title: 'Kids Class', instructorIds: ['u2'], type: 'Kids', tags: ['GI', 'KIDS'], isRecurring: true
            },
            {
                id: 's12', teamId, dayOfWeek: 'WEDNESDAY', startTime: '19:00', endTime: '20:30',
                title: 'Advanced Class', instructorIds: ['u2'], type: 'Gi', tags: ['GI', 'ADVANCED'], isRecurring: true
            },
            // THURSDAY
            {
                id: 's13', teamId, dayOfWeek: 'THURSDAY', startTime: '07:00', endTime: '08:00',
                title: 'Drills & Techniques', instructorIds: ['u3'], type: 'Gi', tags: ['GI', 'DRILLS'], isRecurring: true
            },
            {
                id: 's14', teamId, dayOfWeek: 'THURSDAY', startTime: '19:00', endTime: '20:00',
                title: 'No-Gi Advanced', instructorIds: ['u2'], type: 'No-Gi', tags: ['NOGI', 'ADVANCED'], isRecurring: true
            },
            // FRIDAY
            {
                id: 's15', teamId, dayOfWeek: 'FRIDAY', startTime: '18:00', endTime: '19:30',
                title: 'Open Mat', instructorIds: [], type: 'Gi', tags: ['GI', 'SPARRING'], isRecurring: true
            },
            // SATURDAY
            {
                id: 's16', teamId, dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '12:00',
                title: 'Team Training', instructorIds: ['u2', 'u3'], type: 'Gi', tags: ['GI', 'ALL LEVELS'], isRecurring: true
            },
        ];

        return schedule.map(item => ({
            ...item,
            // Ad-hoc property for UI decoration (in a real app, this would come from backend status)
            isCancelled: this.cancelledSessions.has(item.id)
        }));
    }

    static async createWeeklyScheduleItem(item: any): Promise<void> {
        await this.delay(LATENCY_MS);
        console.log('[MOCK] Created Weekly Schedule Item:', item);
        // In a real app, this would save to the backend
    }

    static async updateClass(id: string, data: any): Promise<void> {
        await this.delay(LATENCY_MS);
        console.log(`[MOCK] Updated class ${id}:`, data);
    }

    // --- MONTHLY HISTORY ---

    static async getMonthlyHistory(year: number, month: number): Promise<Record<string, WeeklyScheduleItem[]>> {
        await this.delay(LATENCY_MS);

        const historyData: Record<string, WeeklyScheduleItem[]> = {};
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Simulate some random history
        for (let day = 1; day <= daysInMonth; day++) {
            // Randomly decide if there was training on this day (approx 40% chance)
            if (Math.random() > 0.6) {
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                // Add 1 or 2 classes
                const numClasses = Math.random() > 0.8 ? 2 : 1;
                const classes: WeeklyScheduleItem[] = [];

                for (let i = 0; i < numClasses; i++) {
                    classes.push({
                        id: `h_${dateKey}_${i}`,
                        teamId: 't1',
                        dayOfWeek: 'MONDAY', // Not relevant for history display usually, but needed for type
                        startTime: i === 0 ? '19:00' : '10:00',
                        endTime: i === 0 ? '20:30' : '11:00',
                        title: i === 0 ? 'Advanced NoGi' : 'Fundamentals Gi',
                        instructorIds: ['u2'],
                        type: i === 0 ? 'No-Gi' : 'Gi',
                        tags: i === 0 ? ['NOGI', 'SPARRING'] : ['GI', 'DRILLS'],
                        isRecurring: false
                    });
                }
                historyData[dateKey] = classes;
            }
        }

        return historyData;
    }
    // --- CLASS DETAILS ---

    // --- CLASS DETAILS & ATTENDANCE ---

    private static cancelledSessions: Set<string> = new Set();

    static async cancelSession(classId: string): Promise<void> {
        await this.delay(LATENCY_MS);
        this.cancelledSessions.add(classId);
    }

    static async restoreSession(classId: string): Promise<void> {
        await this.delay(LATENCY_MS);
        this.cancelledSessions.delete(classId);
    }

    static async findUserByCode(code: string): Promise<User | null> {
        await this.delay(LATENCY_MS);
        if (code === 'A1B2-8899') {
            return {
                id: 'new_user_1',
                name: 'Novo Aluno Teste',
                beltColor: 'WHITE',
                avatarUrl: 'https://ui-avatars.com/api/?name=Novo+Aluno&background=random'
            };
        }
        return null;
    }

    static async addStudentToClass(sessionId: string, input: string | { guestName: string; guestBelt: string }): Promise<void> {
        await this.delay(LATENCY_MS);

        if (typeof input === 'string') {
            console.log(`[MOCK] Added user ${input} to class ${sessionId}`);
            // In a real app, validation and DB insert happens here
            return;
        }

        // Handle Guest
        const { guestName, guestBelt } = input;
        console.log(`[MOCK] Added GUEST ${guestName} (${guestBelt}) to class ${sessionId}`);
    }

    static async getClassDetails(classId: string): Promise<{
        id: string;
        title: string;
        time: string;
        instructor: { name: string; avatarUrl?: string };
        location: string;
        date: string; // ISO
        status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
        userStatus: 'PRESENT' | 'ABSENT' | 'PENDING' | 'NONE'; // NONE if future
        summary?: string; // For past classes
        attendanceList?: {
            id: string;
            name: string;
            avatarUrl?: string;
            beltColor: 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK';
            status: 'PRESENT' | 'ABSENT' | 'PENDING';
            isVisitor?: boolean;
        }[];
    }> {
        await this.delay(LATENCY_MS);

        // Mock logic: If classId starts with 'h_', it's history (past). Else future.
        const isHistory = classId.startsWith('h_');
        const isCancelled = this.cancelledSessions.has(classId);

        if (isCancelled) {
            return {
                id: classId,
                title: 'Jiu-Jitsu Fundamentals',
                time: '07:00 - 08:30',
                instructor: { name: 'Prof. Silva', avatarUrl: 'https://ui-avatars.com/api/?name=Silva&background=random' },
                location: 'Main Dojo - Mat B',
                date: new Date().toISOString(),
                status: 'CANCELLED',
                userStatus: 'NONE',
                attendanceList: [
                    { id: '10', name: 'Carlos Ribeiro', beltColor: 'BLACK', status: 'PRESENT', avatarUrl: 'https://i.pravatar.cc/150?u=10' }
                ]
            };
        }

        if (isHistory) {
            return {
                id: classId,
                title: 'Advanced No-Gi',
                time: '19:00 - 20:30',
                instructor: { name: 'Mestre Fabio', avatarUrl: 'https://ui-avatars.com/api/?name=Fabio&background=random' },
                location: 'Main Dojo - Mat A',
                date: '2025-10-15', // Mock fixed date for history
                status: 'COMPLETED',
                userStatus: 'PRESENT',
                summary: 'Foco em passagens de guarda aberta (DLR e X-Guard). 3 rounds de 5min de rola específico + 3 rounds livres.',
                attendanceList: [
                    { id: '1', name: 'Leandro', avatarUrl: 'https://i.pravatar.cc/150?u=leandro', beltColor: 'BLUE', status: 'PRESENT' },
                    { id: '2', name: 'Marcus', avatarUrl: 'https://i.pravatar.cc/150?u=marcus', beltColor: 'WHITE', status: 'PRESENT' },
                    { id: '3', name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', beltColor: 'PURPLE', status: 'ABSENT' },
                    { id: '4', name: 'John Doe', beltColor: 'BLUE', status: 'PRESENT', isVisitor: true, avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
                ]
            };
        }

        // Helper to find the schedule item for this classId to mock detailed data
        const schedule = await this.getWeeklySchedule('t1');
        const scheduleItem = schedule.find(s => s.id === classId || classId.startsWith(s.id)); // Simple mock matching

        const baseData: any = {
            id: classId,
            title: scheduleItem?.title || 'Jiu-Jitsu Fundamentals',
            time: scheduleItem ? `${scheduleItem.startTime} - ${scheduleItem.endTime}` : '07:00 - 08:30',
            // Mock matching instructor from ID
            instructor: { name: 'Prof. Silva', avatarUrl: 'https://ui-avatars.com/api/?name=Silva&background=random', id: scheduleItem?.instructorIds[0] },
            location: 'Main Dojo - Mat B',
            date: new Date().toISOString(),
            status: 'SCHEDULED',
            userStatus: 'NONE',
            // Add extra fields for Edit Screen
            type: scheduleItem?.type, // e.g., 'Gi', 'No-Gi'
            tags: scheduleItem?.tags,
            dayOfWeek: scheduleItem?.dayOfWeek,
            instructorIds: scheduleItem?.instructorIds || [],
            attendanceList: [
                { id: '10', name: 'Carlos Ribeiro', beltColor: 'BLACK', status: 'PRESENT', avatarUrl: 'https://i.pravatar.cc/150?u=10' },
                { id: '11', name: 'Fernanda Lima', beltColor: 'BROWN', status: 'PRESENT', avatarUrl: 'https://i.pravatar.cc/150?u=11' },
                { id: '1', name: 'Leandro Oliveira', beltColor: 'BLUE', status: 'PENDING', avatarUrl: 'https://i.pravatar.cc/150?u=leandro' },
            ]
        };

        if (isCancelled) {
            return { ...baseData, status: 'CANCELLED', title: baseData.title + ' (Cancelada)' };
        }

        if (isHistory) {
            return {
                ...baseData,
                title: 'Advanced No-Gi',
                type: 'No-Gi',
                tags: ['NOGI'],
                status: 'COMPLETED',
                userStatus: 'PRESENT',
                date: '2025-10-15',
            };
        }

        return baseData;
    }
}