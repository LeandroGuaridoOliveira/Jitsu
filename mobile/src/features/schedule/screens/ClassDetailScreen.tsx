import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Image, ActivityIndicator, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';
import { MockService } from '../../../services/mockService';
import { getBeltRank, formatBeltName } from '../../../utils/beltSystem';
import { User } from '../../../types/domain';

type ClassDetailScreenRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

export default function ClassDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<ClassDetailScreenRouteProp>();
    const { classId, preview } = route.params;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // UI State
    const [selectedTab, setSelectedTab] = useState<'CONFIRMED' | 'PENDING' | 'ABSENT'>('CONFIRMED');
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    // Add User Logic
    const [userIdInput, setUserIdInput] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [isSearchingUser, setIsSearchingUser] = useState(false);

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

    const sortedStudents = useMemo(() => {
        if (!details?.attendanceList) return [];

        let filtered = details.attendanceList.filter((s: any) => {
            if (selectedTab === 'CONFIRMED') return s.status === 'PRESENT';
            if (selectedTab === 'PENDING') return s.status === 'PENDING';
            if (selectedTab === 'ABSENT') return s.status === 'ABSENT';
            return true;
        });

        return filtered.sort((a: any, b: any) => {
            // Higher belt rank first (Descending)
            const rankA = getBeltRank(a.beltColor || 'WHITE');
            const rankB = getBeltRank(b.beltColor || 'WHITE');
            return rankB - rankA;
        });
    }, [details, selectedTab]);

    // --- RENDERERS ---

    const renderHeader = () => (
        <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">{isHistory ? 'Histórico' : 'Detalhes da Aula'}</Text>
            <View className="w-10" />
        </View>
    );

    const renderHero = () => {
        return (
            <View className="mx-6 mt-2 mb-6">
                {/* Main Card */}
                <View className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm relative overflow-hidden">
                    {/* Decorative Blue Accents */}
                    <View className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-10 -mt-10" />

                    {/* Status Badge (History) */}
                    {isHistory && (
                        <View className={`self-start px-3 py-1 rounded-full mb-4 ${details?.userStatus === 'PRESENT' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <Text className={`text-xs font-bold ${details?.userStatus === 'PRESENT' ? 'text-green-400' : 'text-red-400'}`}>
                                {details?.userStatus === 'PRESENT' ? 'PRESENÇA CONFIRMADA' : 'FALTOU'}
                            </Text>
                        </View>
                    )}

                    {/* Top Row: Date & Time */}
                    <View className="flex-row items-baseline mb-1">
                        <Text className="text-blue-500 font-bold text-lg mr-2">
                            {displayTime}
                        </Text>
                        <Text className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                            {displayDate}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-white text-2xl font-bold mb-4 leading-tight">
                        {displayTitle}
                    </Text>

                    {/* Info Row: Location & Type */}
                    <View className="flex-row items-center mb-6 flex-wrap gap-2">
                        <View className="flex-row items-center bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                            <Ionicons name="location-sharp" size={14} color="#3b82f6" />
                            <Text className="text-gray-300 text-xs font-medium ml-1.5">{details?.location || "Dojo Principal"}</Text>
                        </View>
                        <View className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                            <Text className="text-blue-400 text-xs font-bold uppercase">No Gi</Text>
                        </View>
                    </View>

                    {/* Instructor Info (Moved inside Hero as requested) */}
                    <View className="flex-row items-center pt-5 border-t border-white/5">
                        <View className="h-10 w-10 rounded-full bg-zinc-700 items-center justify-center border border-zinc-600 overflow-hidden">
                            {details?.instructor?.avatarUrl ? (
                                <Image source={{ uri: details.instructor.avatarUrl }} className="w-full h-full" />
                            ) : (
                                <Ionicons name="person" size={18} color="#e4e4e7" />
                            )}
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">
                                Instrutor
                            </Text>
                            <Text className="text-white text-sm font-semibold">
                                {displayInstructor}
                            </Text>
                        </View>
                        {/* Chat button removed per request */}
                    </View>
                </View>
            </View>
        )
    };

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

    const renderTabs = () => (
        <View className="flex-row mx-6 mb-4 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <TouchableOpacity
                onPress={() => setSelectedTab('CONFIRMED')}
                className={`flex-1 py-2 items-center rounded-lg ${selectedTab === 'CONFIRMED' ? 'bg-blue-600' : 'bg-transparent'}`}
            >
                <Text className={`font-bold text-xs ${selectedTab === 'CONFIRMED' ? 'text-white' : 'text-gray-400'}`}>Confirmed ({details?.attendanceList?.filter((s: any) => s.status === 'PRESENT').length || 0})</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setSelectedTab('PENDING')}
                className={`flex-1 py-2 items-center rounded-lg ${selectedTab === 'PENDING' ? 'bg-zinc-700' : 'bg-transparent'}`}
            >
                <Text className={`font-bold text-xs ${selectedTab === 'PENDING' ? 'text-white' : 'text-gray-400'}`}>Pending ({details?.attendanceList?.filter((s: any) => s.status === 'PENDING').length || 0})</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setSelectedTab('ABSENT')}
                className={`flex-1 py-2 items-center rounded-lg ${selectedTab === 'ABSENT' ? 'bg-zinc-700' : 'bg-transparent'}`}
            >
                <Text className={`font-bold text-xs ${selectedTab === 'ABSENT' ? 'text-white' : 'text-gray-400'}`}>Absent ({details?.attendanceList?.filter((s: any) => s.status === 'ABSENT').length || 0})</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAttendanceList = () => {
        if (!details?.attendanceList) return null;

        return (
            <View className="mx-6 mb-32">
                {renderTabs()}

                {sortedStudents.map((student: any, index: number) => {
                    const beltColorText = {
                        'WHITE': 'text-white',
                        'BLUE': 'text-blue-400',
                        'PURPLE': 'text-purple-400',
                        'BROWN': 'text-amber-700',
                        'BLACK': 'text-red-500',
                    }[student.beltColor as string] || 'text-gray-400';

                    return (
                        <View key={index} className="flex-row items-center mb-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                            <View className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border border-white/10 mr-4">
                                <Image source={{ uri: student.avatarUrl }} className="w-full h-full" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base">{student.name}</Text>
                                <View className="flex-row items-center mt-0.5">
                                    <View className={`w-2 h-2 rounded-full mr-2 ${student.beltColor === 'WHITE' ? 'bg-white' : ''} ${student.beltColor === 'BLUE' ? 'bg-blue-500' : ''} ${student.beltColor === 'PURPLE' ? 'bg-purple-500' : ''} ${student.beltColor === 'BROWN' ? 'bg-amber-800' : ''} ${student.beltColor === 'BLACK' ? 'bg-black border border-white' : ''}`} />
                                    <Text className={`${beltColorText} text-xs font-medium`}>{formatBeltName(student.beltColor)} Belt</Text>
                                    {student.isVisitor && (
                                        <View className="ml-2 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-500/30">
                                            <Text className="text-blue-300 text-[10px] font-bold">VISITANTE</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {student.status === 'PRESENT' && (
                                <View className="w-8 h-8 rounded-full bg-green-500/10 items-center justify-center">
                                    <Ionicons name="checkmark" size={18} color="#4ade80" />
                                </View>
                            )}
                            {student.status === 'PENDING' && (
                                <View className="w-8 h-8 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700">
                                    <View className="w-2 h-2 rounded-full bg-zinc-500" />
                                </View>
                            )}
                            {student.status === 'ABSENT' && (
                                <View className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center">
                                    <Ionicons name="close" size={18} color="#ef4444" />
                                </View>
                            )}
                        </View>
                    )
                })}
            </View>
        );
    };

    const handleSearchUser = async (text: string) => {
        setUserIdInput(text);
        if (text.length === 9) {
            setIsSearchingUser(true);
            try {
                const user = await MockService.findUserByCode(text);
                setFoundUser(user);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearchingUser(false);
            }
        } else {
            setFoundUser(null);
        }
    };

    const handleConfirmAddUser = async () => {
        if (!foundUser) return;
        try {
            await MockService.addStudentToClass(details.id, foundUser.id);
            setShowAddUserModal(false);
            setUserIdInput('');
            setFoundUser(null);
            loadDetails();
        } catch (e) {
            console.error(e);
        }
    };

    const renderFAB = () => (
        <TouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-900/50 z-50 transition-transform active:scale-95"
            onPress={() => setShowAddUserModal(true)}
        >
            <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
    );

    const renderAddUserModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showAddUserModal}
            onRequestClose={() => setShowAddUserModal(false)}
        >
            <View className="flex-1 bg-black/80 justify-start pt-20 px-6">
                {/* Fixed keyboard overlap by moving to top (justify-start + pt-20) */}
                <View className="bg-zinc-900 w-full rounded-2xl p-6 border border-zinc-800 shadow-2xl">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-xl font-bold">Adicionar Aluno</Text>
                        <TouchableOpacity onPress={() => setShowAddUserModal(false)}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-gray-400 text-sm mb-2">ID do Usuário</Text>
                    <TextInput
                        className="bg-zinc-800 text-white p-4 rounded-xl text-lg font-mono border border-zinc-700 mb-6"
                        placeholder="Ex: A1B2-8899"
                        placeholderTextColor="#52525b"
                        value={userIdInput}
                        onChangeText={handleSearchUser}
                        autoCapitalize="characters"
                        maxLength={9}
                        autoFocus
                    />

                    {isSearchingUser && <ActivityIndicator color="#2563eb" className="mb-4" />}

                    {foundUser && (
                        <View className="bg-zinc-800 p-4 rounded-xl border border-blue-500/30 mb-6 flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-zinc-700 overflow-hidden mr-3">
                                <Image source={{ uri: foundUser.avatarUrl }} className="w-full h-full" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg">{foundUser.name}</Text>
                                <Text className="text-blue-400 text-sm font-medium">{foundUser.beltColor || 'WHITE'} Belt</Text>
                            </View>
                            <View className="bg-blue-500/20 px-2 py-1 rounded">
                                <Text className="text-blue-400 text-xs font-bold">ENCONTRADO</Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        className={`w-full py-4 rounded-xl items-center ${foundUser ? 'bg-blue-600' : 'bg-zinc-800 opacity-50'}`}
                        disabled={!foundUser}
                        onPress={handleConfirmAddUser}
                    >
                        <Text className={`font-bold text-lg ${foundUser ? 'text-white' : 'text-zinc-500'}`}>
                            ADICIONAR À AULA
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" />

            {renderHeader()}

            {loading && !details ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <View className="flex-1 relative">
                    <ScrollView className="flex-1">
                        {renderHero()}
                        {/* Instructor is now inside Hero */}
                        {isHistory && renderSummary()}
                        {renderAttendanceList()}
                    </ScrollView>
                    {renderFAB()}
                </View>
            )}

            {renderAddUserModal()}

            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmation}
                onRequestClose={() => setShowConfirmation(false)}
            >
                {/* Keep original confirmation modal just in case, or remove if not needed. Keeping for safety if used elsewhere */}
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
