import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Interfaces ---

interface TeamSearchResult {
    id: string;
    name: string;
    headCoach: string;
    logoUrl?: string; // Optional URL if we had one
    acronym: string;  // For fallback
}

// Quick type for navigation - assuming we just need to go back for now
// In a real app, import RootStackParamList from '../types/navigation'
type NavigationProp = NativeStackNavigationProp<any>;

// --- Mock Data ---

const MOCK_TEAM_RESULT: TeamSearchResult = {
    id: '1',
    name: 'Alliance HQ',
    headCoach: 'Fabio Gurgel',
    logoUrl: undefined, // Simulating no image to show placeholder style logic if needed, 
    // but mockup has a specific logo. We'll simulate the logo container.
    acronym: 'AHQ'
};

export default function JoinTeamScreen() {
    const navigation = useNavigation<NavigationProp>();

    // --- Local State ---
    const [teamCode, setTeamCode] = useState('');
    const [searchResult, setSearchResult] = useState<TeamSearchResult | null>(MOCK_TEAM_RESULT); // Pre-filled for demo/mockup matching

    // --- Handlers ---

    const handleFindTeam = () => {
        // Here you would implement the API call to find the team by code.
        // For this mockup, we just alert if empty, otherwise show the mock result (already shown).
        if (!teamCode.trim()) {
            Alert.alert('Error', 'Please enter a team code.');
            return;
        }
        // Logic to fetch team...
        Alert.alert('Searching', `Looking for team with code: ${teamCode}`);
    };

    const handleRequestAccess = () => {
        Alert.alert('Request Sent', 'Your request to join Alliance HQ has been sent.');
    };

    const handleScanQr = () => {
        Alert.alert('QR Scanner', 'Open QR Code Scanner...');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center -ml-2"
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold">Join Team</Text>

                {/* Empty View to balance header center title if needed, or just standard flex */}
                <View className="w-8" />
            </View>

            <View className="px-5 mt-6">

                {/* Input Section */}
                <View className="bg-zinc-800 flex-row items-center rounded-2xl border border-zinc-700 px-4 h-14 mb-6">
                    <TextInput
                        className="flex-1 text-white text-base ml-2"
                        placeholder="Enter Team Code"
                        placeholderTextColor="#71717a" // zinc-500
                        value={teamCode}
                        onChangeText={setTeamCode}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity onPress={handleScanQr}>
                        <MaterialCommunityIcons name="qrcode-scan" size={22} color="#71717a" />
                    </TouchableOpacity>
                </View>

                {/* Find Button */}
                <TouchableOpacity
                    className="bg-red-600 h-14 rounded-2xl items-center justify-center mb-10 active:opacity-90"
                    onPress={handleFindTeam}
                >
                    <Text className="text-white font-bold text-lg">Find Team</Text>
                </TouchableOpacity>

                {/* Search Result Section */}
                {searchResult && (
                    <View>
                        <Text className="text-zinc-500 text-xs font-bold mb-3 tracking-wide uppercase">
                            Search Result
                        </Text>

                        <View className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5">
                            {/* Team Header Info */}
                            <View className="flex-row items-center mb-6">
                                {/* Logo Circle */}
                                <View className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-white items-center justify-center mr-4">
                                    {/* Using an icon to simulate the Eagle logo in the mockup */}
                                    <MaterialCommunityIcons name="bird" size={24} color="white" />
                                </View>

                                <View>
                                    <Text className="text-white text-lg font-bold mb-0.5">
                                        {searchResult.name}
                                    </Text>
                                    <Text className="text-slate-400 text-sm">
                                        Head Coach: {searchResult.headCoach}
                                    </Text>
                                </View>
                            </View>

                            {/* Divider Line */}
                            <View className="h-[1px] bg-zinc-700 mb-5" />

                            {/* Request Access Button */}
                            <TouchableOpacity
                                className="flex-row items-center justify-center border border-zinc-600 rounded-full py-3 px-4 self-end active:bg-zinc-700"
                                onPress={handleRequestAccess}
                            >
                                <Text className="text-white font-semibold mr-2">Request Access</Text>
                                <Ionicons name="arrow-forward" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}
