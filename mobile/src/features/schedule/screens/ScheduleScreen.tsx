import React from 'react';
import { View, Text, SectionList, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

type ClassItem = {
    id: string;
    time: string;
    title: string;
    instructor: string;
    type: 'Gi' | 'No-Gi' | 'Kids' | 'Competition';
    duration: string;
};

type ScheduleSection = {
    title: string;
    data: ClassItem[];
};

const SCHEDULE_DATA: ScheduleSection[] = [
    {
        title: "Segunda-feira",
        data: [
            { id: '1', time: '06:00', title: 'Jiu-Jitsu Fundamentals', instructor: 'Prof. Bruno', type: 'Gi', duration: '1h' },
            { id: '2', time: '12:00', title: 'All Levels', instructor: 'Inst. Sarah', type: 'No-Gi', duration: '1h' },
            { id: '3', time: '18:00', title: 'Kids Class', instructor: 'Prof. Bruno', type: 'Kids', duration: '45m' },
            { id: '4', time: '19:00', title: 'Competition Training', instructor: 'Mestre Renato', type: 'Competition', duration: '1.5h' },
        ]
    },
    {
        title: "Terça-feira",
        data: [
            { id: '5', time: '07:00', title: 'Drills & Techniques', instructor: 'Inst. Sarah', type: 'Gi', duration: '1h' },
            { id: '6', time: '12:00', title: 'Advanced Concepts', instructor: 'Mestre Renato', type: 'Gi', duration: '1h' },
            { id: '7', time: '19:00', title: 'No-Gi Fundamentals', instructor: 'Prof. Bruno', type: 'No-Gi', duration: '1h' },
            { id: '8', time: '20:00', title: 'Open Mat', instructor: 'All', type: 'Gi', duration: '1h' },
        ]
    },
    {
        title: "Quarta-feira",
        data: [
            { id: '9', time: '06:00', title: 'Jiu-Jitsu Fundamentals', instructor: 'Prof. Bruno', type: 'Gi', duration: '1h' },
            { id: '10', time: '12:00', title: 'All Levels', instructor: 'Inst. Sarah', type: 'No-Gi', duration: '1h' },
            { id: '11', time: '18:00', title: 'Kids Class', instructor: 'Prof. Bruno', type: 'Kids', duration: '45m' },
            { id: '12', time: '19:00', title: 'Advanced Class', instructor: 'Mestre Renato', type: 'Gi', duration: '1.5h' },
        ]
    },
];

export default function ScheduleScreen() {
    const renderItem = ({ item }: { item: ClassItem }) => (
        <View className="bg-zinc-800 mx-4 mb-3 rounded-2xl p-4 flex-row items-center border border-zinc-700">
            {/* Time Column */}
            <View className="pr-4 border-r border-zinc-700 items-center justify-center w-20">
                <Text className="text-white text-lg font-bold">{item.time}</Text>
                <Text className="text-gray-500 text-xs font-bold">{item.duration}</Text>
            </View>

            {/* Info Column */}
            <View className="flex-1 px-4">
                <Text className="text-white text-base font-bold mb-1">{item.title}</Text>
                <View className="flex-row items-center">
                    <Ionicons name="person" size={12} color="#9ca3af" className="mr-1" />
                    <Text className="text-gray-400 text-sm">{item.instructor}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                    <View className={`px-2 py-0.5 rounded mr-2 ${item.type === 'Gi' ? 'bg-blue-900/50' :
                            item.type === 'No-Gi' ? 'bg-orange-900/50' :
                                item.type === 'Competition' ? 'bg-red-900/50' : 'bg-green-900/50'
                        }`}>
                        <Text className={`text-[10px] font-bold uppercase ${item.type === 'Gi' ? 'text-blue-200' :
                                item.type === 'No-Gi' ? 'text-orange-200' :
                                    item.type === 'Competition' ? 'text-red-200' : 'text-green-200'
                            }`}>{item.type}</Text>
                    </View>
                </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-xl">
                <Text className="text-white text-xs font-bold">Join</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = ({ section: { title } }: { section: ScheduleSection }) => (
        <View className="px-4 py-3 bg-slate-900">
            <Text className="text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <View className="px-4 py-4 border-b border-zinc-800 flex-row justify-between items-center mb-2">
                <Text className="text-white text-2xl font-bold">Weekly Schedule</Text>
                <Ionicons name="calendar" size={24} color="white" />
            </View>
            <SectionList
                sections={SCHEDULE_DATA}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
