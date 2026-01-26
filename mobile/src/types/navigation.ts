export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    TeamFeed: { teamId: string };
    TeamInfo: { teamId: string };
    ClassDetails: {
        classId: string;
        title: string;
        instructor: string;
        time: string;
        description?: string;
        tags: string[];
    };
    CheckInSuccess: undefined;
    CreateTeam: undefined;
    JoinTeam: undefined;
    TeamContext: { teamId: string };
};
