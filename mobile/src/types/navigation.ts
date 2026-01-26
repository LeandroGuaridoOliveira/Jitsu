export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    TeamFeed: { teamId: string };
    TeamInfo: { teamId: string };
    ClassDetails: {
        classId: string;
        // Optional preview data to show while loading
        preview?: {
            title: string;
            time: string;
            instructor?: string;
        }
    };
    CheckInSuccess: undefined;
    CreateTeam: undefined;
    JoinTeam: undefined;
    TeamContext: { teamId: string };
    TeamSettings: { teamId: string };
    TeamInvite: { teamId: string };
    AddRecurringClass: { teamId: string };
    MonthlyHistory: undefined;
    Attendance: undefined;
};
