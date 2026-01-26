import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { formatBeltName } from '../utils/beltSystem';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { user, teamMember, logout } = useAuthStore();

    if (!user) return null;

    const beltName = teamMember ? formatBeltName(teamMember.currentBelt.color) : 'White';

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            <ScrollView className="flex-1 px-6 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View className="flex-row items-center">
                        <View className="relative">
                            <View className="h-14 w-14 bg-gray-300 rounded-full border-2 border-slate-700 items-center justify-center overflow-hidden">
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150?u=leandro' }}
                                    className="h-full w-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-slate-900" />
                        </View>
                        <View className="ml-4">
                            <Text className="text-white text-xl font-bold">{user.name.split(' ')[0]}</Text>
                            <View className="bg-blue-600 px-2 py-0.5 rounded self-start mt-1">
                                <Text className="text-white text-[10px] font-bold uppercase">{beltName} BELT</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <Ionicons name="notifications" size={28} color="#fca5a5" />
                    </TouchableOpacity>
                </View>

                {/* Hero: Next Session (Moved to Top) */}
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-white text-lg font-bold">Next Session</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                        <Text className="text-red-500 text-sm font-bold">See all</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-[#2A2323] rounded-2xl p-4 mb-6 flex-row overflow-hidden border border-white/5"
                    onPress={() => navigation.navigate('ClassDetail')}
                    activeOpacity={0.8}
                >
                    <View className="flex-1 pr-4">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="calendar" size={16} color="#ef4444" />
                            <Text className="text-gray-400 text-xs font-bold ml-2 uppercase">Today</Text>
                        </View>
                        <Text className="text-white text-xl font-bold mb-1">Fundamentals - Gi</Text>
                        <Text className="text-gray-400 text-sm mb-4">19:00 - 20:30 • Mat A</Text>

                        <View className="flex-row items-center">
                            <View className="h-6 w-6 bg-gray-600 rounded-full mr-2 overflow-hidden">
                                <Image source={{ uri: 'https://i.pravatar.cc/150?u=marcus' }} className="h-full w-full" />
                            </View>
                            <Text className="text-gray-400 text-sm">Instr. Marcus</Text>
                        </View>
                    </View>
                    <View className="w-24 bg-zinc-800 rounded-xl overflow-hidden">
                        <View className="flex-1 bg-zinc-700 items-center justify-center">
                            <Ionicons name="people" size={32} color="#52525b" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Secondary Action: Premium Check-In Button */}
                <TouchableOpacity
                    className="bg-white rounded-xl p-5 flex-row items-center justify-between mb-10 shadow-lg shadow-black/20"
                    onPress={() => navigation.navigate('ClassDetail')}
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center">
                        <View className="bg-black/5 p-2 rounded-lg mr-4">
                            <MaterialCommunityIcons name="qrcode-scan" size={28} color="black" />
                        </View>
                        <View>
                            <Text className="text-black text-lg font-bold">Check In</Text>
                            <Text className="text-gray-500 text-xs font-medium">Have a good training</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
                </TouchableOpacity>

                {/* Team Feed Preview */}
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-white text-lg font-bold">Team Feed</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('TeamFeed')}>
                        <Ionicons name="chevron-forward" size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Simplified Feed Item Preview */}
                <TouchableOpacity
                    className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700 flex-row items-start"
                    onPress={() => navigation.navigate('TeamFeed')}
                >
                    <View className="h-10 w-10 bg-gray-500 rounded-full mr-3 items-center justify-center">
                        <Text className="text-white font-bold">IM</Text>
                    </View>
                    <View className="flex-1">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-white font-bold">Instr. Marcus</Text>
                            <Text className="text-gray-500 text-xs">2h ago</Text>
                        </View>
                        <Text className="text-gray-400 text-sm line-clamp-2" numberOfLines={2}>
                            Great energy in the morning class! Everyone is sharpening their guard passing. Keep showing up! 🥋🔥
                        </Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
