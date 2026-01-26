import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Types ---
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PENDING';
type BeltColor = 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';

interface Student {
    id: string;
    name: string;
    belt: BeltColor;
    degrees: number;
    totalClasses: number;
    avatarUrl?: string;
    initialStatus?: AttendanceStatus; // Simulates "checked in" or "absent" via app
}

// --- Helpers for Sorting ---
const BELT_RANK_VALUE: Record<BeltColor, number> = {
    'White': 1,
    'Blue': 2,
    'Purple': 3,
    'Brown': 4,
    'Black': 5
};

const getBeltColors = (belt: BeltColor) => {
    switch (belt) {
        case 'White': return 'bg-slate-200 text-slate-900 border-none';
        case 'Blue': return 'bg-blue-600 text-white border-none';
        case 'Purple': return 'bg-purple-600 text-white border-none';
        case 'Brown': return 'bg-amber-800 text-white border-none';
        case 'Black': return 'bg-neutral-900 text-white border border-zinc-700';
        default: return 'bg-slate-700 text-white';
    }
};

// --- Mock Data ---
const MOCK_STUDENTS_RAW: Student[] = [
    { id: '1', name: 'Leandro Oliveira', belt: 'Blue', degrees: 2, totalClasses: 42, avatarUrl: 'https://i.pravatar.cc/150?u=1', initialStatus: 'PRESENT' },
    { id: '2', name: 'Sarah Connor', belt: 'White', degrees: 0, totalClasses: 12, avatarUrl: 'https://i.pravatar.cc/150?u=2', initialStatus: 'PENDING' },
    { id: '3', name: 'Marcus Jones', belt: 'Purple', degrees: 1, totalClasses: 156, avatarUrl: 'https://i.pravatar.cc/150?u=3', initialStatus: 'ABSENT' }, // Marked absent via app
    { id: '4', name: 'Elena Rodriguez', belt: 'Blue', degrees: 4, totalClasses: 89, avatarUrl: 'https://i.pravatar.cc/150?u=4', initialStatus: 'PRESENT' },
    { id: '5', name: 'Tyson Lee', belt: 'Brown', degrees: 0, totalClasses: 112, avatarUrl: 'https://i.pravatar.cc/150?u=5', initialStatus: 'PENDING' },
    { id: '6', name: 'Jordan Smith', belt: 'White', degrees: 3, totalClasses: 5, initialStatus: 'PENDING' },
    { id: '7', name: 'Rickson Gracie', belt: 'Black', degrees: 9, totalClasses: 4000, initialStatus: 'PRESENT' },
    { id: '8', name: 'John Wick', belt: 'Black', degrees: 0, totalClasses: 200, initialStatus: 'PENDING' },
];

export default function AttendanceScreen() {
    const navigation = useNavigation();

    // 1. Sort Students (Higher Rank First, then Degrees, then Name)
    const sortedStudents = useMemo(() => {
        return [...MOCK_STUDENTS_RAW].sort((a, b) => {
            const rankA = BELT_RANK_VALUE[a.belt];
            const rankB = BELT_RANK_VALUE[b.belt];
            if (rankA !== rankB) return rankB - rankA; // Higher belt first

            if (a.degrees !== b.degrees) return b.degrees - a.degrees; // Higher degrees first

            return a.name.localeCompare(b.name); // Alphabetical fallback
        });
    }, []);

    // 2. Initialize State with Mocked Initial Status
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

    useEffect(() => {
        const initialMap: Record<string, AttendanceStatus> = {};
        sortedStudents.forEach(s => {
            initialMap[s.id] = s.initialStatus || 'PENDING';
        });
        setAttendance(initialMap);
    }, [sortedStudents]);

    // Toggle Logic
    const handleAttendance = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => {
            const current = prev[studentId];
            // If clicking the same status, toggle back to pending? 
            // User requirement: "professor must allow changing status... from present to absent".
            // So direct switch. If clicking same, maybe reset to pending (neutral) is okay.
            const newStatus: AttendanceStatus = current === status ? 'PENDING' : status;
            return { ...prev, [studentId]: newStatus };
        });
    };

    // Computed Stats
    const stats = useMemo(() => {
        const total = sortedStudents.length;
        const present = Object.values(attendance).filter(s => s === 'PRESENT').length;
        const absent = Object.values(attendance).filter(s => s === 'ABSENT').length;
        const pending = Object.values(attendance).filter(s => s === 'PENDING').length;
        const allMarked = pending === 0;
        return { total, present, absent, pending, allMarked };
    }, [attendance, sortedStudents]);

    const handleFinishClass = () => {
        Alert.alert(
            "Finalizar Chamada",
            `Confirm attendance?\n\nPresent: ${stats.present}\nAbsent: ${stats.absent}`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Confirm", onPress: () => navigation.goBack() }
            ]
        );
    };

    // Render Item
    const renderStudentCard = ({ item }: { item: Student }) => {
        const status = attendance[item.id] || 'PENDING';
        const isPresent = status === 'PRESENT';
        const isAbsent = status === 'ABSENT';

        let cardStyle = "bg-zinc-800 border border-zinc-700";
        if (isPresent) cardStyle = "bg-zinc-800 border border-green-500/50";
        if (isAbsent) cardStyle = "bg-zinc-800 border border-red-900/30 opacity-70";

        const beltStyle = getBeltColors(item.belt);

        return (
            <View className={`rounded-2xl p-4 mb-3 flex-row items-center justify-between ${cardStyle}`}>
                {/* Left: Avatar & Info */}
                <View className="flex-row items-center flex-1">
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-zinc-700 mr-4 overflow-hidden border border-white/10 items-center justify-center relative">
                        {item.avatarUrl ? (
                            <Image source={{ uri: item.avatarUrl }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <Text className="text-white font-bold text-lg">{item.name.charAt(0)}</Text>
                        )}
                        {/* Status Check on Avatar */}
                        {isPresent && (
                            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-800 z-10" />
                        )}
                    </View>

                    {/* Text Info */}
                    <View>
                        <Text className={`font-bold text-base ${isAbsent ? 'text-slate-500 line-through' : 'text-white'}`}>{item.name}</Text>
                        <View className="flex-row items-center mt-1 space-x-2">
                            {/* Belt Badge */}
                            <View className={`px-2 py-0.5 rounded-full flex-row items-center ${beltStyle}`}>
                                <Text className={`text-[10px] uppercase font-bold tracking-wider ${beltStyle.includes('text-slate-900') ? 'text-slate-900' : 'text-white'}`}>
                                    {item.belt}
                                </Text>
                                {/* Degrees visualisation */}
                                {item.degrees > 0 && (
                                    <View className="flex-row ml-1 space-x-0.5">
                                        {[...Array(item.degrees)].map((_, i) => (
                                            <View key={i} className={`w-1 h-1 rounded-full ${item.belt === 'White' ? 'bg-slate-800' : 'bg-white'}`} />
                                        ))}
                                    </View>
                                )}
                            </View>
                            <Text className="text-slate-400 text-xs">• {item.totalClasses} Classes</Text>
                        </View>
                    </View>
                </View>

                {/* Right: Actions */}
                <View className="flex-row items-center space-x-3 ml-2">
                    {/* Absent Button */}
                    <TouchableOpacity
                        onPress={() => handleAttendance(item.id, 'ABSENT')}
                        className={`w-10 h-10 rounded-full items-center justify-center border ${isAbsent ? 'bg-red-600 border-red-500' : 'bg-red-500/10 border-transparent'}`}
                    >
                        <Ionicons name="close" size={20} color={isAbsent ? "white" : "#ef4444"} />
                    </TouchableOpacity>

                    {/* Present Button */}
                    <TouchableOpacity
                        onPress={() => handleAttendance(item.id, 'PRESENT')}
                        className={`w-10 h-10 rounded-full items-center justify-center border ${isPresent ? 'bg-green-600 border-green-500' : 'bg-green-500/10 border-transparent'}`}
                    >
                        <Ionicons name="checkmark" size={20} color={isPresent ? "white" : "#22c55e"} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* --- Header --- */}
            <View className="px-5 pt-4 pb-2">
                {/* Nav Row */}
                <View className="flex-row justify-between items-center mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center -ml-2"
                    >
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">Class Attendance</Text>
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <MaterialCommunityIcons name="tune-variant" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Title Section */}
                <View className="mb-6">
                    <Text className="text-white text-3xl font-extrabold mb-1">07:00 AM</Text>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-white text-xl font-bold">Fundamentals</Text>
                        <View className="w-1 h-1 bg-slate-500 rounded-full" />
                        <Text className="text-slate-400 font-medium">Gi Class</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="location-sharp" size={14} color="#94a3b8" />
                        <Text className="text-slate-400 ml-1 font-medium">Mat 2 • Prof. Silva</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-slate-400 font-bold tracking-wider text-xs uppercase">
                        Students ({stats.total})
                    </Text>
                    <View className="flex-row space-x-2">
                        {stats.absent > 0 && (
                            <View className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                <Text className="text-red-400 text-xs font-bold">{stats.absent} Absent</Text>
                            </View>
                        )}
                        <View className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <Text className="text-green-400 text-xs font-bold">{stats.present} Present</Text>
                        </View>
                    </View>

                </View>
            </View>

            {/* --- List --- */}
            <FlatList
                data={sortedStudents}
                keyExtractor={(item) => item.id}
                renderItem={renderStudentCard}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={(
                    <View className="mt-8 mb-4">
                        <TouchableOpacity
                            onPress={handleFinishClass}
                            disabled={!stats.allMarked}
                            className={`w-full py-4 rounded-xl items-center justify-center flex-row shadow-lg ${stats.allMarked ? 'bg-red-600 active:bg-red-700' : 'bg-slate-800 opacity-50'
                                }`}
                        >
                            {!stats.allMarked && <Ionicons name="lock-closed" size={18} color="#94a3b8" style={{ marginRight: 8 }} />}
                            <Text className={`font-bold text-lg ${stats.allMarked ? 'text-white' : 'text-slate-500'}`}>
                                Encerrar Chamada
                            </Text>
                        </TouchableOpacity>
                        {!stats.allMarked && (
                            <Text className="text-slate-500 text-xs text-center mt-3">
                                Mark all students to finish class ({stats.pending} remaining)
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* --- Summary Pill (Left Side Only) --- */}
            <View className="absolute bottom-6 left-5 pointer-events-none">
                <View className="bg-zinc-800/90 px-4 py-3 rounded-full border border-zinc-700 shadow-xl flex-row items-center pointer-events-auto">
                    <View className={`w-2 h-2 rounded-full mr-2 ${stats.allMarked ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <Text className="text-white font-bold text-sm">
                        {stats.present}/{sortedStudents.length} Present
                    </Text>
                </View>
            </View>

        </SafeAreaView>
    );
}
