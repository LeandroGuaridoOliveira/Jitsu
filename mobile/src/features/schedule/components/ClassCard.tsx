import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyScheduleItem } from '../../../types/domain';

interface ClassCardProps {
    item: WeeklyScheduleItem;
    onPress?: () => void;
}

export const ClassCard: React.FC<ClassCardProps & { item: WeeklyScheduleItem & { isCancelled?: boolean } }> = ({ item, onPress }) => {
    const isCancelled = item.isCancelled;

    // Determine strip color based on keywords (simple logic for now)
    const isNoGi = item.title.toLowerCase().includes('no-gi') || item.title.toLowerCase().includes('submission');
    const stripColor = isNoGi ? 'bg-red-500' : 'bg-blue-500';
    const borderColor = isNoGi ? 'border-red-500' : 'border-blue-500';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-1 rounded-xl flex-row overflow-hidden border ${isCancelled ? 'bg-red-900/10 border-red-500/20' : 'bg-zinc-800 border-zinc-700/50'}`}
        >
            {/* Color Strip */}
            <View className={`w-1.5 ${isCancelled ? 'bg-red-900' : stripColor}`} />

            {/* Content */}
            <View className="flex-1 p-4">
                {/* Header: Title & Status */}
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                        {isCancelled && (
                            <Text className="text-red-500 text-[10px] font-bold uppercase mb-1 tracking-wider">CANCELADA</Text>
                        )}
                        <Text className={`text-base font-bold leading-tight ${isCancelled ? 'text-zinc-500 line-through' : 'text-white'}`} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>

                    {/* Status Badge (Mock logic: if afternoon class, show checked) */}
                    {parseInt(item.startTime.split(':')[0]) > 17 && !isCancelled && (
                        <View className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 flex-row items-center gap-1">
                            <Ionicons name="checkmark-circle" size={10} color="#4ade80" />
                            <Text className="text-green-400 text-[10px] font-bold">Confirmado</Text>
                        </View>
                    )}
                </View>

                {/* Footer: Instructor & Details */}
                <View className="flex-row justify-between items-end mt-2">
                    {/* Instructor Info */}
                    <View className="flex-row items-center">
                        <View className={`w-6 h-6 rounded-full overflow-hidden border ${isCancelled ? 'border-red-500/20 opacity-50' : 'border-zinc-600'}`}>
                            <Image
                                source={{ uri: `https://ui-avatars.com/api/?name=${item.instructorIds[0] || 'User'}&background=random` }}
                                className="w-full h-full"
                            />
                        </View>
                        <Text className={`text-xs ml-2 font-medium ${isCancelled ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {item.instructorIds[0] || 'Instrutor'}
                        </Text>
                    </View>

                    {/* Level Icon / Tags */}
                    <View className="flex-row gap-2">
                        {item.tags.slice(0, 1).map((tag, index) => (
                            <View key={index} className="flex-row items-center bg-zinc-700/50 px-2 py-1 rounded-md">
                                <Ionicons name="pricetag-outline" size={10} color="#a1a1aa" />
                                <Text className="text-[10px] text-zinc-400 ml-1 font-medium">{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
