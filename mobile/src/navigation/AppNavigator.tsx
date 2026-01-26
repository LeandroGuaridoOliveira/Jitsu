import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import TeamFeedScreen from '../features/community/screens/TeamFeedScreen';
import TeamInfoScreen from '../features/community/screens/TeamInfoScreen';
import CheckInSuccessScreen from '../features/checkin/screens/CheckInSuccessScreen';
import ClassDetailScreen from '../features/schedule/screens/ClassDetailScreen';
import CreateTeamScreen from '../screens/CreateTeamScreen';
import JoinTeamScreen from '../screens/JoinTeamScreen';
import TeamContextScreen from '../features/community/screens/TeamContextScreen';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated } = useAuthStore();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    // Main App Stack
                    <Stack.Group>
                        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                        <Stack.Screen name="TeamFeed" component={TeamFeedScreen} />
                        <Stack.Screen name="TeamInfo" component={TeamInfoScreen} />
                        <Stack.Screen name="ClassDetails" component={ClassDetailScreen} />
                        <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
                        <Stack.Screen name="JoinTeam" component={JoinTeamScreen} />
                        <Stack.Screen name="TeamContext" component={TeamContextScreen} />
                        <Stack.Screen name="CheckInSuccess" component={CheckInSuccessScreen} options={{ presentation: 'modal' }} />
                    </Stack.Group>
                ) : (
                    // Auth Stack
                    <Stack.Group>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

