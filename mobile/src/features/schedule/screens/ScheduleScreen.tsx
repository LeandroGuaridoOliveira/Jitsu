import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
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
    const [weekDates, setWeekDates] = useState<{ day: string, date: string, fullDate: Date, key: DayOfWeek }[]>([]);

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
                key: key
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
        <View className="px-4 py-4 border-b border-white/5 flex-row justify-between items-center bg-slate-900">
            <View>
                <Text className="text-white text-2xl font-bold">Agenda</Text>
                <Text className="text-slate-400 text-xs font-medium">TREINOS DA SEMANA</Text>
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
        <View className="py-4 bg-slate-900 border-b border-white/5">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {weekDates.map((item) => {
                    const isSelected = selectedDay === item.key;
                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setSelectedDay(item.key)}
                            className={`mr-3 py-2 px-3 items-center rounded-xl min-w-[56px] ${isSelected ? 'bg-blue-600' : 'bg-transparent'}`}
                        >
                            <Text className={`text-xs font-bold mb-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                {item.day}
                            </Text>
                            <Text className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                {item.date}
                            </Text>
                            {isSelected && <View className="w-1 h-1 rounded-full bg-white mt-1" />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );



    return (
        <View className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            <View className="safe-area-top bg-slate-900" style={{ height: 40 }} />
            {/* Adjust safe area spacer if not using SafeAreaView directly or if header needs it. 
                Using View flex-1 + padding top is safer with custom headers usually, 
                but let's stick to simple Structure. 
            */}

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
                    renderItem={({ item }) => (
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
                    )}
                    contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20 px-10">
                            <Ionicons name="calendar-clear-outline" size={48} color="#3f3f46" />
                            <Text className="text-zinc-500 text-center mt-4">Nenhuma aula agendada para este dia.</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}
