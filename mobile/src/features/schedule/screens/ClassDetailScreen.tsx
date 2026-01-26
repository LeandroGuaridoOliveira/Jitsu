import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ClassDetailScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header / Nav */}
            <View className="px-4 py-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-white text-3xl font-bold mb-2">Fundamentals - Gi</Text>
                <View className="flex-row items-center mb-8">
                    <View className="bg-red-600 px-3 py-1 rounded mr-3">
                        <Text className="text-white font-bold text-xs">TODAY</Text>
                    </View>
                    <Text className="text-gray-300">19:00 - 20:30 • Mat A</Text>
                </View>

                {/* Info Card */}
                <View className="bg-zinc-800 rounded-xl p-6 mb-8">
                    <View className="flex-row items-center mb-6">
                        <Ionicons name="person-circle-outline" size={40} color="white" />
                        <View className="ml-4">
                            <Text className="text-sm text-gray-400 uppercase font-bold">Instructor</Text>
                            <Text className="text-white text-lg font-semibold">Marcus Almeida</Text>
                        </View>
                    </View>

                    <View className="h-[1px] bg-zinc-700 mb-6" />

                    <View>
                        <Text className="text-sm text-gray-400 uppercase font-bold mb-4">Who is going (5)</Text>
                        <View className="flex-row">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View key={i} className="h-10 w-10 bg-zinc-600 rounded-full border-2 border-slate-900 -ml-2 items-center justify-center first:ml-0">
                                    <Text className="text-xs text-white">S{i}</Text>
                                </View>
                            ))}
                            <View className="h-10 w-10 bg-zinc-800 rounded-full border-2 border-slate-900 -ml-2 items-center justify-center">
                                <Text className="text-xs text-gray-400">+2</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-red-600 rounded-xl p-4 items-center shadow-lg shadow-red-900"
                    onPress={() => navigation.navigate('CheckInSuccess')}
                >
                    <Text className="text-white font-bold text-lg">CHECK IN NOW</Text>
                </TouchableOpacity>
                <Text className="text-gray-500 text-center mt-4 text-sm">Cancel reservation</Text>

            </ScrollView>
        </SafeAreaView>
    );
}
