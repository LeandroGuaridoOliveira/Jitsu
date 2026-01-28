import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { WeeklyScheduleItem } from '../../../types/domain';

interface ClassCardProps {
    item: WeeklyScheduleItem;
    onPress?: () => void;
}

export const ClassCard: React.FC<ClassCardProps & { item: WeeklyScheduleItem & { isCancelled?: boolean } }> = ({ item, onPress }) => {
    const isCancelled = item.isCancelled;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`mx-4 mb-3 rounded-xl p-4 flex-row border ${isCancelled ? 'bg-red-900/20 border-red-500/30' : 'bg-zinc-900 border-white/5'}`}
        >
            {/* Left: Time */}
            <View className={`pr-4 border-r items-center justify-center w-[72px] ${isCancelled ? 'border-red-500/20' : 'border-white/5'}`}>
                <Text className={`text-lg font-bold ${isCancelled ? 'text-red-400 line-through' : 'text-white'}`}>{item.startTime}</Text>
                <Text className={`text-xs font-medium mt-1 ${isCancelled ? 'text-red-500/50' : 'text-slate-500'}`}>
                    {item.endTime}
                </Text>
            </View>

            {/* Center: Info */}
            <View className="flex-1 px-4 justify-center">
                {isCancelled && (
                    <Text className="text-red-500 text-[10px] font-bold uppercase mb-1 tracking-wider">CANCELADA</Text>
                )}
                <Text className={`${isCancelled ? 'text-gray-400' : 'text-white'} text-base font-bold mb-2`} numberOfLines={1}>{item.title}</Text>

                <View className="flex-row flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                        <View key={`${tag}-${index}`} className={`px-2 py-1 rounded-[6px] border ${isCancelled ? 'bg-red-900/40 border-red-500/20' : 'bg-zinc-800 border-white/5'}`}>
                            <Text className={`text-[10px] font-bold uppercase ${isCancelled ? 'text-red-300' : 'text-zinc-400'}`}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Right: Instructor */}
            <View className="items-center justify-center pl-2">
                {/* Placeholder Avatar */}
                <View className={`w-10 h-10 rounded-full items-center justify-center border mb-1 overflow-hidden ${isCancelled ? 'bg-red-900/20 border-red-500/30' : 'bg-zinc-800 border-white/10'}`}>
                    <Image
                        source={{ uri: `https://ui-avatars.com/api/?name=${item.instructorIds[0] || 'User'}&background=random` }}
                        className={`w-full h-full ${isCancelled ? 'opacity-50' : ''}`}
                    />
                </View>
                <Text className="text-[10px] text-slate-500 font-medium">Instrutor</Text>
            </View>
        </TouchableOpacity>
    );
};
