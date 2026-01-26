import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TeamFeedScreen from '../features/community/screens/TeamFeedScreen';
import CheckInSuccessScreen from '../features/checkin/screens/CheckInSuccessScreen';
import ClassDetailScreen from '../features/schedule/screens/ClassDetailScreen';
import ScheduleScreen from '../features/schedule/screens/ScheduleScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
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
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="Schedule" component={ScheduleScreen} />
                        <Stack.Screen name="TeamFeed" component={TeamFeedScreen} />
                        <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
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

