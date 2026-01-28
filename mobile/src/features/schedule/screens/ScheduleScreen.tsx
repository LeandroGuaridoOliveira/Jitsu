import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';
import { MockService } from '../../../services/mockService';
import { WeeklyScheduleItem, DayOfWeek } from '../../../types/domain';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClassCard } from '../components/ClassCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to map English DayOfWeek to date-fns or Portuguese display
const DAY_MAP: Record<string, DayOfWeek> = {
    'seg': 'MONDAY',
    'ter': 'TUESDAY',
    'qua': 'WEDNESDAY',
    'qui': 'THURSDAY',
    'sex': 'FRIDAY',
    'sáb': 'SATURDAY',
    'dom': 'SUNDAY'
};

const DAY_ORDER: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function ScheduleScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { teamMember } = useAuthStore();
    const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Day Selection State
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MONDAY');
    const [weekDates, setWeekDates] = useState<{ day: string, date: string, fullDate: Date, key: DayOfWeek, isToday: boolean }[]>([]);

    useEffect(() => {
        loadSchedule();
        generateWeekDays();
    }, []);

    const loadSchedule = async () => {
        try {
            // Assuming 't1' for now, replace with actual teamId from store/param
            const data = await MockService.getWeeklySchedule('t1');
            setSchedule(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateWeekDays = () => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
        const days = [];

        for (let i = 0; i < 7; i++) {
            const d = addDays(start, i);
            const dayName = format(d, 'EEE', { locale: ptBR }).replace('.', '').toLowerCase();
            // Map pt-BR short day to our DayOfWeek key
            let key: DayOfWeek = 'MONDAY'; // fallback
            if (dayName.includes('seg')) key = 'MONDAY';
            else if (dayName.includes('ter')) key = 'TUESDAY';
            else if (dayName.includes('qua')) key = 'WEDNESDAY';
            else if (dayName.includes('qui')) key = 'THURSDAY';
            else if (dayName.includes('sex')) key = 'FRIDAY';
            else if (dayName.includes('sáb')) key = 'SATURDAY';
            else if (dayName.includes('dom')) key = 'SUNDAY';

            days.push({
                day: format(d, 'EEE', { locale: ptBR }).toUpperCase().substring(0, 3),
                date: format(d, 'd'),
                fullDate: d,
                key: key,
                isToday: isSameDay(d, today)
            });
        }
        setWeekDates(days);

        // Auto-select current day
        const currentDayKey = days.find(d => isSameDay(d.fullDate, today))?.key || 'MONDAY';
        setSelectedDay(currentDayKey);
    };

    const filteredSchedule = useMemo(() => {
        return schedule
            .filter(item => item.dayOfWeek === selectedDay)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [schedule, selectedDay]);

    const canAddClass = teamMember?.role === 'INSTRUCTOR' || teamMember?.role === 'HEAD_COACH';

    const renderHeader = () => (
        <View className="px-5 pt-12 pb-4 bg-slate-900 flex-row justify-between items-center">
            <View>
                <Text className="text-white text-2xl font-bold">Agenda</Text>
                <Text className="text-slate-400 text-xs font-medium">TREINOS & HORÁRIOS</Text>
            </View>
            <View className="flex-row gap-3">
                {canAddClass && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddRecurringClass', { teamId: 't1' })}
                        className="w-10 h-10 bg-zinc-800 items-center justify-center rounded-full active:bg-zinc-700"
                    >
                        <Ionicons name="add" size={22} color="white" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigation.navigate('MonthlyHistory')}
                    className="w-10 h-10 bg-zinc-800 items-center justify-center rounded-full active:bg-zinc-700"
                >
                    <Ionicons name="calendar-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDayStrip = () => (
        <View className="py-2 bg-slate-900">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {weekDates.map((item) => {
                    const isSelected = selectedDay === item.key;
                    const isToday = item.isToday;

                    let containerStyle = '';
                    let dayTextStyle = '';
                    let dateTextStyle = '';

                    // Logic for 4 states
                    // 1. Today + Selected: Blue BG, White Text
                    if (isToday && isSelected) {
                        containerStyle = 'bg-blue-600 border-2 border-blue-600';
                        dayTextStyle = 'text-white/80';
                        dateTextStyle = 'text-white';
                    }
                    // 2. Today + Not Selected: Transparent/Dark BG, Blue Border, White Text
                    else if (isToday && !isSelected) {
                        containerStyle = 'bg-zinc-800 border-2 border-blue-600';
                        dayTextStyle = 'text-blue-400';
                        dateTextStyle = 'text-white';
                    }
                    // 3. Other Day + Selected: Blue BG, White Text
                    else if (!isToday && isSelected) {
                        containerStyle = 'bg-blue-600 border-2 border-blue-600';
                        dayTextStyle = 'text-white/80';
                        dateTextStyle = 'text-white';
                    }
                    // 4. Other Day + Not Selected: Dark BG, Zinc Text
                    else {
                        containerStyle = 'bg-zinc-800 border-2 border-zinc-800';
                        dayTextStyle = 'text-zinc-500';
                        dateTextStyle = 'text-zinc-400';
                    }

                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setSelectedDay(item.key)}
                            className={`mr-3 py-3 px-4 items-center rounded-2xl min-w-[68px] ${containerStyle}`}
                        >
                            <Text className={`text-xs font-bold mb-1 ${dayTextStyle}`}>
                                {item.day}
                            </Text>
                            <Text className={`text-xl font-bold ${dateTextStyle}`}>
                                {item.date}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {renderHeader()}

            {renderDayStrip()}

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <FlatList
                    data={filteredSchedule}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        const isLast = index === filteredSchedule.length - 1;
                        return (
                            <View className="flex-row px-5 mb-2">
                                {/* Left Column: Time */}
                                <View className="w-14 items-end mr-4 pt-1">
                                    <Text className="text-white font-bold text-base">{item.startTime}</Text>
                                    <Text className="text-slate-500 text-xs font-medium">{item.endTime}</Text>

                                    {/* Vertical Line Connector (Optional Visual Aid for Timeline flow) */}
                                    {!isLast && (
                                        <View className="absolute right-[-23px] top-8 bottom-[-8px] width-[1px] bg-zinc-800/50 -z-10" />
                                    )}
                                </View>

                                {/* Right Column: Card */}
                                <View className="flex-1 pb-4">
                                    <ClassCard
                                        item={item}
                                        onPress={() => navigation.navigate('ClassDetails', {
                                            classId: item.id,
                                            preview: {
                                                title: item.title,
                                                time: `${item.startTime} - ${item.endTime}`,
                                                instructor: item.instructorIds[0]
                                            }
                                        })}
                                    />
                                </View>
                            </View>
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 24 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10 px-10 opacity-50">
                            <Ionicons name="calendar-clear-outline" size={48} color="#71717a" />
                            <Text className="text-zinc-500 text-center mt-4">Sem aulas agendadas para este dia.</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}
