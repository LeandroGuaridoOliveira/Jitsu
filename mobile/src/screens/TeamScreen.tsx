import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function TeamScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
            <StatusBar style="light" />
            <Text className="text-white text-lg font-bold">Mural do Time (Em breve)</Text>
        </SafeAreaView>
    );
}
