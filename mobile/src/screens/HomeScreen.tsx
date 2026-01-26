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
    // const monthsInGrade = teamMember ? calculateTimeInGrade(teamMember.currentBelt.awardedAt) : 0;

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            <ScrollView className="flex-1 px-6 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View className="flex-row items-center">
                        <View className="relative">
                            <View className="h-14 w-14 bg-gray-300 rounded-full border-2 border-slate-700 items-center justify-center overflow-hidden">
                                {/* Avatar Placeholder */}
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
                                <Text className="text-white text-xs font-bold uppercase">{beltName} BELT</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <Ionicons name="notifications" size={28} color="#fca5a5" />
                    </TouchableOpacity>
                </View>

                {/* Check In Button */}
                <TouchableOpacity
                    className="bg-red-600 rounded-2xl p-6 flex-row items-center justify-center mb-10 shadow-lg shadow-red-900/50"
                    onPress={() => navigation.navigate('ClassDetail')}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={42} color="white" />
                    <View className="ml-4">
                        <Text className="text-white text-2xl font-bold tracking-wider">CHECK IN</Text>
                        <Text className="text-red-100 text-xs tracking-widest uppercase">Ready to roll</Text>
                    </View>
                </TouchableOpacity>

                {/* Next Session */}
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-white text-lg font-bold">Next Session</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                        <Text className="text-red-500 text-sm font-bold">See all</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-[#2A2323] rounded-2xl p-4 mb-8 flex-row overflow-hidden border border-white/5"
                    onPress={() => navigation.navigate('ClassDetail')}
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
                        {/* Class Image Placeholder */}
                        <View className="flex-1 bg-zinc-700 items-center justify-center">
                            <Ionicons name="people" size={32} color="#52525b" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Your Progress */}
                <Text className="text-white text-lg font-bold mb-4">Your Progress</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-8">
                    {/* Card 1 */}
                    <View className="bg-[#1C1C1E] rounded-2xl p-4 w-32 mr-4 border border-zinc-800">
                        <Ionicons name="barbell" size={24} color="#ef4444" className="mb-2" />
                        <Text className="text-gray-500 text-[10px] font-bold uppercase mt-2">This Month</Text>
                        <View className="flex-row items-baseline mt-1">
                            <Text className="text-white text-3xl font-bold">12</Text>
                            <Text className="text-gray-400 text-xs ml-1">Classes</Text>
                        </View>
                    </View>

                    {/* Card 2 */}
                    <View className="bg-[#1C1C1E] rounded-2xl p-4 w-32 mr-4 border border-zinc-800">
                        <Ionicons name="school" size={24} color="#ef4444" className="mb-2" />
                        <Text className="text-gray-500 text-[10px] font-bold uppercase mt-2">Techniques</Text>
                        <View className="flex-row items-baseline mt-1">
                            <Text className="text-white text-3xl font-bold">4</Text>
                            <Text className="text-gray-400 text-xs ml-1">Learned</Text>
                        </View>
                    </View>

                    {/* Card 3 */}
                    <View className="bg-[#1C1C1E] rounded-2xl p-4 w-32 mr-4 border border-zinc-800">
                        <Ionicons name="flame" size={24} color="#ef4444" className="mb-2" />
                        <Text className="text-gray-500 text-[10px] font-bold uppercase mt-2">Streak</Text>
                        <View className="flex-row items-baseline mt-1">
                            <Text className="text-white text-3xl font-bold">3</Text>
                            <Text className="text-gray-400 text-xs ml-1">Days</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Team Feed Entry Point */}
                <TouchableOpacity
                    className="mb-8 flex-row items-center justify-between"
                    onPress={() => navigation.navigate('TeamFeed')}
                >
                    <Text className="text-white text-lg font-bold">Team Feed</Text>
                    <Ionicons name="chevron-forward" size={24} color="gray" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
