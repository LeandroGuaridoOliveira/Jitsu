import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { WeeklyScheduleItem } from '../../../types/domain';

interface ClassCardProps {
    item: WeeklyScheduleItem;
    onPress?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="bg-zinc-900 mx-4 mb-3 rounded-xl p-4 flex-row border border-white/5"
        >
            {/* Left: Time */}
            <View className="pr-4 border-r border-white/5 items-center justify-center w-[72px]">
                <Text className="text-white text-lg font-bold">{item.startTime}</Text>
                <Text className="text-slate-500 text-xs font-medium mt-1">
                    {item.endTime}
                </Text>
            </View>

            {/* Center: Info */}
            <View className="flex-1 px-4 justify-center">
                <Text className="text-white text-base font-bold mb-2" numberOfLines={1}>{item.title}</Text>

                <View className="flex-row flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                        <View key={`${tag}-${index}`} className="bg-zinc-800 px-2 py-1 rounded-[6px] border border-white/5">
                            <Text className="text-[10px] text-zinc-400 font-bold uppercase">{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Right: Instructor */}
            <View className="items-center justify-center pl-2">
                {/* Placeholder Avatar */}
                <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center border border-white/10 mb-1 overflow-hidden">
                    <Image
                        source={{ uri: `https://ui-avatars.com/api/?name=${item.instructorIds[0] || 'User'}&background=random` }}
                        className="w-full h-full"
                    />
                </View>
                <Text className="text-[10px] text-slate-500 font-medium">Instrutor</Text>
            </View>
        </TouchableOpacity>
    );
};
