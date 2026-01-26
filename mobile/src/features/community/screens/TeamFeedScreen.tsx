import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TeamFeedScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <View className="p-4 border-b border-zinc-800 flex-row justify-between items-center">
                <Text className="text-white text-xl font-bold">Team Feed</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Post Card */}
                <View className="bg-zinc-800 rounded-xl p-4 mb-6">
                    {/* Header */}
                    <View className="flex-row items-center mb-4">
                        <View className="h-10 w-10 bg-gray-500 rounded-full items-center justify-center mr-3">
                            {/* Placeholder Avatar */}
                            <Text className="text-white font-bold">IM</Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold">Instr. Marcus</Text>
                            <Text className="text-gray-400 text-xs">2 hours ago</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <Text className="text-gray-200 mb-4">
                        Great energy in the morning class! Everyone is sharpening their guard passing. Keep showing up! 🥋🔥
                    </Text>

                    {/* Image Placeholder */}
                    <View className="h-48 bg-zinc-700 rounded-lg mb-4 items-center justify-center">
                        <Ionicons name="image-outline" size={48} color="#52525b" />
                    </View>

                    {/* Footer / Actions */}
                    <View className="flex-row border-t border-zinc-700 pt-3">
                        <TouchableOpacity className="flex-row items-center mr-6">
                            <Ionicons name="hand-left-outline" size={20} color="white" />
                            <Text className="text-white ml-2 font-medium">Oss (12)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center">
                            <Ionicons name="chatbubble-outline" size={20} color="white" />
                            <Text className="text-white ml-2 font-medium">Comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Post Card 2 */}
                <View className="bg-zinc-800 rounded-xl p-4 mb-6">
                    <View className="flex-row items-center mb-4">
                        <View className="h-10 w-10 bg-blue-600 rounded-full items-center justify-center mr-3">
                            <Text className="text-white font-bold">LL</Text>
                        </View>
                        <View>
                            <Text className="text-white font-bold">Leandro Leg</Text>
                            <Text className="text-gray-400 text-xs">Yesterday</Text>
                        </View>
                    </View>

                    <Text className="text-gray-200 mb-4">
                        Finally hit that sweep I've been drilling for weeks! Thanks for the help @Instr. Marcus.
                    </Text>

                    <View className="flex-row border-t border-zinc-700 pt-3">
                        <TouchableOpacity className="flex-row items-center mr-6">
                            <Ionicons name="hand-left-outline" size={20} color="white" />
                            <Text className="text-white ml-2 font-medium">Oss (8)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center">
                            <Ionicons name="chatbubble-outline" size={20} color="white" />
                            <Text className="text-white ml-2 font-medium">Comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
