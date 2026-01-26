import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CheckInSuccessScreen() {
    const navigation = useNavigation<any>();

    // Auto-close effect (optional, or rely on user button)
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigation.goBack();
    //     }, 3000);
    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center p-6">
            <StatusBar style="light" />

            <View className="items-center">
                <View className="h-32 w-32 bg-green-500 rounded-full items-center justify-center mb-8 shadow-lg shadow-green-900">
                    <Ionicons name="checkmark" size={64} color="white" />
                </View>

                <Text className="text-white text-3xl font-bold mb-2 text-center">Training Confirmed!</Text>
                <Text className="text-gray-400 text-lg mb-12 text-center">Have a good roll!</Text>

                <TouchableOpacity
                    className="bg-white px-8 py-4 rounded-full w-full max-w-xs"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-black font-bold text-center text-lg">BACK TO HOME</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
