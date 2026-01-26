import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuthStore, MOCK_USER, MOCK_MEMBER } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


export default function LoginScreen({ navigation }: Props) {
    const { login } = useAuthStore();

    const handleLogin = () => {
        // Mock login logic
        console.log('Login Pressed');
        login(MOCK_USER, MOCK_MEMBER);
        navigation.replace('Home');
    };

    return (
        <View className="flex-1 bg-slate-50 justify-center items-center p-6">
            <Text className="text-3xl font-extrabold mb-2 text-slate-800">JITSU</Text>
            <Text className="text-base text-slate-500 mb-10">O ecossistema digital do tatame</Text>

            <TextInput
                className="w-full bg-white p-4 rounded-xl mb-4 border border-slate-200"
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                className="w-full bg-white p-4 rounded-xl mb-6 border border-slate-200"
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
            />

            <TouchableOpacity
                className="w-full bg-indigo-600 p-4 rounded-xl items-center shadow-sm"
                onPress={handleLogin}
            >
                <Text className="text-white font-bold text-lg">Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="mt-6"
                onPress={() => navigation.navigate('Register')}
            >
                <Text className="text-indigo-600 font-semibold">Criar nova conta</Text>
            </TouchableOpacity>
        </View>
    );
}
