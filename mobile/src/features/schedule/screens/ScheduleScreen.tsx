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
                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setSelectedDay(item.key)}
                            className={`mr-3 py-3 px-4 items-center rounded-2xl min-w-[64px] ${isSelected ? 'bg-blue-600' : 'bg-slate-800/50'}`}
                        >
                            <Text className={`text-xs font-bold mb-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                {item.day}
                            </Text>
                            <Text className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                {item.date}
                            </Text>
                            {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-white mt-1.5" />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    const renderNextClassCard = () => (
        <View className="mx-5 mt-2 mb-6">
            <View className="bg-red-600 rounded-3xl p-6 shadow-xl shadow-red-900/20">
                <View className="flex-row justify-between items-start mb-5">
                    <View className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm self-start">
                        <Text className="text-white font-bold text-[10px] tracking-wider uppercase">Próxima Aula</Text>
                    </View>
                    <View className="flex-row items-center space-x-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                        <Ionicons name="time" size={12} color="white" />
                        <Text className="text-white font-bold text-xs">19:00</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-white text-3xl font-bold mb-1 tracking-tight leading-tight">Jiu-Jitsu Avançado</Text>
                    <Text className="text-red-100 text-base font-medium">Sensei Renato • Tatame A</Text>
                </View>

                <TouchableOpacity
                    className="bg-white w-full py-3.5 rounded-xl items-center shadow-sm active:scale-[0.98] transition-all"
                    activeOpacity={0.9}
                    onPress={() => Alert.alert('Check-in', 'Check-in realizado com sucesso!')}
                >
                    <Text className="text-red-600 font-extrabold text-sm tracking-widest uppercase">Check-in Agora</Text>
                </TouchableOpacity>
            </View>
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
                    ListHeaderComponent={renderNextClassCard}
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
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
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
