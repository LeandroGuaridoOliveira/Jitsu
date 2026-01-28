import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScheduleScreen from '../features/schedule/screens/ScheduleScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import TeamScreen from '../screens/TeamScreen';

const Tab = createBottomTabNavigator();


export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a', // slate-900
                    borderTopColor: '#1e293b', // slate-800
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#dc2626', // red-600
                tabBarInactiveTintColor: '#94a3b8', // slate-400
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: -4
                },
            }}
        >
            <Tab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={24} color={color} />,
                    tabBarLabel: 'Início'
                }}
            />

            <Tab.Screen
                name="Team"
                component={TeamScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="people" size={24} color={color} />,
                    tabBarLabel: 'Time'
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={24} color={color} />,
                    tabBarLabel: 'Perfil'
                }}
            />
        </Tab.Navigator>
    );
}
