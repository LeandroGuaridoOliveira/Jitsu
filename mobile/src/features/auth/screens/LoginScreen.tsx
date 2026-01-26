import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../../../store/authStore';
import { User, TeamMember } from '../../../types/domain';

// Mock Data for Testing
const TEST_USER: User = {
    id: 'test-user',
    name: 'Test User',
    email: 'test@jitsu.com',
    createdAt: new Date().toISOString(),
};

const TEST_MEMBER_BASE: TeamMember = {
    userId: 'test-user',
    teamId: 't1',
    role: 'STUDENT',
    status: 'ACTIVE',
    currentBelt: { color: 'WHITE', degrees: 0, awardedAt: new Date().toISOString(), awardedBy: 'system' },
    joinedAt: new Date().toISOString()
};

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        // Basic validation could go here
        await login(email, password);
        // Navigation is handled by AppNavigator listening to isAuthenticated
    };

    const handleTestLogin = (role: 'STUDENT' | 'HEAD_COACH') => {
        const member = { ...TEST_MEMBER_BASE, role };

        if (role === 'HEAD_COACH') {
            member.currentBelt = { color: 'BLACK', degrees: 2, awardedAt: '2015-01-01T00:00:00Z', awardedBy: 'system' };
        }

        // Direct state manipulation for testing purposes
        useAuthStore.setState({
            user: TEST_USER,
            teamMember: member,
            isAuthenticated: true,
            isLoading: false
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-6"
            >
                <View className="items-center mb-12">
                    {/* Logo Placeholder */}
                    <Text className="text-4xl font-bold text-white tracking-widest">JITSU</Text>
                    <View className="h-1 w-12 bg-red-600 mt-2" />
                    <Text className="text-gray-400 mt-4 text-center">Master your game.</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <TextInput
                            placeholder="Email Address"
                            placeholderTextColor="#9CA3AF"
                            className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            selectionColor="#FFFFFF"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#9CA3AF"
                            className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                            secureTextEntry
                            selectionColor="#FFFFFF"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity className="items-end mb-6">
                        <Text className="text-gray-400">Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`bg-white rounded-lg p-4 items-center ${isLoading ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator color="#000" className="mr-2" />
                                <Text className="text-black font-bold text-lg">LOGGING IN...</Text>
                            </View>
                        ) : (
                            <Text className="text-black font-bold text-lg">LOG IN</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-8 items-center space-y-3">
                    <Text className="text-gray-500 mb-2">Test Access (Dev Only)</Text>
                    <TouchableOpacity
                        className="bg-indigo-600 w-full p-4 rounded-lg items-center"
                        onPress={() => handleTestLogin('STUDENT')}
                    >
                        <Text className="text-white font-bold">Login as Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-600 w-full p-4 rounded-lg items-center"
                        onPress={() => handleTestLogin('HEAD_COACH')}
                    >
                        <Text className="text-white font-bold">Login as Professor</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-8 items-center">
                    <Text className="text-gray-500 mb-6">Or continue with</Text>
                    <View className="flex-row space-x-4 w-full justify-center">
                        <TouchableOpacity className="bg-zinc-800 flex-1 p-4 rounded-lg items-center border border-zinc-700">
                            <Text className="text-white font-semibold">Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-zinc-800 flex-1 p-4 rounded-lg items-center border border-zinc-700">
                            <Text className="text-white font-semibold">Apple</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-400">Not a member yet? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="text-red-500 font-bold">Start your free trial</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
