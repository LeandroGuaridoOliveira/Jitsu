import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const DASHBOARD_DATA = {
    userStats: {
        checkins: 42,
        streak: 3,
        nextGraduation: '45%'
    },
    nextClass: {
        title: "Jiu-Jitsu Avançado",
        time: "19:30",
        instructor: "Mestre Renato",
        location: "Mat A"
    },
    feed: [
        {
            id: 1,
            title: "Seminário Confirmado!",
            content: "Grande mestre confirmou presença para o próximo mês.",
            time: "2h ago",
            image: "https://i.pravatar.cc/150?u=seminar"
        },
        {
            id: 2,
            title: "Treino de Ontem",
            content: "Casa cheia no treino das 19h! Parabéns a todos.",
            time: "5h ago",
            image: "https://i.pravatar.cc/150?u=training"
        }
    ]
};

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <ScrollView className="flex-1 px-6 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Text className="text-gray-400 text-sm font-bold uppercase">Bem-vindo de volta</Text>
                        <Text className="text-white text-2xl font-bold">Leandro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="h-10 w-10 bg-zinc-800 rounded-full items-center justify-center border border-zinc-700"
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={{ uri: "https://i.pravatar.cc/300?u=leandro" }}
                            className="w-full h-full rounded-full"
                        />
                    </TouchableOpacity>
                </View>

                {/* Check In Button */}
                <TouchableOpacity
                    className="bg-red-600 rounded-2xl p-6 flex-row items-center justify-center mb-10 shadow-lg shadow-red-900/50"
                    onPress={() => navigation.navigate('ClassDetail')}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={42} color="white" />
                    <View className="ml-4">
                        <Text className="text-white text-2xl font-bold tracking-wider uppercase">Check In</Text>
                        <Text className="text-red-100 text-xs tracking-widest uppercase">Pronto para treinar</Text>
                    </View>
                </TouchableOpacity>

                {/* User Stats */}
                <View className="flex-row justify-between mb-8">
                    <View className="bg-zinc-800 rounded-2xl p-4 w-[31%] items-center border border-zinc-700">
                        <Text className="text-3xl font-bold text-white mb-1">{DASHBOARD_DATA.userStats.checkins}</Text>
                        <Text className="text-gray-400 text-[10px] uppercase font-bold">Check-ins</Text>
                    </View>
                    <View className="bg-zinc-800 rounded-2xl p-4 w-[31%] items-center border border-zinc-700">
                        <Text className="text-3xl font-bold text-white mb-1">{DASHBOARD_DATA.userStats.streak}</Text>
                        <Text className="text-gray-400 text-[10px] uppercase font-bold">Streak</Text>
                    </View>
                    <View className="bg-zinc-800 rounded-2xl p-4 w-[31%] items-center border border-zinc-700">
                        <Text className="text-3xl font-bold text-white mb-1">{DASHBOARD_DATA.userStats.nextGraduation}</Text>
                        <Text className="text-gray-400 text-[10px] uppercase font-bold">Próx. Grau</Text>
                    </View>
                </View>

                {/* Next Class */}
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-white text-lg font-bold">Próxima Aula</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                        <Text className="text-red-500 text-sm font-bold">Ver Agenda</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    className="bg-[#2A2323] rounded-2xl p-4 mb-8 flex-row overflow-hidden border border-white/5"
                    onPress={() => navigation.navigate('ClassDetail')}
                >
                    <View className="flex-1 pr-4">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="time" size={14} color="#ef4444" />
                            <Text className="text-gray-400 text-xs font-bold ml-2 uppercase">Hoje, {DASHBOARD_DATA.nextClass.time}</Text>
                        </View>
                        <Text className="text-white text-xl font-bold mb-1">{DASHBOARD_DATA.nextClass.title}</Text>
                        <Text className="text-gray-400 text-sm mb-4">{DASHBOARD_DATA.nextClass.location} • {DASHBOARD_DATA.nextClass.instructor}</Text>

                        <View className="flex-row items-center">
                            <Text className="text-red-500 text-sm font-bold">Ver detalhes</Text>
                            <Ionicons name="arrow-forward" size={14} color="#ef4444" className="ml-1" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Feed */}
                <Text className="text-white text-lg font-bold mb-4">Feed da Academia</Text>
                {DASHBOARD_DATA.feed.map((post) => (
                    <TouchableOpacity key={post.id} className="bg-zinc-800 rounded-2xl p-4 mb-4 border border-zinc-700 flex-row">
                        <View className="h-12 w-12 bg-zinc-700 rounded-full mr-4 overflow-hidden">
                            <Image source={{ uri: post.image }} className="w-full h-full" />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row justify-between items-start">
                                <Text className="text-white font-bold text-base mb-1">{post.title}</Text>
                                <Text className="text-gray-500 text-[10px] uppercase font-bold">{post.time}</Text>
                            </View>
                            <Text className="text-gray-400 text-sm leading-5">{post.content}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
