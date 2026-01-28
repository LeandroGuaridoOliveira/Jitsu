import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MockService } from '../services/mockService';

export default function CreateTeamScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!name || !acronym) {
            Alert.alert('Missing Fields', 'Please fill in Name and Short Code.');
            return;
        }

        setLoading(true);
        try {
            await MockService.createTeam({ name, logoUrl: undefined }); // In real app pass more data
            Alert.alert('Success', 'Academy created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create team. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-white/5">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full active:bg-white/5 -ml-2"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">New Team</Text>
            </View>

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Name */}
                <View className="mb-6">
                    <Text className="text-xs font-bold uppercase text-slate-500 mb-2">Academy Name</Text>
                    <TextInput
                        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-4 font-semibold text-base focus:border-blue-600"
                        placeholder="e.g. Unity Jiu-Jitsu"
                        placeholderTextColor="#52525b"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Acronym & Location Row */}
                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1">
                        <Text className="text-xs font-bold uppercase text-slate-500 mb-2">Short Code</Text>
                        <TextInput
                            className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-4 font-semibold text-base focus:border-blue-600"
                            placeholder="e.g. UJJ"
                            placeholderTextColor="#52525b"
                            value={acronym}
                            onChangeText={setAcronym}
                            autoCapitalize="characters"
                            maxLength={5}
                        />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-xs font-bold uppercase text-slate-500 mb-2">Location</Text>
                        <TextInput
                            className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-4 font-semibold text-base focus:border-blue-600"
                            placeholder="City, State"
                            placeholderTextColor="#52525b"
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                </View>

                {/* Description */}
                <View className="mb-8">
                    <Text className="text-xs font-bold uppercase text-slate-500 mb-2">Description / Motto</Text>
                    <TextInput
                        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-4 font-normal text-base focus:border-blue-600 min-h-[100px]"
                        placeholder="e.g. A place for everyone."
                        placeholderTextColor="#52525b"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`bg-blue-600 rounded-xl py-4 items-center justify-center shadow-lg shadow-blue-900/20 active:opacity-90 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Create Team</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
