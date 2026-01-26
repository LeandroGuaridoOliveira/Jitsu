import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SimpleLineIcons } from '@expo/vector-icons';

// Mock Data
const MOCK_TEAMS = [
    { id: 't1', name: 'Alliance HQ', role: 'Competitor', unread: 5 },
    { id: 't2', name: 'Gracie Barra', role: 'Visitor', unread: 120 }
];

// Types
type Team = typeof MOCK_TEAMS[0];
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TeamScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Simulate Data Fetching or Store Access
    const userTeams = MOCK_TEAMS;

    // Smart Routing Logic
    useEffect(() => {
        if (userTeams.length === 1) {
            // Immediately redirect if only one team
            navigation.navigate('TeamFeed', { teamId: userTeams[0].id });
        }
    }, [userTeams, navigation]);

    // If only one team, we can render null or a loading state while redirecting
    // However, to prevent flash, we might just return null if we know we are redirecting
    if (userTeams.length === 1) {
        return <View className="flex-1 bg-slate-900" />;
    }

    const renderTeamCard = ({ item }: { item: Team }) => (
        <TouchableOpacity
            className="flex-row items-center bg-zinc-900 p-4 mb-3 rounded-xl border border-white/5 active:opacity-80"
            onPress={() => navigation.navigate('TeamFeed', { teamId: item.id })}
        >
            {/* Logo Placeholder */}
            <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4 border border-white/10">
                <Text className="text-slate-500 font-bold text-lg">{item.name.charAt(0)}</Text>
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-white font-bold text-lg">{item.name}</Text>
                <Text className="text-slate-400 text-sm font-medium uppercase tracking-wider">{item.role}</Text>
            </View>

            {/* Badge or Arrow */}
            {item.unread > 0 ? (
                <View className="bg-red-600 min-w-[24px] h-6 px-1.5 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                        {item.unread > 99 ? '+99' : item.unread}
                    </Text>
                </View>
            ) : (
                <SimpleLineIcons name="arrow-right" size={16} color="#64748b" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            <View className="flex-1 px-4 pt-4">
                <Text className="text-white text-2xl font-bold mb-6">Meus Times</Text>

                <FlatList
                    data={userTeams}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTeamCard}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}

// Helper to simulate store if needed later
// const useAuthStore = create(...) 
