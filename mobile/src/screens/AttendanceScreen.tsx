import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Switch, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Types ---
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PENDING';
type BeltColor = 'White' | 'Blue' | 'Purple' | 'Brown' | 'Black';

interface Student {
    id: string;
    name: string;
    belt: BeltColor;
    totalClasses: number;
    avatarUrl?: string; // Optional, using placeholders if not present
}

interface AttendanceRecord {
    studentId: string;
    status: AttendanceStatus;
}

// --- Mock Data ---
const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Leandro Oliveira', belt: 'Blue', totalClasses: 42, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sarah Connor', belt: 'White', totalClasses: 12, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Marcus Jones', belt: 'Purple', totalClasses: 156, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Elena Rodriguez', belt: 'Blue', totalClasses: 89, avatarUrl: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Tyson Lee', belt: 'Brown', totalClasses: 112, avatarUrl: 'https://i.pravatar.cc/150?u=5' },
    { id: '6', name: 'Jordan Smith', belt: 'White', totalClasses: 5 },
    { id: '7', name: 'Rickson Gracie', belt: 'Black', totalClasses: 4000 },
];

// --- Helpers ---
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

export default function AttendanceScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    // Assuming route.params could have class details, defaulting for demo
    // const { classId, className } = route.params as any || {}; 

    // State
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

    // Toggle Logic
    const handleAttendance = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === status ? 'PENDING' : status
        }));
    };

    // Computed Stats
    const stats = useMemo(() => {
        const total = MOCK_STUDENTS.length;
        const present = Object.values(attendance).filter(s => s === 'PRESENT').length;
        const absent = Object.values(attendance).filter(s => s === 'ABSENT').length;
        return { total, present, absent };
    }, [attendance]);

    // Render Item
    const renderStudentCard = ({ item }: { item: Student }) => {
        const status = attendance[item.id] || 'PENDING';
        const isPresent = status === 'PRESENT';
        const isAbsent = status === 'ABSENT';

        // Card Styles based on status
        // Base: bg-zinc-800 border-zinc-700
        // Present: border-green-500/50
        // Absent: opacity-60
        let cardStyle = "bg-zinc-800 border border-zinc-700";
        if (isPresent) cardStyle = "bg-zinc-800 border border-green-500/50";
        if (isAbsent) cardStyle = "bg-zinc-800 border border-red-900/30 opacity-75";

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
                        {/* Status Check on Avatar (optional, like online status) - skipping as not in request requirements explicitly but good for polish */}
                    </View>

                    {/* Text Info */}
                    <View>
                        <Text className="text-white font-bold text-base">{item.name}</Text>
                        <View className="flex-row items-center mt-1 space-x-2">
                            {/* Belt Badge */}
                            <View className={`px-2 py-0.5 rounded-full ${beltStyle}`}>
                                <Text className={`text-[10px] uppercase font-bold tracking-wider ${beltStyle.includes('text-slate-900') ? 'text-slate-900' : 'text-white'}`}>
                                    {item.belt} Belt
                                </Text>
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
                        className={`w-10 h-10 rounded-full items-center justify-center border ${isAbsent ? 'bg-red-600 border-red-500' : 'bg-red-500/20 border-transparent'}`}
                    >
                        <Ionicons name="close" size={20} color={isAbsent ? "white" : "#ef4444"} />
                    </TouchableOpacity>

                    {/* Present Button */}
                    <TouchableOpacity
                        onPress={() => handleAttendance(item.id, 'PRESENT')}
                        className={`w-10 h-10 rounded-full items-center justify-center border ${isPresent ? 'bg-green-600 border-green-500' : 'bg-green-500/20 border-transparent'}`}
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
                    {stats.absent > 0 && (
                        <View className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                            <Text className="text-red-400 text-xs font-bold">{stats.absent} Absent</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* --- List --- */}
            <FlatList
                data={MOCK_STUDENTS}
                keyExtractor={(item) => item.id}
                renderItem={renderStudentCard}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* --- Bottom Floating Panel/FAB --- */}
            {/* Using a bottom panel style for the summary or just a FAB as requested */}
            {/* Request: "FAB (Botão Flutuante): bg-red-600... canto inferior direito" */}

            {/* But first, let's add the small summary pill usually seen at bottom left in some designs, 
                or just stick to the FAB strict requirement. 
                The image shows a "12/20 Present" pill fixed at bottom left maybe? 
                The user asked for "FAB ... canto inferior direito". I will add that. 
                Wait, looking at image description "12/20 Present" is in a bottom bar/pill.
                I will add both for completeness if it fits "faithful replication", but strictly the user *asked* for FAB.
                I will add the floating summary pill on the left and FAB on right.
            */}
            <View className="absolute bottom-6 left-5 right-5 flex-row justify-between items-center pointer-events-none">
                <View className="bg-zinc-800/90 px-4 py-3 rounded-full border border-zinc-700 shadow-xl flex-row items-center pointer-events-auto">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-white font-bold text-sm">
                        {stats.present}/{MOCK_STUDENTS.length} Present
                    </Text>
                </View>

                <TouchableOpacity
                    className="w-14 h-14 bg-red-600 rounded-full items-center justify-center shadow-lg pointer-events-auto active:bg-red-700"
                    style={{ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}
