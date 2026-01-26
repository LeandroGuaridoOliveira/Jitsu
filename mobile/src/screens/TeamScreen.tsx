import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { MockService, Team } from '../services/mockService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TeamScreen() {
    const navigation = useNavigation<NavigationProp>();

    // State
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Initial Data Fetch
    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        setLoading(true);
        try {
            const data = await MockService.getUserTeams();
            setTeams(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load teams.');
        } finally {
            setLoading(false);
        }
    };

    // Header Actions
    const handleAddPress = () => {
        Alert.alert(
            'New Team',
            'Would you like to join an existing academy or create a new one?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Join with Code',
                    style: 'default',
                    onPress: () => navigation.navigate('JoinTeam')
                },
                {
                    text: 'Create Team',
                    style: 'default',
                    onPress: () => navigation.navigate('CreateTeam')
                }
            ]
        );
    };

    const handleTeamPress = (teamId: string) => {
        navigation.navigate('TeamContext', { teamId });
    };

    // Renders
    const renderTeamCard = ({ item }: { item: Team }) => (
        <TouchableOpacity
            className="flex-row items-center bg-zinc-900 p-4 mb-3 rounded-xl border border-white/5 active:opacity-80"
            onPress={() => handleTeamPress(item.id)}
        >
            {/* Logo / Acronym */}
            <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4 border border-white/10 overflow-hidden">
                {item.logoUrl ? (
                    <Text className="text-slate-500 font-bold text-xs">{item.acronym}</Text>
                ) : (
                    <Text className="text-slate-500 font-bold text-xs">{item.acronym}</Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-white font-bold text-lg leading-6">{item.name}</Text>
                <View className="flex-row items-center mt-0.5">
                    <Text className="text-red-500 text-[10px] font-bold uppercase tracking-wide mr-2">{item.role}</Text>
                    <View className="w-1 h-1 rounded-full bg-zinc-700 mr-2" />
                    <Text className="text-zinc-500 text-xs">{item.membersCount} Members</Text>
                </View>
            </View>

            {/* Badges/Action */}
            <View className="items-end">
                {item.unreadMessagesCount > 0 ? (
                    <View className="bg-red-600 rounded-full h-6 min-w-[24px] items-center justify-center px-1">
                        <Text className="text-white text-[10px] font-bold">
                            {item.unreadMessagesCount > 99 ? '+99' : item.unreadMessagesCount}
                        </Text>
                    </View>
                ) : item.badgeCount > 0 ? (
                    <View className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                ) : (
                    <SimpleLineIcons name="arrow-right" size={16} color="#64748b" />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center mb-6">
                <Ionicons name="shield-outline" size={40} color="#3f3f46" />
            </View>
            <Text className="text-white text-xl font-bold mb-2 text-center">No teams yet</Text>
            <Text className="text-slate-400 text-center mb-8 leading-6">
                Join your academy to check schedules, events and announcements.
            </Text>

            <TouchableOpacity
                className="border border-white/20 py-3 px-6 rounded-lg active:bg-white/5"
                onPress={handleAddPress}
            >
                <Text className="text-white font-semibold">Create New Team</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
                <Text className="text-white text-2xl font-bold">Meus Times</Text>
                <TouchableOpacity
                    onPress={handleAddPress}
                    className="w-10 h-10 bg-zinc-800 items-center justify-center rounded-full active:bg-zinc-700"
                >
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-4">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#dc2626" />
                    </View>
                ) : teams.length > 0 ? (
                    <FlatList
                        data={teams}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTeamCard}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        refreshing={loading}
                        onRefresh={loadTeams}
                    />
                ) : (
                    renderEmptyState()
                )}
            </View>

        </SafeAreaView>
    );
}
