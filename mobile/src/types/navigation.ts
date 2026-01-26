export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    TeamFeed: undefined;
    ClassDetails: {
        classId: string;
        title: string;
        instructor: string;
        time: string;
        description?: string;
        tags: string[];
    };
    CheckInSuccess: undefined;
};
