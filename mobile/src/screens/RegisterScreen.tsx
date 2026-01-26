import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleRegister = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        // TODO: Implement registration logic
        console.log('Registering:', { name, email, password });
        Alert.alert('Success', 'Account created successfully (Mock)', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-slate-50 p-6 pt-12">
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mb-8"
            >
                <Text className="text-indigo-600 font-semibold text-lg">← Back</Text>
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold mb-2 text-slate-800">Create Account</Text>
            <Text className="text-base text-slate-500 mb-8">Join the digital tatame ecosystem.</Text>

            <View className="mb-4">
                <Text className="text-slate-700 font-medium mb-1 ml-1">Full Name</Text>
                <TextInput
                    className="w-full bg-white p-4 rounded-xl border border-slate-200"
                    placeholder="John Doe"
                    placeholderTextColor="#94a3b8"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
            </View>

            <View className="mb-4">
                <Text className="text-slate-700 font-medium mb-1 ml-1">Email</Text>
                <TextInput
                    className="w-full bg-white p-4 rounded-xl border border-slate-200"
                    placeholder="john@example.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View className="mb-4">
                <Text className="text-slate-700 font-medium mb-1 ml-1">Password</Text>
                <TextInput
                    className="w-full bg-white p-4 rounded-xl border border-slate-200"
                    placeholder="Minimum 8 characters"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View className="mb-8">
                <Text className="text-slate-700 font-medium mb-1 ml-1">Confirm Password</Text>
                <TextInput
                    className="w-full bg-white p-4 rounded-xl border border-slate-200"
                    placeholder="Repeat your password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                className="w-full bg-indigo-600 p-4 rounded-xl items-center shadow-lg shadow-indigo-200"
                onPress={handleRegister}
            >
                <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
