import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format, addMonths, startOfMonth, endOfMonth, getDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MockService } from '../../../services/mockService';
import { WeeklyScheduleItem } from '../../../types/domain';
import { ClassCard } from '../components/ClassCard';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthlyHistoryScreen() {
    const navigation = useNavigation<any>();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [history, setHistory] = useState<Record<string, WeeklyScheduleItem[]>>({});
    const [loading, setLoading] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    // Picker State
    const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
    const [tempYear, setTempYear] = useState(currentDate.getFullYear());

    useEffect(() => {
        loadHistory();
    }, [currentDate]);

    useEffect(() => {
        if (showMonthPicker) {
            setTempMonth(currentDate.getMonth());
            setTempYear(currentDate.getFullYear());
        }
    }, [showMonthPicker]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const data = await MockService.getMonthlyHistory(year, month);
            setHistory(data);
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const calendarGrid = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const startDayOfWeek = getDay(start);
        const daysInMonth = end.getDate();

        const grid = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            grid.push({ key: `empty-${i}`, day: null });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push({ key: `day-${i}`, day: i });
        }
        return grid;
    }, [currentDate]);

    const selectedDayHistory = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return history[dateKey] || [];
    }, [selectedDate, history]);

    const YEARS = useMemo(() => {
        const current = new Date().getFullYear();
        const years = [];
        for (let i = current - 5; i <= current + 5; i++) {
            years.push(i);
        }
        return years;
    }, []);

    const confirmPicker = () => {
        const newDate = new Date(tempYear, tempMonth, 1);
        setCurrentDate(newDate);
        setSelectedDate(newDate); // Reset selected day to 1st of new month
        setShowMonthPicker(false);
    };

    const renderHeader = () => (
        <View className="flex-row items-center justify-between px-4 py-4 bg-slate-900 border-b border-white/5 relative z-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowMonthPicker(true)}
                className="flex-row items-center bg-zinc-800 px-4 py-2 rounded-full border border-white/10"
            >
                <Text className="text-white text-base font-bold mr-2 uppercase">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#94a3b8" />
            </TouchableOpacity>

            <View className="w-10" />
        </View>
    );

    const renderPickerColumn = (data: any[], selectedValue: any, onSelect: (val: any) => void, labelExtractor: (item: any) => string) => (
        <View className="flex-1 h-full">
            <FlatList
                data={data}
                keyExtractor={(item) => String(item)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 150 }}
                renderItem={({ item }) => {
                    const isSelected = item === selectedValue;
                    return (
                        <TouchableOpacity
                            onPress={() => onSelect(item)}
                            className={`h-12 items-center justify-center ${isSelected ? 'bg-blue-600/20 rounded-lg mx-2' : ''}`}
                        >
                            <Text className={`text-xl ${isSelected ? 'text-blue-400 font-bold scale-110' : 'text-slate-500 font-medium'}`}>
                                {labelExtractor(item)}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
            {/* Center Highlight Line */}
            <View className="absolute top-[150px] left-0 right-0 h-12 border-t border-b border-white/5 pointer-events-none" />
        </View>
    );

    const renderMonthPickerModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showMonthPicker}
            onRequestClose={() => setShowMonthPicker(false)}
        >
            <View className="flex-1 bg-black/80 justify-end">
                <View className="bg-zinc-900 rounded-t-3xl border-t border-white/10 h-[75%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-white/5 bg-zinc-800/50 rounded-t-3xl">
                        <TouchableOpacity onPress={() => setShowMonthPicker(false)} className="p-2">
                            <Text className="text-slate-400 font-medium text-base">Cancelar</Text>
                        </TouchableOpacity>
                        <Text className="text-white font-bold text-xl">Selecionar Data</Text>
                        <TouchableOpacity onPress={confirmPicker} className="p-2">
                            <Text className="text-blue-500 font-bold text-base">Confirmar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Columns */}
                    <View className="flex-row justify-center mt-4 px-4 flex-1 pb-8">
                        {/* Months */}
                        {renderPickerColumn(
                            Array.from({ length: 12 }, (_, i) => i),
                            tempMonth,
                            setTempMonth,
                            (index) => MONTHS[index]
                        )}

                        {/* Divider */}
                        <View className="w-[1px] bg-white/5 h-[80%] self-center mx-4" />

                        {/* Years */}
                        {renderPickerColumn(
                            YEARS,
                            tempYear,
                            setTempYear,
                            (year) => String(year)
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderCalendar = () => {
        const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

        return (
            <View className="px-4 py-4 bg-slate-900">
                <View className="flex-row justify-between mb-2">
                    {weekDays.map((day, index) => (
                        <View key={index} className="w-[13%] items-center">
                            <Text className="text-slate-500 text-xs font-bold">{day}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row flex-wrap justify-start">
                    {calendarGrid.map((item, index) => {
                        if (item.day === null) {
                            return <View key={item.key} className="w-[14.2%] p-2 aspect-square" />;
                        }

                        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day);
                        const isSelected = isSameDay(dayDate, selectedDate);
                        const dateKey = format(dayDate, 'yyyy-MM-dd');
                        const hasTraining = history[dateKey] && history[dateKey].length > 0;

                        return (
                            <TouchableOpacity
                                key={item.key}
                                onPress={() => handleDayPress(item.day!)}
                                className={`w-[14.2%] aspect-square items-center justify-center rounded-full mb-1 ${isSelected ? 'bg-blue-600' : ''}`}
                            >
                                <Text className={`text-base font-medium ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                                    {item.day}
                                </Text>
                                {!isSelected && hasTraining && (
                                    <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900" edges={['top']}>
            <StatusBar style="light" />
            {renderHeader()}
            {renderMonthPickerModal()}

            <FlatList
                data={selectedDayHistory}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <>
                        {renderCalendar()}
                        <View className="px-6 py-4 border-t border-white/5 bg-slate-900/50">
                            <Text className="text-white text-lg font-bold">
                                Atividades do dia {selectedDate ? format(selectedDate, 'd') : ''}
                            </Text>
                        </View>
                    </>
                )}
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
                ListEmptyComponent={
                    <View className="items-center justify-center py-10 px-10">
                        {loading ? (
                            <ActivityIndicator color="#2563eb" />
                        ) : (
                            <>
                                <Ionicons name="barbell-outline" size={40} color="#3f3f46" />
                                <Text className="text-zinc-500 text-center mt-3">Nenhuma atividade registrada.</Text>
                            </>
                        )}
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </SafeAreaView>
    );
}
