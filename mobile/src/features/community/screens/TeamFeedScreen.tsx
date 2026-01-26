import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';

type TeamFeedRouteProp = RouteProp<RootStackParamList, 'TeamFeed'>;

// Mock Messages
const MOCK_MESSAGES = [
    {
        id: '1',
        text: 'Seminar on Saturday! Don\'t forget your gi.',
        time: '10:42 AM',
        sender: 'Prof. Marco',
        role: 'INSTRUCTOR',
        avatar: 'https://i.pravatar.cc/150?u=marco',
        isMe: false
    },
    {
        id: '2',
        text: 'Great training today! Oss.',
        time: '10:45 AM',
        sender: 'Javier',
        role: 'MEMBER',
        avatar: 'https://i.pravatar.cc/150?u=javier',
        isMe: false
    },
    {
        id: '3',
        text: 'Is the nogi class at 6pm?',
        time: '10:58 AM',
        sender: 'Sarah',
        role: 'MEMBER',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        isMe: false
    },
    {
        id: '4',
        text: 'I\'ll be there, looking forward to it.',
        time: '11:02 AM',
        sender: 'Me',
        role: 'MEMBER',
        avatar: 'https://i.pravatar.cc/150?u=me',
        isMe: true,
        read: true
    }
];

export default function TeamFeedScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<TeamFeedRouteProp>();
    const { teamId } = route.params || { teamId: 't1' }; // Fallback for safety
    const [message, setMessage] = useState('');

    const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
        if (item.isMe) {
            return (
                <View className="mb-4 flex-row justify-end items-end">
                    <View className="bg-red-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                        <Text className="text-white text-base leading-5 mb-1">{item.text}</Text>
                        <View className="flex-row justify-end items-center">
                            <Text className="text-red-200 text-xs mr-1">{item.time}</Text>
                            {item.read && <Ionicons name="checkmark-done" size={12} color="#fecaca" />}
                        </View>
                    </View>
                    <Image
                        source={{ uri: item.avatar }}
                        className="w-8 h-8 rounded-full ml-2"
                    />
                </View>
            );
        }

        return (
            <View className="mb-6 flex-row items-end">
                <View className="mr-2">
                    {item.role === 'INSTRUCTOR' && (
                        <View className="absolute -top-6 left-0 flex-row items-baseline w-max truncate">
                            <Text className="text-red-600 font-bold text-xs mr-2 truncate">Prof. {item.sender.split(' ')[1] || item.sender}</Text>
                            <View className="bg-red-900/50 px-1.5 py-0.5 rounded border border-red-800">
                                <Text className="text-[8px] text-red-400 font-bold tracking-wider uppercase">INSTRUCTOR</Text>
                            </View>
                        </View>
                    )}
                    {item.role === 'MEMBER' && (
                        <Text className="text-slate-400 text-xs absolute -top-5 left-1 mb-1">{item.sender}</Text>
                    )}

                    <View className={`w-10 h-10 rounded-full items-center justify-center overflow-hidden border-2 ${item.role === 'INSTRUCTOR' ? 'border-red-600' : 'border-transparent'}`}>
                        <Image source={{ uri: item.avatar }} className="w-full h-full" />
                    </View>
                </View>

                <View className={`rounded-2xl rounded-tl-none px-4 py-3 max-w-[75%] ${item.role === 'INSTRUCTOR' ? 'bg-[#2a1515] border border-red-900/30' : 'bg-[#2f2828]'}`}>
                    <Text className="text-white text-base leading-5 mb-1">{item.text}</Text>
                    <Text className="text-slate-400 text-xs text-right">{item.time}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900 z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-white text-lg font-bold">Team Alliance Chat</Text>
                    <Text className="text-red-500 text-xs font-medium">32 Members Online</Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('TeamInfo', { teamId })}
                    className="p-2 -mr-2 w-10 h-10 items-center justify-center bg-white/10 rounded-full"
                >
                    <Ionicons name="information" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Date Separator */}
            <View className="items-center my-4">
                <View className="bg-white/5 px-4 py-1 rounded-full">
                    <Text className="text-stone-400 text-xs font-medium">Today</Text>
                </View>
            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                className="flex-1"
            >
                <FlatList
                    data={MOCK_MESSAGES}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    className="flex-1"
                />

                {/* Input Area */}
                <View className="px-4 py-3 bg-slate-900 border-t border-white/5">
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity className="w-8 h-8 items-center justify-center bg-white/10 rounded-full">
                            <Ionicons name="add" size={20} color="#e2e8f0" />
                        </TouchableOpacity>

                        <View className="flex-1 bg-[#1a1515] flex-row items-center rounded-2xl px-4 py-2.5 border border-white/5">
                            <TextInput
                                placeholder="Message Team Alliance..."
                                placeholderTextColor="#71717a"
                                className="flex-1 text-white text-base mr-2"
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color="#a1a1aa" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="w-12 h-12 bg-red-600 rounded-xl items-center justify-center shadow-lg shadow-red-900/20">
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
