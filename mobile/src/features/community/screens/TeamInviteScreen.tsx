import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';

type ScreenRouteProp = RouteProp<RootStackParamList, 'TeamInvite'>;

export default function TeamInviteScreen() {
    const navigation = useNavigation();
    const route = useRoute<ScreenRouteProp>();

    // Mock Code Generation based on ID (In real app, fetch from backend)
    const MOCK_CODE = "8592-1049";

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full active:bg-white/5">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Invite Member</Text>
                <TouchableOpacity onPress={() => Alert.alert('Share', 'Opening Share Sheet...')} className="p-2 -mr-2 rounded-full active:bg-white/5">
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center px-8">

                {/* QR Card */}
                <View className="bg-white p-6 rounded-3xl items-center shadow-lg shadow-black/50 mb-10 w-full max-w-sm">
                    {/* Mock QR */}
                    <View className="w-64 h-64 bg-slate-900 rounded-xl items-center justify-center mb-6 overflow-hidden">
                        <MaterialCommunityIcons name="qrcode" size={200} color="white" />
                    </View>

                    <Text className="text-slate-900 font-bold text-xl mb-1">Join Team</Text>
                    <Text className="text-slate-500 text-center text-sm mb-6">Scan to join the academy instantly</Text>

                    {/* Code Display */}
                    <View className="w-full bg-slate-100 rounded-xl py-4 items-center border-2 border-dashed border-slate-300">
                        <Text className="text-3xl font-mono font-bold text-slate-800 tracking-widest">{MOCK_CODE}</Text>
                    </View>
                </View>

                {/* Info Text */}
                <Text className="text-slate-500 text-center mb-8 px-8">
                    Share this code with your students. They can enter it manually in the "Join Team" screen.
                </Text>

                {/* Actions */}
                <TouchableOpacity
                    className="w-full bg-zinc-800 py-4 rounded-xl items-center border border-white/10 active:bg-zinc-700"
                    onPress={() => Alert.alert('Copied', 'Code copied to clipboard!')}
                >
                    <Text className="text-white font-bold">Copy Code</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}
