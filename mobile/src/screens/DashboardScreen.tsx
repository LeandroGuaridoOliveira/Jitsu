import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore, MOCK_USER, MOCK_MEMBER } from '../store/authStore';
import { formatBeltName, calculateTimeInGrade } from '../utils/beltSystem';

export default function DashboardScreen() {
    const { user, teamMember, logout, login } = useAuthStore();

    // Auto-login for demo purposes if needed, or handle in LoginScreen
    // For now, let's assume LoginScreen calls login()

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Please Log In</Text>
            </View>
        );
    }

    const beltName = teamMember ? formatBeltName(teamMember.currentBelt.color) : 'White';
    const monthsInGrade = teamMember ? calculateTimeInGrade(teamMember.currentBelt.awardedAt) : 0;

    return (
        <ScrollView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-white p-6 pt-12 border-b border-slate-200">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-slate-800">Hello, {user.name.split(' ')[0]}</Text>
                        <Text className="text-slate-500">{teamMember?.role || 'Guest'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={logout}
                        className="bg-slate-100 px-3 py-2 rounded-lg"
                    >
                        <Text className="text-slate-600 font-medium">Logout</Text>
                    </TouchableOpacity>
                </View>

                {teamMember && (
                    <View className="bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-200">
                        <Text className="text-white/80 text-sm font-medium mb-1">CURRENT RANK</Text>
                        <Text className="text-white text-2xl font-bold mb-2">
                            {beltName} Belt
                        </Text>
                        <View className="flex-row items-center">
                            <View className="bg-white/20 px-2 py-1 rounded mr-2">
                                <Text className="text-white text-xs font-bold">{teamMember.currentBelt.degrees} Degrees</Text>
                            </View>
                            <Text className="text-white/80 text-xs">{monthsInGrade} months in grade</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Content based on Role */}
            <View className="p-6">
                <Text className="text-lg font-bold text-slate-800 mb-4">Next Training</Text>
                <View className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-bold text-slate-700">Fundamentals Class</Text>
                        <Text className="text-indigo-600 font-bold">19:00</Text>
                    </View>
                    <Text className="text-slate-500 text-sm">Today • Matt 1</Text>
                    <TouchableOpacity className="mt-4 bg-indigo-50 p-3 rounded-lg items-center border border-indigo-100">
                        <Text className="text-indigo-700 font-semibold">Check-in</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-lg font-bold text-slate-800 mb-4">Quick Actions</Text>
                <View className="flex-row flex-wrap justify-between">
                    <TouchableOpacity className="w-[48%] bg-white p-4 rounded-xl border border-slate-200 mb-4 items-center">
                        <Text className="font-bold text-slate-700 mb-1">History</Text>
                        <Text className="text-xs text-slate-400">View attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[48%] bg-white p-4 rounded-xl border border-slate-200 mb-4 items-center">
                        <Text className="font-bold text-slate-700 mb-1">Team</Text>
                        <Text className="text-xs text-slate-400">View roster</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
