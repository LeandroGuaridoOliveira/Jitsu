import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';

type ScreenRouteProp = RouteProp<RootStackParamList, 'TeamSettings'>;

export default function TeamSettingsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<ScreenRouteProp>();
    const { teamId } = route.params;

    const navToInvite = () => {
        navigation.navigate('TeamInvite', { teamId });
    };

    const navBack = () => navigation.goBack();

    const renderMenuItem = (icon: any, title: string, subtitle: string, onPress: () => void, danger = false) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center p-4 bg-zinc-900 border-b border-white/5 active:bg-zinc-800"
        >
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${danger ? 'bg-red-900/20' : 'bg-zinc-800'}`}>
                <Ionicons name={icon} size={20} color={danger ? '#ef4444' : '#e4e4e7'} />
            </View>
            <View className="flex-1">
                <Text className={`font-bold text-base ${danger ? 'text-red-500' : 'text-white'}`}>{title}</Text>
                {subtitle && <Text className="text-slate-500 text-xs">{subtitle}</Text>}
            </View>
            <SimpleLineIcons name="arrow-right" size={14} color="#52525b" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-white/5">
                <TouchableOpacity onPress={navBack} className="p-2 -ml-2 rounded-full active:bg-white/5">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">Team Settings</Text>
            </View>

            <ScrollView className="flex-1">
                <View className="mt-4">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider px-4 mb-2">Members</Text>
                    {renderMenuItem('person-add-outline', 'Invite Members', 'Show QR Code and Team ID', navToInvite)}
                    {renderMenuItem('people-outline', 'Manage Roster', 'View all athletes', () => Alert.alert('Coming Soon', 'Roster Management'))}
                </View>

                <View className="mt-8">
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider px-4 mb-2">General</Text>
                    {renderMenuItem('create-outline', 'Edit Team Info', 'Name, Location, Logo', () => Alert.alert('Coming Soon'))}
                </View>

                <View className="mt-8">
                    {renderMenuItem('log-out-outline', 'Leave Team', 'You will need to join again', () => Alert.alert('Leave Team', 'Are you sure?'), true)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
