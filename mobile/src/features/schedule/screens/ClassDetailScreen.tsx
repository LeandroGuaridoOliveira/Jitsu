import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';

type ClassDetailScreenRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

export default function ClassDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<ClassDetailScreenRouteProp>();
    const { title, time, instructor, tags = [] } = route.params || {};
    const { teamMember } = useAuthStore();
    const isProfessor = teamMember?.role === 'HEAD_COACH';

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    const handleCheckIn = () => {
        setIsCheckedIn(true);
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setIsCheckedIn(false);
        // Add cancel logic here
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* 1. Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold">Class Details</Text>
                <View className="w-10" /> {/* Spacer for centering */}
            </View>

            <ScrollView className="flex-1">
                {/* 2. Hero Section (Class Info) */}
                <View className="bg-zinc-900 mx-6 mt-4 p-6 rounded-2xl border border-zinc-800 shadow-sm">
                    {/* Date */}
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                        MONDAY, OCT 24
                    </Text>

                    {/* Time */}
                    <Text className="text-white text-4xl font-bold mb-2">
                        {time || "19:00 - 20:30"}
                    </Text>

                    {/* Title */}
                    <Text className="text-white text-xl font-semibold mb-4 leading-tight">
                        {title || "Advanced Gi Techniques"}
                    </Text>

                    {/* Location Badge */}
                    <View className="flex-row items-center bg-zinc-800 self-start px-3 py-1.5 rounded-lg border border-zinc-700">
                        <Ionicons name="location-sharp" size={14} color="#dc2626" />
                        <Text className="text-gray-300 text-xs font-medium ml-1.5">Mat A (Tatame A)</Text>
                    </View>
                </View>

                {/* 3. Instructor Row */}
                <View className="flex-row items-center mx-6 mt-8 mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <View className="h-12 w-12 rounded-full bg-zinc-700 items-center justify-center border border-zinc-600">
                        <Ionicons name="person" size={20} color="#e4e4e7" />
                    </View>
                    <View className="ml-4">
                        <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-0.5">
                            Instructor
                        </Text>
                        <Text className="text-white text-base font-semibold">
                            {instructor || "Professor Silva"}
                        </Text>
                    </View>
                </View>

                {/* 4. Attendees Section (Roster) */}
                <View className="mx-6 mb-32">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider">
                            Confirmed Athletes
                        </Text>
                        <Text className="text-zinc-500 text-xs font-medium">12 / 30 Spots</Text>
                    </View>

                    <View className="flex-row items-center">
                        {/* Face Pile */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <View
                                key={i}
                                className="h-12 w-12 rounded-full bg-zinc-700 border-2 border-slate-900 items-center justify-center -ml-3 first:ml-0"
                            >
                                <Text className="text-xs text-zinc-400 font-medium">S{i}</Text>
                            </View>
                        ))}

                        {/* Remaining Count */}
                        <View className="h-12 w-12 rounded-full bg-zinc-800 border-2 border-slate-900 items-center justify-center -ml-3">
                            <Text className="text-xs text-gray-400 font-semibold">+7</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* 5. Action Footer */}
            <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-10 pb-8 px-6">
                {isProfessor ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="bg-indigo-600 w-full py-4 rounded-xl items-center shadow-lg shadow-indigo-900/40 border border-indigo-500"
                        onPress={() => navigation.navigate('Attendance')}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="list" size={24} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-lg tracking-wide">
                                REALIZAR CHAMADA
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : !isCheckedIn ? (
                    <>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="bg-red-600 w-full py-4 rounded-xl items-center shadow-lg shadow-red-900/40"
                            onPress={handleCheckIn}
                        >
                            <Text className="text-white font-bold text-lg tracking-wide">
                                CONFIRM PRESENCE
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mt-4 items-center"
                            onPress={handleCancel}
                        >
                            <Text className="text-zinc-500 text-sm font-medium">
                                Report Absence
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="bg-zinc-800 w-full py-4 rounded-xl items-center border border-zinc-700"
                        onPress={handleCancel}
                    >
                        <Text className="text-red-500 font-bold text-lg tracking-wide">
                            CANCEL CHECK-IN
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* 6. Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmation}
                onRequestClose={() => setShowConfirmation(false)}
            >
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <View className="bg-zinc-900 p-8 rounded-2xl items-center border border-zinc-800 w-full  max-w-xs shadow-2xl">
                        <View className="h-16 w-16 bg-green-900/30 rounded-full items-center justify-center mb-6 border border-green-900/50">
                            <Ionicons name="checkmark" size={32} color="#4ade80" />
                        </View>

                        <Text className="text-white text-xl font-bold text-center mb-2">
                            You're In!
                        </Text>
                        <Text className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                            Your spot is confirmed. See you on the mats.
                        </Text>

                        <TouchableOpacity
                            className="bg-white w-full py-3 rounded-lg items-center"
                            onPress={() => setShowConfirmation(false)}
                        >
                            <Text className="text-zinc-900 font-bold">CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}
