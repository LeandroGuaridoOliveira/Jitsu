import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MockService } from '../../../services/mockService';
import { DayOfWeek } from '../../../types/domain';

type EditClassScreenRouteProp = RouteProp<RootStackParamList, 'EditClass'>;
type EditClassScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Instructor = { id: string; name: string; role: 'HEAD_COACH' | 'INSTRUCTOR' | 'ASSISTANT' | 'STUDENT' };

export default function EditClassScreen() {
    const navigation = useNavigation<EditClassScreenNavigationProp>();
    const route = useRoute<EditClassScreenRouteProp>();
    const { classId } = route.params;

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    // Multiple selection states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('WEDNESDAY');
    const [showDayPicker, setShowDayPicker] = useState(false);

    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('90'); // Default or calculated

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [isCancelled, setIsCancelled] = useState(false);

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
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [classDetails, instructorsData] = await Promise.all([
                MockService.getClassDetails(classId),
                MockService.getInstructorsByTeam('t1') // Assuming 't1' for now
            ]);

            setInstructors(instructorsData);

            // Populate form
            setTitle(classDetails.title);
            // setSubtitle(classDetails.subtitle || ''); // Mock might not have subtitle in details yet
            setStartTime(classDetails.time.split(' - ')[0] || '19:00');
            // setDuration(...) // Calculate from end time if needed

            if (classDetails.instructor) {
                // Approximate matching since details returns object, expected generic instructor list
                // For now, we'll just keep the instructor selection empty or try to match if ID available
                if (classDetails.instructor.id) {
                    setSelectedInstructors([classDetails.instructor.id]);
                }
            }

            // Check formatted cancel status. MockService.getClassDetails handles the Override.
            setIsCancelled(classDetails.time.includes('CANCELADA') || false); // Wait, previous step Logic handled status in service. 
            // Actually, let's re-verify cancelled status using the helper if needed or just trust the new MockService logic that might inject a property
            // In the previous step, I added `isCancelled` property to WeeklyScheduleItem, but `getClassDetails` returns a different shape.
            // Let's rely on `status === 'CANCELLED'` if I updated `getClassDetails` to return that.
            // Checking `mockService.ts` edits: `getClassDetails` overrides status to 'CANCELLED'.
            if ((classDetails as any).status === 'CANCELLED') {
                setIsCancelled(true);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao carregar dados da aula.');
        } finally {
            setLoading(false);
        }
    };

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
        // Validation
        if (!title) {
            Alert.alert('Erro', 'Título é obrigatório.');
            return;
        }

        try {
            await MockService.updateClass(classId, {
                title,
                subtitle,
                startTime,
                duration,
                dayOfWeek: selectedDay,
                instructorIds: selectedInstructors,
                categories: selectedCategories
            });
            Alert.alert('Sucesso', 'Alterações salvas!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar alterações.');
        }
    };

    const handleToggleStatus = async () => {
        try {
            if (isCancelled) {
                await MockService.restoreSession(classId);
                Alert.alert('Sucesso', 'Aula ativada novamente.');
            } else {
                await MockService.cancelSession(classId);
                Alert.alert('Aula Cancelada', 'A aula foi cancelada com sucesso.');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao alterar status da aula.');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-zinc-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Editar Aula</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-blue-500 font-bold text-base">Salvar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                {/* Status Indicator */}
                {isCancelled && (
                    <View className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6 flex-row items-center">
                        <Ionicons name="warning" size={24} color="#ef4444" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-red-400 font-bold text-lg">Aula Cancelada</Text>
                            <Text className="text-red-400/70 text-xs">Esta aula não aceitará novas presenças.</Text>
                        </View>
                    </View>
                )}

                {/* Title */}
                <View className="mb-4">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Título da Aula</Text>
                    <TextInput
                        className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 text-base"
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
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Duração</Text>
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

                {/* Instructors */}
                <View className="mb-10">
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

                {/* Spacer */}
                <View className="h-24" />
            </ScrollView>

            {/* Cancel/Restore Button (Bottom) */}
            <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-slate-900 pb-8">
                <TouchableOpacity
                    onPress={handleToggleStatus}
                    className={`w-full py-4 rounded-xl items-center flex-row justify-center border ${isCancelled ? 'bg-blue-600 border-blue-500' : 'bg-red-500/10 border-red-500/50'}`}
                >
                    <Ionicons name={isCancelled ? "refresh" : "trash-outline"} size={22} color={isCancelled ? "white" : "#ef4444"} style={{ marginRight: 8 }} />
                    <Text className={`font-bold text-lg ${isCancelled ? 'text-white' : 'text-red-500'}`}>
                        {isCancelled ? 'Ativar Aula / Refazer' : 'Cancelar Aula'}
                    </Text>
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
        </SafeAreaView>
    );
}
