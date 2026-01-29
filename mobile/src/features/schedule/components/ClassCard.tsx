import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { WeeklyScheduleItem } from '../../../types/domain';

interface ClassCardProps {
    item: WeeklyScheduleItem;
    onPress?: () => void;
    status?: 'CONFIRMED' | 'PENDING' | 'ABSENT' | null;
}

export const ClassCard: React.FC<ClassCardProps & { item: WeeklyScheduleItem & { isCancelled?: boolean } }> = ({ item, onPress }) => {
    const isCancelled = item.isCancelled;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`mx-4 mb-3 rounded-2xl p-4 flex-row items-center ${isCancelled ? 'bg-red-900/10 border border-red-500/20' : 'bg-zinc-900'}`}
            style={{ minHeight: 80 }}
        >
            {/* Left: Time */}
            <View className="w-[70px] items-center justify-center mr-3">
                <Text className={`text-xl font-bold ${isCancelled ? 'text-zinc-500 line-through' : 'text-white'}`}>
                    {item.startTime}
                </Text>
                <Text className={`text-xs font-medium ${isCancelled ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {item.endTime}
                </Text>
            </View>

            {/* Center: Info */}
            <View className="flex-1 justify-center mr-2">
                <Text
                    className={`text-base font-bold mb-2 ${isCancelled ? 'text-zinc-500' : 'text-white'}`}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>

                <View className="flex-row flex-wrap gap-2">
                    {isCancelled && (
                        <View className="bg-red-900/30 px-2 py-1 rounded-md">
                            <Text className="text-red-400 text-[10px] font-bold uppercase">CANCELADA</Text>
                        </View>
                    )}
                    {!isCancelled && item.tags.slice(0, 2).map((tag, index) => (
                        <View key={index} className="bg-zinc-800 px-3 py-1 rounded-md">
                            <Text className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Right: Instructor */}
            <View className="items-center justify-center pl-2">
                <View className={`w-10 h-10 rounded-full bg-zinc-800 border ${isCancelled ? 'border-red-500/20 opacity-50' : 'border-white/5'} items-center justify-center overflow-hidden mb-1`}>
                    <Image
                        source={{ uri: `https://ui-avatars.com/api/?name=${item.instructorIds[0]?.replace(' ', '+') || 'Instrutor'}&background=18181b&color=a1a1aa` }}
                        className="w-full h-full"
                    />
                </View>
                <Text className="text-[10px] text-zinc-500 font-medium">Instrutor</Text>
            </View>
        </TouchableOpacity>
    );
};
