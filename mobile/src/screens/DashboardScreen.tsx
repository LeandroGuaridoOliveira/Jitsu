import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { formatBeltName } from '../utils/beltSystem';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const { user, teamMember } = useAuthStore();

    if (!user) return null;

    const beltName = teamMember ? formatBeltName(teamMember.currentBelt.color) : 'White';

    // Quick Actions Data
    const quickActions = [
        { id: 1, title: 'My Schedule', icon: 'calendar-outline', route: 'Schedule' },
        { id: 2, title: 'Techniques', icon: 'book-outline', route: 'Techniques' },
        { id: 3, title: 'Team Feed', icon: 'people-outline', route: 'TeamFeed' },
        { id: 4, title: 'Financial', icon: 'card-outline', route: 'Financial' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* 1. HEADER */}
                <View className="px-6 pt-6 pb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-3xl font-bold">
                            Hello, {user.name.split(' ')[0]}
                        </Text>
                        <View className="bg-blue-900/30 px-3 py-1 rounded-full self-start mt-2 border border-blue-500/20">
                            <Text className="text-blue-400 text-xs font-bold uppercase tracking-wide">
                                {beltName} Belt
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="relative bg-zinc-800 p-2 rounded-full border border-white/5">
                        <Ionicons name="notifications-outline" size={24} color="#f8fafc" />
                        <View className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-600 rounded-full border border-zinc-800" />
                    </TouchableOpacity>
                </View>

                {/* 2. HERO SECTION (NEXT CLASS) */}
                <View className="px-6 mb-8">
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                        Next Session
                    </Text>

                    <View className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 shadow-xl shadow-black/50">
                        {/* Class Info */}
                        <View className="p-6">
                            <View className="flex-row justify-between items-start mb-1">
                                <Text className="text-white text-4xl font-bold">19:00</Text>
                                <View className="bg-zinc-800 px-3 py-1 rounded-md">
                                    <Text className="text-slate-300 text-xs font-bold uppercase">Today</Text>
                                </View>
                            </View>

                            <Text className="text-white text-xl font-bold mb-1">Fundamentals - Gi</Text>
                            <Text className="text-slate-400 text-sm mb-6">Mat A • Coach Silva</Text>
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            className="bg-red-600 py-5 items-center justify-center active:bg-red-700"
                            onPress={() => navigation.navigate('ClassDetail')}
                        >
                            <Text className="text-white text-lg font-bold tracking-widest uppercase">
                                Check-In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. STATS ROW */}
                <View className="px-6 mb-8">
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                        Performance
                    </Text>
                    <View className="flex-row justify-between">
                        {/* Metric 1 */}
                        <View className="bg-zinc-900 p-4 rounded-xl flex-1 mr-3 border border-zinc-800 items-start">
                            <Text className="text-white text-2xl font-bold">12/20</Text>
                            <Text className="text-slate-500 text-[10px] font-bold uppercase mt-1">
                                Frequency
                            </Text>
                        </View>

                        {/* Metric 2 */}
                        <View className="bg-zinc-900 p-4 rounded-xl flex-1 mr-3 border border-zinc-800 items-start">
                            <Text className="text-white text-2xl font-bold">18h</Text>
                            <Text className="text-slate-500 text-[10px] font-bold uppercase mt-1">
                                Mat Time
                            </Text>
                        </View>

                        {/* Metric 3 */}
                        <View className="bg-zinc-900 p-4 rounded-xl flex-1 border border-zinc-800 items-start">
                            <Text className="text-white text-2xl font-bold">3</Text>
                            <Text className="text-slate-500 text-[10px] font-bold uppercase mt-1">
                                Streak
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 4. QUICK ACTIONS GRID */}
                <View className="px-6">
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                        Menu
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={action.id}
                                className="bg-zinc-800 w-[48%] aspect-square rounded-2xl p-4 mb-4 justify-between border border-white/5 active:bg-zinc-700/80"
                                onPress={() => {
                                    if (action.route) {
                                        // Simple navigation guard
                                        try {
                                            navigation.navigate(action.route);
                                        } catch (e) {
                                            console.warn(`Route ${action.route} not found`);
                                        }
                                    }
                                }}
                            >
                                <View className="bg-zinc-700/50 w-10 h-10 rounded-full items-center justify-center">
                                    <Ionicons name={action.icon as any} size={20} color="#e2e8f0" />
                                </View>
                                <Text className="text-slate-200 font-semibold">{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
