// src/services/mockService.ts

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
}