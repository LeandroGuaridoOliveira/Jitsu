import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, SectionList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Types
type Belt = 'BLACK' | 'BROWN' | 'PURPLE' | 'BLUE' | 'WHITE';
type Role = 'INSTRUCTOR' | 'MEMBER';

interface Member {
    id: string;
    name: string;
    role: Role;
    belt: Belt;
    avatar: string;
}

// Mock Data
const MOCK_MEMBERS: Member[] = [
    { id: '1', name: 'Prof. Marco', role: 'INSTRUCTOR', belt: 'BLACK', avatar: 'https://i.pravatar.cc/150?u=marco' },
    { id: '2', name: 'Instr. Marcus', role: 'INSTRUCTOR', belt: 'BLACK', avatar: 'https://i.pravatar.cc/150?u=marcus' },
    { id: '3', name: 'Javier', role: 'MEMBER', belt: 'BROWN', avatar: 'https://i.pravatar.cc/150?u=javier' },
    { id: '4', name: 'Sarah', role: 'MEMBER', belt: 'BROWN', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '5', name: 'Mike', role: 'MEMBER', belt: 'PURPLE', avatar: 'https://i.pravatar.cc/150?u=mike' },
    { id: '6', name: 'Anna', role: 'MEMBER', belt: 'PURPLE', avatar: 'https://i.pravatar.cc/150?u=anna' },
    { id: '7', name: 'Tom', role: 'MEMBER', belt: 'BLUE', avatar: 'https://i.pravatar.cc/150?u=tom' },
    { id: '8', name: 'Jerry', role: 'MEMBER', belt: 'BLUE', avatar: 'https://i.pravatar.cc/150?u=jerry' },
    { id: '9', name: 'Me', role: 'MEMBER', belt: 'WHITE', avatar: 'https://i.pravatar.cc/150?u=me' },
    { id: '10', name: 'New Guy', role: 'MEMBER', belt: 'WHITE', avatar: 'https://i.pravatar.cc/150?u=new' },
];

const BELT_ORDER: Record<Belt, number> = {
    'BLACK': 0,
    'BROWN': 1,
    'PURPLE': 2,
    'BLUE': 3,
    'WHITE': 4
};

const BELT_COLORS: Record<Belt, string> = {
    'BLACK': '#171717', // neutral-900 (simulating black belt)
    'BROWN': '#78350f', // amber-900 (brown)
    'PURPLE': '#581c87', // purple-900
    'BLUE': '#1e3a8a', // blue-900
    'WHITE': '#e5e5e5' // neutral-200
};

const BELT_LABELS: Record<Belt, string> = {
    'BLACK': 'Black Belt',
    'BROWN': 'Brown Belt',
    'PURPLE': 'Purple Belt',
    'BLUE': 'Blue Belt',
    'WHITE': 'White Belt'
};

export default function TeamInfoScreen() {
    const navigation = useNavigation();

    // Grouping Logic
    const sections = useMemo(() => {
        // 1. Separate Instructors
        const instructors = MOCK_MEMBERS.filter(m => m.role === 'INSTRUCTOR');

        // 2. Group Remaining Members by Belt
        const members = MOCK_MEMBERS.filter(m => m.role !== 'INSTRUCTOR');

        // Sort members by belt ranking first (even though we section them, clean global sort helps)
        members.sort((a, b) => BELT_ORDER[a.belt] - BELT_ORDER[b.belt]);

        // Create Sections
        const grouped: { title: string; data: Member[], type: 'INSTRUCTOR' | 'BELT', beltColor?: string }[] = [];

        // Add Instructors Section
        if (instructors.length > 0) {
            grouped.push({
                title: 'Instructors',
                data: instructors,
                type: 'INSTRUCTOR'
            });
        }

        // Add Belt Sections
        const belts = [...new Set(members.map(m => m.belt))].sort((a, b) => BELT_ORDER[a] - BELT_ORDER[b]);

        belts.forEach(belt => {
            grouped.push({
                title: BELT_LABELS[belt],
                data: members.filter(m => m.belt === belt),
                type: 'BELT',
                beltColor: BELT_COLORS[belt]
            });
        });

        return grouped;

    }, []);

    const renderMember = ({ item }: { item: Member }) => (
        <View className="flex-row items-center bg-zinc-900/50 p-3 mb-2 rounded-xl mx-4">
            <Image
                source={{ uri: item.avatar }}
                className="w-12 h-12 rounded-full mr-4 border border-white/10"
            />
            <View className="flex-1">
                <Text className="text-white font-bold text-base">{item.name}</Text>
                <View className="flex-row items-center">
                    <View className={`h-2 w-2 rounded-full mr-2`} style={{ backgroundColor: BELT_COLORS[item.belt] }} />
                    <Text className="text-slate-400 text-xs font-medium uppercase">{item.belt} BELT</Text>
                </View>
            </View>
            {/* Optional: Add chevron or more info */}
        </View>
    );

    const renderSectionHeader = ({ section: { title, type, beltColor } }: any) => (
        <View className="px-4 py-2 mt-4 mb-2 flex-row items-center">
            {type === 'BELT' && (
                <View
                    style={{ backgroundColor: beltColor }}
                    className="w-1 h-4 mr-2 rounded-full"
                />
            )}
            <Text className={`text-sm font-bold uppercase tracking-wider ${type === 'INSTRUCTOR' ? 'text-red-500' : 'text-slate-500'}`}>
                {title}
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="px-4 pt-2 pb-6 border-b border-white/5 bg-slate-900">
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">Team Info</Text>
                    <View className="w-10" />
                </View>

                {/* Team Banner Info */}
                <View className="items-center">
                    <View className="w-24 h-24 bg-zinc-800 rounded-3xl items-center justify-center mb-4 border-2 border-white/10 shadow-xl">
                        <Text className="text-4xl text-slate-600 font-black">A</Text>
                    </View>
                    <Text className="text-white text-2xl font-bold mb-1">Alliance HQ</Text>
                    <Text className="text-slate-400 text-sm">São Paulo, Brazil</Text>
                </View>
            </View>

            {/* Members List */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderMember}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1"
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    );
}
