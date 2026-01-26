import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_USER_PROFILE = {
    name: "Leandro Guarido",
    team: "Alliance SP",
    avatarUrl: "https://i.pravatar.cc/300?u=leandro",
    currentBelt: { color: 'BLUE', stripes: 3 },
    id: "9982-1234-BR",
    stats: {
        classesTotal: 142,
        nextStripe: 15, // Classes remaining
        joinDate: "Jan 12, 2021"
    },
    graduationHistory: [
        { color: 'WHITE', date: 'Jan 2021', status: 'COMPLETED', stripes: 4 },
        { color: 'BLUE', date: 'Jun 2023', status: 'ACTIVE', stripes: 3 },
        { color: 'PURPLE', date: 'Locked', status: 'LOCKED', stripes: 0 },
    ],
    instructor: "Prof. Almeida",
    membership: "Premium"
};

const BeltVisual = ({ color, stripes }: { color: string, stripes: number }) => {
    // Basic color mapping for gradients
    const getColors = (c: string) => {
        switch (c) {
            case 'WHITE': return ['#e5e7eb', '#f9fafb', '#d1d5db'];
            case 'BLUE': return ['#1e40af', '#3b82f6', '#172554'];
            case 'PURPLE': return ['#581c87', '#7e22ce', '#3b0764'];
            case 'BROWN': return ['#451a03', '#78350f', '#451a03'];
            case 'BLACK': return ['#000000', '#27272a', '#000000'];
            default: return ['#3f3f46', '#52525b', '#27272a'];
        }
    };

    const colors = getColors(color);

    return (
        <View className="h-24 w-full rounded-lg overflow-hidden flex-row items-center relative shadow-lg shadow-black/50">
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute w-full h-full"
            />

            {/* Texture overlay (mocked with mild opacity) */}
            <View className="absolute w-full h-full bg-black/10" />

            <View className="flex-1 pl-6">
                <Text className="text-white/70 text-[10px] uppercase font-bold tracking-widest mb-1">Current Rank</Text>
                <Text className="text-white text-3xl font-black uppercase italic tracking-tighter shadow-sm">{color} BELT</Text>
            </View>

            {/* Black Bar (Ponta Preta) */}
            <View className="h-full w-24 bg-black border-l-4 border-black/20 flex-row items-center justify-end px-3 gap-1">
                {/* Stripes */}
                {[...Array(4)].map((_, i) => (
                    <View
                        key={i}
                        className={`w-3 h-16 transform -skew-x-12 ${i < stripes ? 'bg-white shadow-md' : 'bg-white/10'}`}
                    />
                ))}
                {/* Red tag usually on black belt, but regular belts have black bar */}
                {color === 'BLACK' && <View className="absolute top-0 bottom-0 left-0 right-0 border-l-4 border-red-800 bg-red-600 -z-10" />}
            </View>
        </View>
    );
};

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#120a0a]">
            <StatusBar style="light" />

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <Ionicons name="chevron-back" size={24} color="white" />
                <Text className="text-white text-base font-bold tracking-widest uppercase">My Profile</Text>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            </View>

            <ScrollView className="flex-1 px-6 pt-4">

                {/* Profile Card Container */}
                <View className="bg-[#1a1515] rounded-[32px] p-6 border border-white/5 shadow-2xl shadow-red-900/10 mb-8">

                    {/* Active Status Badge */}
                    <View className="absolute top-6 right-6 bg-green-900/30 border border-green-500/30 px-3 py-1 rounded-full flex-row items-center">
                        <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <Text className="text-green-400 text-[10px] font-bold uppercase tracking-wider">Active</Text>
                    </View>

                    {/* Shield Icon Top Left */}
                    <View className="absolute top-6 left-6 bg-white/5 p-2 rounded-xl">
                        <Ionicons name="shield-checkmark" size={20} color="#71717a" />
                    </View>

                    {/* Avatar */}
                    <View className="items-center mt-4 mb-6">
                        <View className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-zinc-800 to-zinc-900 border-2 border-zinc-800 relative">
                            <Image
                                source={{ uri: MOCK_USER_PROFILE.avatarUrl }}
                                className="w-full h-full rounded-full"
                            />
                            <View className="absolute bottom-1 right-1 bg-red-600 p-2 rounded-full border-4 border-[#1a1515] shadow-lg">
                                <Ionicons name="pencil" size={14} color="white" />
                            </View>
                        </View>

                        <Text className="text-white text-3xl font-black mt-4 uppercase tracking-tight">{MOCK_USER_PROFILE.name}</Text>
                        <Text className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">{MOCK_USER_PROFILE.team}</Text>
                        <Text className="text-red-900/60 text-[10px] font-bold tracking-widest">ID: {MOCK_USER_PROFILE.id}</Text>
                    </View>

                    {/* Belt Component */}
                    <View className="mb-8">
                        <BeltVisual color={MOCK_USER_PROFILE.currentBelt.color} stripes={MOCK_USER_PROFILE.currentBelt.stripes} />
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row justify-between mb-2">
                        <View className="flex-1 items-center border-r border-white/5">
                            <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Total Classes</Text>
                            <Text className="text-white text-2xl font-black">{MOCK_USER_PROFILE.stats.classesTotal}</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Next Stripe</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-white text-2xl font-black">~{MOCK_USER_PROFILE.stats.nextStripe}</Text>
                                <Text className="text-zinc-600 text-xs ml-1 font-medium">classes</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Graduation History */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-end mb-6">
                        <Text className="text-white text-lg font-bold">Graduation History</Text>
                        <Text className="text-red-500 text-sm font-bold">View Full</Text>
                    </View>

                    {/* Timeline Visual */}
                    <View className="flex-row justify-between items-center px-4 relative">
                        {/* Line Background */}
                        <View className="absolute left-6 right-6 top-3 h-0.5 bg-zinc-800" />

                        {MOCK_USER_PROFILE.graduationHistory.map((grad, index) => (
                            <View key={index} className="items-center z-10">
                                <View className="mb-4">
                                    <Text className={`text-[10px] font-bold uppercase mb-1 ${grad.status === 'ACTIVE' ? 'text-red-500' : 'text-zinc-500'}`}>
                                        {grad.date}
                                    </Text>
                                </View>

                                <View className={`w-6 h-6 rounded-full border-4 ${grad.status === 'ACTIVE' ? 'bg-red-600 border-[#120a0a] shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-125' :
                                        grad.status === 'COMPLETED' ? 'bg-zinc-800 border-[#120a0a]' : 'bg-zinc-900 border-zinc-800'
                                    }`} />

                                <View className="mt-4 items-center">
                                    <Text className={`text-xs font-black uppercase ${grad.status === 'LOCKED' ? 'text-zinc-700' : 'text-white'}`}>
                                        {grad.color}
                                    </Text>
                                    {grad.status !== 'LOCKED' && <Text className="text-zinc-500 text-[10px]">{grad.stripes} Stripes</Text>}
                                    {grad.status === 'LOCKED' && <Text className="text-zinc-700 text-[10px]">Locked</Text>}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <View className="bg-[#1a1515] rounded-3xl p-6 mb-10 border border-white/5">
                    {/* Item 1 */}
                    <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-white/5">
                        <View className="flex-row items-center">
                            <Ionicons name="school" size={20} color="#71717a" />
                            <Text className="text-zinc-400 text-sm font-medium ml-3">Instructor</Text>
                        </View>
                        <Text className="text-white font-bold">{MOCK_USER_PROFILE.instructor}</Text>
                    </View>

                    {/* Item 2 */}
                    <View className="flex-row items-center justify-between mb-6 pb-6 border-b border-white/5">
                        <View className="flex-row items-center">
                            <Ionicons name="calendar" size={20} color="#71717a" />
                            <Text className="text-zinc-400 text-sm font-medium ml-3">Start Date</Text>
                        </View>
                        <Text className="text-white font-bold">{MOCK_USER_PROFILE.stats.joinDate}</Text>
                    </View>

                    {/* Item 3 */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="card" size={20} color="#71717a" />
                            <Text className="text-zinc-400 text-sm font-medium ml-3">Membership</Text>
                        </View>
                        <Text className="text-white font-bold">{MOCK_USER_PROFILE.membership}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
