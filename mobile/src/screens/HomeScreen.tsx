import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { formatBeltName } from '../utils/beltSystem';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { user, teamMember, logout } = useAuthStore();

    if (!user) return null;

    const beltName = teamMember ? formatBeltName(teamMember.currentBelt.color) : 'White';

    const handleNextClassPress = () => {
        navigation.navigate('ClassDetails', {
            classId: '123',
            title: 'Jiu-Jitsu Avançado',
            instructor: 'Sensei Renato',
            time: '19:00',
            tags: ['Gi', 'Advanced'],
            description: 'Focus on guard passing under pressure.'
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <View className="px-6 py-6 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <View className="h-12 w-12 bg-gray-300 rounded-full border border-slate-700 overflow-hidden mr-3">
                            {/* Placeholder Avatar */}
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=leandro' }} className="h-full w-full" resizeMode="cover" />
                        </View>
                        <View>
                            <Text className="text-gray-400 text-sm">Olá,</Text>
                            <Text className="text-white text-xl font-bold">{user.name.split(' ')[0]}</Text>
                        </View>
                    </View>
                </View>

                {/* Hero Card (Next Class) */}
                <View className="px-6 mb-8">
                    <Text className="text-white text-lg font-bold mb-4">Próxima Aula</Text>
                    <TouchableOpacity
                        className="bg-zinc-800 rounded-2xl p-0 overflow-hidden shadow-lg border border-zinc-700"
                        activeOpacity={0.8}
                        onPress={handleNextClassPress}
                    >
                        {/* Color Strip */}
                        <View className="h-2 w-full bg-red-600" />

                        <View className="p-6">
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="bg-zinc-700/50 px-3 py-1 rounded-full border border-zinc-600">
                                    <Text className="text-red-400 font-bold text-xs">19:00</Text>
                                </View>
                                <View className="bg-red-600 px-3 py-1 rounded-full">
                                    <Text className="text-white font-bold text-xs">Gi</Text>
                                </View>
                            </View>

                            <Text className="text-white text-2xl font-bold mb-1">Jiu-Jitsu Avançado</Text>
                            <Text className="text-gray-400">Sensei Renato • Tatame A</Text>
                        </View>

                        {/* Bottom Action Strip */}
                        <View className="bg-zinc-900/50 px-6 py-3 flex-row justify-between items-center border-t border-zinc-700/50">
                            <Text className="text-gray-400 text-sm">Toque para detalhes</Text>
                            <Ionicons name="arrow-forward" size={20} color="#9ca3af" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Performance Stats */}
                <View className="px-6 flex-row gap-4 mb-4">
                    {/* Frequency Card */}
                    <View className="flex-1 bg-zinc-800 p-5 rounded-2xl border border-zinc-700">
                        <View className="mb-2">
                            <Ionicons name="bar-chart-outline" size={24} color="#60a5fa" />
                        </View>
                        <Text className="text-white text-3xl font-bold mb-1">3/5</Text>
                        <Text className="text-gray-400 text-xs">Frequência Semanal</Text>
                    </View>

                    {/* Streak Card */}
                    <View className="flex-1 bg-zinc-800 p-5 rounded-2xl border border-zinc-700">
                        <View className="mb-2">
                            <Ionicons name="flame-outline" size={24} color="#f97316" />
                        </View>
                        <Text className="text-white text-3xl font-bold mb-1">4</Text>
                        <Text className="text-gray-400 text-xs">Semanas Seguidas</Text>
                    </View>
                </View>

                {/* Instructor Area - Only visible to Head Coach */}
                {teamMember?.role === 'HEAD_COACH' && (
                    <View className="px-6 mt-4">
                        <Text className="text-white text-lg font-bold mb-3">Área do Instrutor</Text>
                        <TouchableOpacity
                            className="bg-indigo-600 rounded-2xl p-5 border border-indigo-500 flex-row items-center justify-between"
                            onPress={() => navigation.navigate('Attendance')}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-indigo-500 rounded-full items-center justify-center mr-4">
                                    <Ionicons name="list" size={24} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg">Chamada de Aula</Text>
                                    <Text className="text-indigo-200 text-sm">Gerenciar presenças</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
