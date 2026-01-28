import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal } from 'react-native';
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
    const [showAddModal, setShowAddModal] = useState(false);

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
        setShowAddModal(true);
    };

    const handleCreate = () => {
        setShowAddModal(false);
        navigation.navigate('CreateTeam');
    }

    const handleJoin = () => {
        setShowAddModal(false);
        navigation.navigate('JoinTeam');
    }

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
                    <Text className="text-blue-500 text-[10px] font-bold uppercase tracking-wide mr-2">{item.role}</Text>
                    <View className="w-1 h-1 rounded-full bg-zinc-700 mr-2" />
                    <Text className="text-zinc-500 text-xs">{item.membersCount} Members</Text>
                </View>
            </View>

            {/* Badges/Action */}
            <View className="items-end">
                {item.unreadMessagesCount > 0 ? (
                    <View className="bg-blue-600 rounded-full h-6 min-w-[24px] items-center justify-center px-1">
                        <Text className="text-white text-[10px] font-bold">
                            {item.unreadMessagesCount > 99 ? '+99' : item.unreadMessagesCount}
                        </Text>
                    </View>
                ) : item.badgeCount > 0 ? (
                    <View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
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

    const renderAddModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showAddModal}
            onRequestClose={() => setShowAddModal(false)}
        >
            <View className="flex-1 bg-black/70 justify-center items-center px-4">
                <TouchableOpacity
                    className="absolute inset-0"
                    activeOpacity={1}
                    onPress={() => setShowAddModal(false)}
                />

                <View
                    className="w-full bg-zinc-900 rounded-2xl border border-white/10 p-6 z-50 shadow-2xl"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20 }}
                >
                    <Text className="text-white text-xl font-bold mb-2 text-center">Começar</Text>
                    <Text className="text-slate-400 text-sm mb-8 text-center">Escolha como você quer iniciar sua jornada</Text>

                    <TouchableOpacity
                        className="flex-row items-center bg-zinc-800 p-4 rounded-xl mb-4 border border-zinc-700 active:bg-zinc-700"
                        onPress={handleJoin}
                    >
                        <View className="w-10 h-10 rounded-full bg-blue-600/10 items-center justify-center mr-4">
                            <Ionicons name="log-in-outline" size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-base">Entrar com Código</Text>
                            <Text className="text-slate-500 text-xs">Tenho um código de convite</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#52525b" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center bg-zinc-800 p-4 rounded-xl border border-zinc-700 active:bg-zinc-700"
                        onPress={handleCreate}
                    >
                        <View className="w-10 h-10 rounded-full bg-emerald-600/10 items-center justify-center mr-4">
                            <Ionicons name="add-circle-outline" size={24} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-base">Criar Nova Equipe</Text>
                            <Text className="text-slate-500 text-xs">Sou instrutor ou dono de academia</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#52525b" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mt-6 self-center p-2"
                        onPress={() => setShowAddModal(false)}
                    >
                        <Text className="text-zinc-500 font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

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
            <View className="flex-1 px-4 relative">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563eb" />
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

            {renderAddModal()}

        </SafeAreaView>
    );
}
