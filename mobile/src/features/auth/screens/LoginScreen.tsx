import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const navigation = useNavigation<any>();

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

                    <TouchableOpacity className="items-end mb-6">
                        <Text className="text-gray-400">Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white rounded-lg p-4 items-center">
                        <Text className="text-black font-bold text-lg">LOG IN</Text>
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
