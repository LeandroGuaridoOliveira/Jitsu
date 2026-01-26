import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { MockService, FeedPost, ChatMessage, Team } from '../../../services/mockService';

type TeamContextRouteProp = RouteProp<RootStackParamList, 'TeamContext'>;

export default function TeamContextScreen() {
    const navigation = useNavigation();
    const route = useRoute<TeamContextRouteProp>();
    const { teamId } = route.params;

    const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
    const [team, setTeam] = useState<Team | null>(null);
    const [feed, setFeed] = useState<FeedPost[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        loadData();
    }, [teamId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Parallel fetch
            const [teamsData, feedData, chatData] = await Promise.all([
                MockService.getUserTeams(), // ideally getTeamById but we simulate
                MockService.getTeamFeed(teamId),
                MockService.getTeamChat(teamId)
            ]);

            const currentTeam = teamsData.find(t => t.id === teamId) || teamsData[0]; // fallback
            setTeam(currentTeam);
            setFeed(feedData);
            setMessages(chatData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Sub-Components ---

    const renderHeader = () => (
        <View className="bg-slate-900 pt-2 pb-4 px-4 border-b border-white/5">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full active:bg-white/5">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 -mr-2 rounded-full active:bg-white/5">
                    <Ionicons name="settings-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
                <View className="w-16 h-16 bg-zinc-800 rounded-full items-center justify-center mr-4 border-2 border-white/10">
                    <Text className="text-slate-400 text-2xl font-bold">{team?.name.charAt(0)}</Text>
                </View>
                <View>
                    <Text className="text-white text-xl font-bold">{team?.name || 'Loading...'}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="bg-red-900/40 px-2 py-0.5 rounded border border-red-900/50 mr-2">
                            <Text className="text-red-400 text-[10px] font-bold uppercase tracking-wide">
                                {team?.role || 'MEMBER'}
                            </Text>
                        </View>
                        <Text className="text-slate-400 text-xs">Unit: Sao Paulo</Text>
                    </View>
                </View>
            </View>

            {/* Tab Switcher */}
            <View className="flex-row mt-6 border-b border-white/5">
                <TouchableOpacity
                    onPress={() => setActiveTab('feed')}
                    className={`flex-1 items-center pb-3 border-b-2 ${activeTab === 'feed' ? 'border-red-600' : 'border-transparent'}`}
                >
                    <Text className={`font-bold uppercase text-xs tracking-wider ${activeTab === 'feed' ? 'text-white' : 'text-slate-500'}`}>
                        Mural
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('chat')}
                    className={`flex-1 items-center pb-3 border-b-2 ${activeTab === 'chat' ? 'border-red-600' : 'border-transparent'}`}
                >
                    <Text className={`font-bold uppercase text-xs tracking-wider ${activeTab === 'chat' ? 'text-white' : 'text-slate-500'}`}>
                        Resenha
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFeedItem = ({ item }: { item: FeedPost }) => (
        <View className="bg-zinc-900 mb-4 p-4 rounded-xl border border-white/5">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-zinc-700 rounded-full mr-2 items-center justify-center">
                        <Text className="text-xs text-white font-bold">{item.author.name.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text className="text-white text-sm font-bold">{item.author.name}</Text>
                        <Text className="text-slate-500 text-[10px] uppercase">{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
                {item.type === 'announcement' && (
                    <MaterialCommunityIcons name="pin-outline" size={16} color="#dc2626" />
                )}
            </View>
            <Text className="text-slate-300 leading-5 mb-3">{item.content}</Text>
            <View className="flex-row space-x-4 border-t border-white/5 pt-3">
                <View className="flex-row items-center">
                    <Ionicons name="heart-outline" size={16} color="#71717a" />
                    <Text className="text-slate-500 text-xs ml-1">{item.likes}</Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="chatbubble-outline" size={16} color="#71717a" />
                    <Text className="text-slate-500 text-xs ml-1">{item.commentsCount}</Text>
                </View>
            </View>
        </View>
    );

    const renderPlayMessage = ({ item }: { item: ChatMessage }) => {
        // Simple "Me" Check - in real app check against current user ID
        const isMe = item.sender.name === 'Leandro';

        return (
            <View className={`mb-4 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                    <View className="w-8 h-8 bg-zinc-800 rounded-full mr-2 items-center justify-center border border-white/10">
                        <Text className="text-slate-400 text-xs font-bold">{item.sender.name.charAt(0)}</Text>
                    </View>
                )}

                <View className={`rounded-2xl px-4 py-2 max-w-[75%] ${isMe
                        ? 'bg-red-900/50 rounded-tr-none border border-red-900/30'
                        : 'bg-zinc-800 rounded-tl-none border border-white/5'
                    }`}>
                    {!isMe && <Text className="text-red-400 text-[10px] font-bold mb-1">{item.sender.name}</Text>}
                    <Text className="text-white text-sm leading-5">{item.content}</Text>
                    <Text className="text-slate-500 text-[10px] text-right mt-1 opacity-60">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
            <StatusBar style="light" />

            {renderHeader()}

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#dc2626" />
                </View>
            ) : (
                <View className="flex-1 bg-slate-900">
                    {activeTab === 'feed' ? (
                        <FlatList
                            data={feed}
                            renderItem={renderFeedItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ padding: 16 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <Text className="text-slate-500 text-center mt-10">No announcements yet.</Text>
                            }
                        />
                    ) : (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                            style={{ flex: 1 }}
                        >
                            <FlatList
                                data={messages}
                                renderItem={renderPlayMessage}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                                inverted={false} // Should be true in real chat with auto scroll
                            />
                            {/* Input Bar */}
                            <View className="px-4 py-3 bg-slate-900 border-t border-white/5 pb-8">
                                <View className="flex-row items-center gap-3">
                                    <View className="flex-1 bg-zinc-900 flex-row items-center rounded-xl px-4 py-3 border border-zinc-700">
                                        <TextInput
                                            placeholder="Message..."
                                            placeholderTextColor="#71717a"
                                            className="flex-1 text-white text-base mr-2"
                                            value={chatInput}
                                            onChangeText={setChatInput}
                                        />
                                    </View>
                                    <TouchableOpacity className="w-12 h-12 bg-red-600 rounded-xl items-center justify-center shadow-lg shadow-red-900/20 active:opacity-90">
                                        <Ionicons name="send" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}
