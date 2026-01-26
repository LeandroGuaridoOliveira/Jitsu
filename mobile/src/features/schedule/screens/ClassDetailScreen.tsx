import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';
import { MockService } from '../../../services/mockService';

type ClassDetailScreenRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

export default function ClassDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<ClassDetailScreenRouteProp>();
    const { classId, preview } = route.params;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        loadDetails();
    }, [classId]);

    const loadDetails = async () => {
        setLoading(true);
        try {
            const data = await MockService.getClassDetails(classId);
            setDetails(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fallback to preview data if loading
    const displayTitle = details?.title || preview?.title || "Carregando...";
    const displayTime = details?.time || preview?.time || "--:--";
    const displayInstructor = details?.instructor?.name || preview?.instructor || "Instrutor";
    const displayDate = details?.date ? new Date(details.date).toLocaleDateString() : '';

    const isHistory = details?.status === 'COMPLETED';

    const renderHeader = () => (
        <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">{isHistory ? 'Histórico' : 'Detalhes da Aula'}</Text>
            <View className="w-10" />
        </View>
    );

    const renderHero = () => (
        <View className="bg-zinc-900 mx-6 mt-2 p-6 rounded-2xl border border-zinc-800 shadow-sm">
            {/* Status Badge for History */}
            {isHistory && (
                <View className={`self-start px-3 py-1 rounded-full mb-3 ${details?.userStatus === 'PRESENT' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Text className={`text-xs font-bold ${details?.userStatus === 'PRESENT' ? 'text-green-400' : 'text-red-400'}`}>
                        {details?.userStatus === 'PRESENT' ? 'PRESENÇA CONFIRMADA' : 'FALTOU'}
                    </Text>
                </View>
            )}

            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                {displayDate}
            </Text>

            <Text className="text-white text-4xl font-bold mb-2">
                {displayTime}
            </Text>

            <Text className="text-white text-xl font-semibold mb-4 leading-tight">
                {displayTitle}
            </Text>

            <View className="flex-row items-center bg-zinc-800 self-start px-3 py-1.5 rounded-lg border border-zinc-700">
                <Ionicons name="location-sharp" size={14} color="#dc2626" />
                <Text className="text-gray-300 text-xs font-medium ml-1.5">{details?.location || "Dojo Principal"}</Text>
            </View>
        </View>
    );

    const renderInstructor = () => (
        <View className="flex-row items-center mx-6 mt-6 mb-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <View className="h-12 w-12 rounded-full bg-zinc-700 items-center justify-center border border-zinc-600 overflow-hidden">
                {details?.instructor?.avatarUrl ? (
                    <Image source={{ uri: details.instructor.avatarUrl }} className="w-full h-full" />
                ) : (
                    <Ionicons name="person" size={20} color="#e4e4e7" />
                )}
            </View>
            <View className="ml-4">
                <Text className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-0.5">
                    Instrutor
                </Text>
                <Text className="text-white text-base font-semibold">
                    {displayInstructor}
                </Text>
            </View>
        </View>
    );

    const renderSummary = () => {
        if (!details?.summary) return null;
        return (
            <View className="mx-6 mb-8">
                <Text className="text-white text-lg font-bold mb-3">Resumo do Treino</Text>
                <View className="bg-zinc-900 p-4 rounded-xl border border-white/5">
                    <Text className="text-slate-300 leading-relaxed">
                        {details.summary}
                    </Text>
                </View>
            </View>
        );
    };

    const renderAttendanceList = () => {
        if (!details?.attendanceList) return null;

        return (
            <View className="mx-6 mb-32">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-lg font-bold">Participantes</Text>
                    <Text className="text-slate-500 text-sm">{details.attendanceList.length} Atletas</Text>
                </View>

                {details.attendanceList.map((student: any, index: number) => (
                    <View key={index} className="flex-row items-center mb-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                        <View className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 mr-3">
                            <Image source={{ uri: student.avatarUrl }} className="w-full h-full" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-medium">{student.name}</Text>
                        </View>
                        {student.status === 'PRESENT' ? (
                            <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                        ) : (
                            <Ionicons name="close-circle" size={20} color="#ef4444" />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderFutureActions = () => {
        if (isHistory) return null;

        return (
            <View className="absolute bottom-0 left-0 right-0 bg-slate-900/90 pt-6 pb-8 px-6 border-t border-white/5">
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg shadow-blue-900/40"
                    onPress={() => setShowConfirmation(true)}
                >
                    <Text className="text-white font-bold text-lg tracking-wide uppercase">
                        Confirmar Presença
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />
            {renderHeader()}

            {loading && !details ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <ScrollView className="flex-1">
                    {renderHero()}
                    {renderInstructor()}
                    {isHistory && renderSummary()}
                    {isHistory && renderAttendanceList()}
                </ScrollView>
            )}

            {renderFutureActions()}

            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmation}
                onRequestClose={() => setShowConfirmation(false)}
            >
                <View className="flex-1 bg-black/80 items-center justify-center px-6">
                    <View className="bg-zinc-900 p-8 rounded-2xl items-center border border-zinc-800 w-full max-w-xs shadow-2xl">
                        <View className="h-16 w-16 bg-green-900/30 rounded-full items-center justify-center mb-6 border border-green-900/50">
                            <Ionicons name="checkmark" size={32} color="#4ade80" />
                        </View>

                        <Text className="text-white text-xl font-bold text-center mb-2">
                            Presença Confirmada!
                        </Text>
                        <Text className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                            Bom treino! Te vejo no tatame.
                        </Text>

                        <TouchableOpacity
                            className="bg-white w-full py-3 rounded-lg items-center"
                            onPress={() => setShowConfirmation(false)}
                        >
                            <Text className="text-zinc-900 font-bold">FECHAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
