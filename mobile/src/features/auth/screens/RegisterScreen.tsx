import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                    <View className="items-center mb-10">
                        {/* Logo Placeholder */}
                        <Text className="text-4xl font-bold text-white tracking-widest">JITSU</Text>
                        <View className="h-1 w-12 bg-red-600 mt-2" />
                        <Text className="text-gray-400 mt-4 text-center">Join the journey.</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#9CA3AF"
                                className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                                autoCapitalize="words"
                                selectionColor="#FFFFFF"
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="#9CA3AF"
                                className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                selectionColor="#FFFFFF"
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                                secureTextEntry
                                selectionColor="#FFFFFF"
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#9CA3AF"
                                className="bg-zinc-800 text-white rounded-lg p-4 mb-4"
                                secureTextEntry
                                selectionColor="#FFFFFF"
                            />
                        </View>

                        <TouchableOpacity className="bg-white rounded-lg p-4 items-center mt-2">
                            <Text className="text-black font-bold text-lg">CREATE ACCOUNT</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-8 items-center">
                        <Text className="text-gray-500 mb-6">Or size up with</Text>
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
                        <Text className="text-gray-400">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-red-500 font-bold">Log in here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
