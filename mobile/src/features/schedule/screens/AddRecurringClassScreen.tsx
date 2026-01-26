import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, SafeAreaView, Switch } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MockService } from '../../../services/mockService';
import { DayOfWeek } from '../../../types/domain';

type AddRecurringClassScreenRouteProp = RouteProp<RootStackParamList, 'AddRecurringClass'>;
type AddRecurringClassScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Instructor = { id: string; name: string; role: 'HEAD_COACH' | 'INSTRUCTOR' | 'ASSISTANT' | 'STUDENT' };

export default function AddRecurringClassScreen() {
    const navigation = useNavigation<AddRecurringClassScreenNavigationProp>();
    const route = useRoute<AddRecurringClassScreenRouteProp>();
    const { teamId } = route.params;

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    // Multiple selection states
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Gi']);
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('WEDNESDAY');
    const [showDayPicker, setShowDayPicker] = useState(false);

    const [startTime, setStartTime] = useState('19:00');
    const [duration, setDuration] = useState('90');

    const [isRecurring, setIsRecurring] = useState(true);

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Gi', 'No-Gi', 'Kids', 'Competition', 'Private'];
    const days: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Helper translation for display
    const translateDay = (day: DayOfWeek) => {
        const map: Record<DayOfWeek, string> = {
            'MONDAY': 'Segunda', 'TUESDAY': 'Terça', 'WEDNESDAY': 'Quarta',
            'THURSDAY': 'Quinta', 'FRIDAY': 'Sexta', 'SATURDAY': 'Sábado', 'SUNDAY': 'Domingo'
        };
        return map[day];
    };

    useEffect(() => {
        loadInstructors();
    }, []);

    const loadInstructors = async () => {
        try {
            const data = await MockService.getInstructorsByTeam(teamId);
            setInstructors(data);
            // Auto-select first head coach if available for better UX
            const head = data.find(i => i.role === 'HEAD_COACH');
            if (head) setSelectedInstructors([head.id]);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao carregar instrutores.');
        } finally {
            setLoading(false);
        }
    };

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat));
        } else {
            setSelectedCategories(prev => [...prev, cat]);
        }
    };

    const toggleInstructor = (id: string) => {
        if (selectedInstructors.includes(id)) {
            setSelectedInstructors(prev => prev.filter(i => i !== id));
        } else {
            setSelectedInstructors(prev => [...prev, id]);
        }
    };

    const handleSave = async () => {
        if (!title || selectedInstructors.length === 0) {
            setErrorMessage('Por favor, preencha o título da aula e selecione pelo menos um instrutor.');
            setShowErrorModal(true);
            return;
        }

        try {
            await MockService.createWeeklyScheduleItem({
                id: Math.random().toString(),
                teamId,
                dayOfWeek: selectedDay,
                startTime,
                endTime: calculateEndTime(startTime, duration),
                title,
                subtitle: subtitle || undefined,
                instructorIds: selectedInstructors, // Passed as array
                categories: selectedCategories,     // Passed as array
                isRecurring,
            } as any); // Cast to any because MockService might not fully align perfectly yet, avoiding strict type check blocks for rapid iteration

            Alert.alert('Sucesso', 'Aula agendada com sucesso!');
            navigation.goBack();
        } catch (error) {
            setErrorMessage('Falha ao salvar a aula.');
            setShowErrorModal(true);
        }
    };

    const calculateEndTime = (start: string, durationMin: string) => {
        const [hours, minutes] = start.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + parseInt(durationMin);
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Nova Aula</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                {/* Title */}
                <View className="mb-4">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Título da Aula</Text>
                    <TextInput
                        className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 text-base"
                        placeholder="Ex: Treino de Competição"
                        placeholderTextColor="#52525b"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Subtitle */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Subtítulo (Opcional)</Text>
                    <TextInput
                        className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 text-base"
                        placeholder="Ex: Focado em quedas"
                        placeholderTextColor="#52525b"
                        value={subtitle}
                        onChangeText={setSubtitle}
                    />
                </View>

                {/* Day, Time, Duration Row */}
                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Dia</Text>
                        <TouchableOpacity
                            onPress={() => setShowDayPicker(true)}
                            className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 justify-center h-[58px]"
                        >
                            <Text className="text-white font-bold text-base text-center">{translateDay(selectedDay)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-24">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Início</Text>
                        <TextInput
                            className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 text-center font-bold text-base h-[58px]"
                            value={startTime}
                            onChangeText={setStartTime}
                            maxLength={5}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                    <View className="w-24">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Duração(min)</Text>
                        <View className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 justify-center h-[58px]">
                            <TextInput
                                className="text-white text-center font-bold text-base"
                                value={duration}
                                onChangeText={(t) => setDuration(t.replace(/\D/g, ''))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Categories */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-3">Categorias</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {categories.map(cat => {
                            const isSelected = selectedCategories.includes(cat);
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => toggleCategory(cat)}
                                    // Fixed size logic implicitly handled by flex-wrap+padding, removed scale logic if any exists in previous nativewind defaults
                                    // Style: Blue background with White text when selected
                                    className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-500' : 'bg-zinc-800 border-zinc-700'}`}
                                >
                                    <View className="flex-row items-center">
                                        <Text className={`${isSelected ? 'text-white' : 'text-gray-400'} font-bold text-sm`}>{cat}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Recurrence Switch */}
                <View className="mb-6 flex-row items-center justify-between bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                    <View>
                        <Text className="text-white font-bold text-base">Aula Recorrente</Text>
                        <Text className="text-zinc-500 text-xs">Repetir toda semana neste horário</Text>
                    </View>
                    <Switch
                        value={isRecurring}
                        onValueChange={setIsRecurring}
                        trackColor={{ false: "#3f3f46", true: "#2563eb" }} // blue-600
                        thumbColor={"#fff"}
                    />
                </View>

                {/* Instructors */}
                <View className="mb-32">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-3">Instrutores</Text>

                    {instructors.map(inst => {
                        const isSelected = selectedInstructors.includes(inst.id);
                        return (
                            <TouchableOpacity
                                key={inst.id}
                                onPress={() => toggleInstructor(inst.id)}
                                className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected ? 'bg-zinc-800 border-blue-500' : 'bg-zinc-900 border-zinc-800'}`}
                            >
                                <View className="w-12 h-12 bg-zinc-700 rounded-full items-center justify-center mr-4">
                                    <Text className="text-white text-lg font-bold">{inst.name.charAt(0)}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white text-base font-bold">{inst.name}</Text>
                                    <Text className="text-zinc-500 text-xs uppercase">{inst.role.replace('_', ' ')}</Text>
                                </View>
                                {isSelected ? (
                                    <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    </View>
                                ) : (
                                    <View className="w-6 h-6 rounded-full border-2 border-zinc-700" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-slate-900 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-600 w-full py-4 rounded-xl items-center active:bg-blue-700"
                >
                    <Text className="text-white font-bold text-lg">Confirmar Aula</Text>
                </TouchableOpacity>
            </View>

            {/* Day Selection Modal */}
            <Modal
                transparent={true}
                visible={showDayPicker}
                animationType="fade"
                onRequestClose={() => setShowDayPicker(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/60 justify-center items-center p-6"
                    activeOpacity={1}
                    onPress={() => setShowDayPicker(false)}
                >
                    <View className="bg-zinc-900 w-full rounded-2xl p-4 border border-zinc-800">
                        <Text className="text-white text-lg font-bold mb-4 text-center">Selecione o Dia</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {days.map(day => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => {
                                        setSelectedDay(day);
                                        setShowDayPicker(false);
                                    }}
                                    className={`w-[48%] mb-3 p-4 rounded-xl border ${selectedDay === day ? 'bg-blue-600 border-blue-500' : 'bg-zinc-800 border-zinc-700'}`}
                                >
                                    <Text className={`text-center font-bold ${selectedDay === day ? 'text-white' : 'text-gray-400'}`}>
                                        {translateDay(day)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Custom Error Modal */}
            <Modal
                transparent={true}
                visible={showErrorModal}
                animationType="fade"
                onRequestClose={() => setShowErrorModal(false)}
            >
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <View className="bg-zinc-900 p-6 rounded-2xl w-full border border-blue-900/50 shadow-lg shadow-blue-900/20">
                        <View className="w-16 h-16 bg-blue-900/20 rounded-full items-center justify-center mb-4 self-center">
                            <Ionicons name="alert-circle" size={32} color="#2563eb" />
                        </View>

                        <Text className="text-white text-xl font-bold text-center mb-2">Atenção</Text>
                        <Text className="text-zinc-400 text-center mb-6 leading-6">
                            {errorMessage}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowErrorModal(false)}
                            className="bg-zinc-800 w-full py-3 rounded-xl items-center border border-zinc-700"
                        >
                            <Text className="text-white font-bold">Entendi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
