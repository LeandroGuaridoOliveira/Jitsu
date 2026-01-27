
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Image, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';
import { MockService } from '../../../services/mockService';
import { getBeltRank, formatBeltName } from '../../../utils/beltSystem';

type ClassDetailScreenRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

export default function ClassDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<ClassDetailScreenRouteProp>();
    const { classId, preview } = route.params;

    const { user, teamMember } = useAuthStore();
    // Assuming this screen is accessed by Admin/Instructor as per context
    const isInstructor = true; // Forcing true for this task context as requested "Admin/Gestão"

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const isCancelled = details?.status === 'CANCELLED';

    // UI state
    const [selectedTab, setSelectedTab] = useState<'CONFIRMED' | 'PENDING' | 'ABSENT'>('CONFIRMED');
    const [showAddModal, setShowAddModal] = useState(false);

    // Add Modal State
    const [addMode, setAddMode] = useState<'STUDENT' | 'GUEST'>('STUDENT');

    // Student Search State
    const [userIdInput, setUserIdInput] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [isSearchingUser, setIsSearchingUser] = useState(false);

    // Guest State
    const [guestName, setGuestName] = useState('');
    const [guestBelt, setGuestBelt] = useState<string>('WHITE');

    useEffect(() => {
        loadDetails();
    }, [classId, refreshTrigger]);

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

    const handleEditClass = () => {
        Alert.alert(
            "Opções da Aula",
            "Selecione uma ação",
            [
                {
                    text: "Alterar Instrutor/Detalhes",
                    onPress: () => console.log("Edit Details Pressed"),
                },
                {
                    text: "Cancelar Aula",
                    style: "destructive",
                    onPress: confirmCancelClass
                },
                {
                    text: "Voltar",
                    style: "cancel"
                }
            ]
        );
    };

    const confirmCancelClass = () => {
        Alert.alert(
            "Confirmar Cancelamento",
            "Tem certeza que deseja cancelar esta aula? Esta ação não pode ser desfeita.",
            [
                { text: "Não", style: "cancel" },
                {
                    text: "Sim, Cancelar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await MockService.cancelSession(classId);
                            loadDetails(); // Refresh to get CANCELLED status
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    // Calculate Capacity
    const capacityTotal = 30; // Mock fixed capacity
    const currentCount = useMemo(() => {
        if (!details?.attendanceList) return 0;
        return details.attendanceList.filter((s: any) => s.status === 'PRESENT').length;
    }, [details]);

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
            // Black (Rank 4) -> White (Rank 0)
            const rankA = getBeltRank(a.beltColor || 'WHITE');
            const rankB = getBeltRank(b.beltColor || 'WHITE');
            return rankB - rankA;
        });
    }, [details, selectedTab]);

    // --- ACTIONS ---

    const handleSearchUser = async (text: string) => {
        // Apply Mask XXXX-XXXX
        // Simple formatter: Insert dash after 4 chars
        let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (formatted.length > 4) {
            formatted = formatted.slice(0, 4) + '-' + formatted.slice(4, 8);
        }

        setUserIdInput(formatted);

        if (formatted.length === 9) { // XXXX-XXXX is 9 chars
            setIsSearchingUser(true);
            try {
                const user = await MockService.findUserByCode(formatted);
                setFoundUser(user);
            } catch (err) {
                console.error(err);
                setFoundUser(null);
            } finally {
                setIsSearchingUser(false);
            }
        } else {
            setFoundUser(null);
        }
    };

    const handleAddStudent = async () => {
        if (!foundUser) return;
        try {
            await MockService.addStudentToClass(classId, foundUser.id);
            closeModal();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddGuest = async () => {
        if (!guestName.trim()) return;
        try {
            await MockService.addStudentToClass(classId, {
                guestName,
                guestBelt
            });
            closeModal();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setShowAddModal(false);
        setUserIdInput('');
        setFoundUser(null);
        setGuestName('');
        setGuestBelt('WHITE');
        setAddMode('STUDENT');
    };

    // --- RENDERERS ---

    const renderHeader = () => (
        <View className="flex-row items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5">
            {/* Top Left: Plus Button (Disabled if Cancelled) */}
            <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                disabled={isCancelled}
                className={`w-11 h-11 items-center justify-center -ml-2 rounded-full ${isCancelled ? 'opacity-30' : 'active:bg-white/10'}`}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-lg font-bold">Detalhes da Aula</Text>

            {/* Top Right: Edit Button */}
            <TouchableOpacity
                onPress={handleEditClass}
                className="px-2 py-1"
            >
                <Text className="text-red-500 font-bold text-base">Editar</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHero = () => {
        const displayTitle = details?.title || preview?.title || "Carregando...";
        const displayTime = details?.time || preview?.time || "--:--";
        const instructorName = details?.instructor?.name || "Instrutores";

        return (
            <View className="mx-4 mt-4 mb-6">
                <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-sm relative overflow-hidden">
                    {/* Decorative Accent */}
                    <View className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 ${isCancelled ? 'bg-red-600/10' : 'bg-blue-600/10'}`} />

                    {isCancelled && (
                        <View className="bg-red-500/20 self-start px-3 py-1 rounded-md mb-3 border border-red-500/30">
                            <Text className="text-red-400 text-xs font-bold uppercase tracking-wider">AULA CANCELADA</Text>
                        </View>
                    )}

                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className={`${isCancelled ? 'text-gray-500' : 'text-blue-500'} font-bold text-xl mb-1 line-through decoration-red-500`}>
                                {displayTime}
                            </Text>
                            <Text className="text-white text-2xl font-bold leading-tight max-w-[280px]">
                                {displayTitle}
                            </Text>
                        </View>
                        {/* Capacity Badge */}
                        <View className="bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 items-center justify-center">
                            <Text className="text-gray-400 text-[10px] uppercase font-bold mb-0.5">LOTAÇÃO</Text>
                            <Text className={`text-sm font-bold ${currentCount >= capacityTotal ? 'text-red-400' : 'text-white'}`}>
                                {currentCount}/{capacityTotal}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons name="person-circle-outline" size={20} color="#94a3b8" />
                        <Text className="text-gray-400 text-sm ml-2 font-medium">
                            {instructorName}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // --- Modal Content ---

    const renderBeltSelector = () => {
        const belts = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];
        const beltColors: Record<string, string> = {
            'WHITE': '#f8fafc',
            'BLUE': '#3b82f6',
            'PURPLE': '#a855f7',
            'BROWN': '#78350f',
            'BLACK': '#171717',
        };

        return (
            <View className="flex-row justify-between mt-4 mb-8">
                {belts.map((belt) => (
                    <TouchableOpacity
                        key={belt}
                        onPress={() => setGuestBelt(belt)}
                        className={`w-12 h-12 rounded-full items-center justify-center border-2 ${guestBelt === belt ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: beltColors[belt], borderColor: guestBelt === belt ? '#3b82f6' : (belt === 'WHITE' ? '#cbd5e1' : 'transparent') }}
                    >
                        {guestBelt === belt && (
                            <Ionicons name="checkmark" size={24} color={belt === 'WHITE' ? 'black' : 'white'} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    const renderAddModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showAddModal}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-black/80 justify-end sm:justify-center">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <View className="bg-zinc-900 w-full rounded-t-3xl sm:rounded-2xl p-6 border-t border-zinc-800 shadow-2xl pb-10">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-white text-xl font-bold">Adicionar Presença</Text>
                                <TouchableOpacity onPress={closeModal} className="p-2 -mr-2">
                                    <Ionicons name="close" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            {/* MODE SWITCHER */}
                            {addMode === 'STUDENT' ? (
                                <>
                                    <Text className="text-gray-400 text-sm mb-2 font-medium">Buscar Aluno (ID)</Text>
                                    <TextInput
                                        className="bg-zinc-800 text-white p-4 rounded-xl text-xl font-mono text-center border border-zinc-700 mb-4 tracking-widest"
                                        placeholder="XXXX-XXXX"
                                        placeholderTextColor="#52525b"
                                        value={userIdInput}
                                        onChangeText={handleSearchUser}
                                        autoCapitalize="characters"
                                        maxLength={9}
                                        autoFocus
                                    />

                                    {isSearchingUser && <ActivityIndicator className="mb-4" color="#3b82f6" />}

                                    {foundUser ? (
                                        <View className="bg-zinc-800 p-4 rounded-xl border border-blue-500/30 mb-6 flex-row items-center animate-pulse">
                                            <Image source={{ uri: foundUser.avatarUrl }} className="w-12 h-12 rounded-full bg-zinc-700 mr-3" />
                                            <View>
                                                <Text className="text-white font-bold text-lg">{foundUser.name}</Text>
                                                <Text className="text-blue-400 text-sm">{foundUser.beltColor} Belt</Text>
                                            </View>
                                            <View className="ml-auto bg-green-500/20 px-2 py-1 rounded">
                                                <Ionicons name="checkmark" size={16} color="#4ade80" />
                                            </View>
                                        </View>
                                    ) : (
                                        !isSearchingUser && userIdInput.length === 9 && (
                                            <Text className="text-red-400 text-center mb-4">Usuário não encontrado.</Text>
                                        )
                                    )}

                                    <TouchableOpacity
                                        className={`w-full py-4 rounded-xl items-center mb-4 ${foundUser ? 'bg-blue-600' : 'bg-zinc-800 opacity-50'}`}
                                        disabled={!foundUser}
                                        onPress={handleAddStudent}
                                    >
                                        <Text className={`font-bold text-lg ${foundUser ? 'text-white' : 'text-zinc-500'}`}>CONFIRMAR</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setAddMode('GUEST')}
                                        className="items-center py-2"
                                    >
                                        <Text className="text-blue-500 font-medium">Aluno sem conta? Cadastrar visitante</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                // GUEST MODE
                                <>
                                    <Text className="text-gray-400 text-sm mb-2 font-medium">Nome do Visitante</Text>
                                    <TextInput
                                        className="bg-zinc-800 text-white p-4 rounded-xl text-lg border border-zinc-700 mb-6"
                                        placeholder="Ex: João Silva"
                                        placeholderTextColor="#52525b"
                                        value={guestName}
                                        onChangeText={setGuestName}
                                        autoFocus
                                    />

                                    <Text className="text-gray-400 text-sm mb-2 font-medium">Graduação</Text>
                                    {renderBeltSelector()}

                                    <TouchableOpacity
                                        className={`w-full py-4 rounded-xl items-center mb-4 ${guestName.trim().length > 2 ? 'bg-blue-600' : 'bg-zinc-800 opacity-50'}`}
                                        disabled={guestName.trim().length <= 2}
                                        onPress={handleAddGuest}
                                    >
                                        <Text className={`font-bold text-lg ${guestName.trim().length > 2 ? 'text-white' : 'text-zinc-500'}`}>ADICIONAR VISITANTE</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setAddMode('STUDENT')}
                                        className="items-center py-2"
                                    >
                                        <Text className="text-gray-400/80 font-medium text-sm">Cancelar e buscar aluno</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    // --- List Item ---

    const renderAttendanceItem = ({ item }: { item: any }) => {
        const isGuest = item.isVisitor;
        const beltColor = item.beltColor || 'WHITE';

        const beltColorsMap: Record<string, string> = {
            'WHITE': 'bg-white',
            'BLUE': 'bg-blue-600',
            'PURPLE': 'bg-purple-600',
            'BROWN': 'bg-amber-800',
            'BLACK': 'bg-red-600', // Using red for black belt distinction in UI or just black
        };
        // For strict visual requirements "Black Top -> White Bottom", usually Black belt is Black color.
        // User asked for "Seletor de cores... (Black)" in guest. 
        // In list, display the belt.

        return (
            <View className="flex-row items-center mb-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/50">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden mr-4 border border-white/10 items-center justify-center">
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} className="w-full h-full" />
                    ) : (
                        <Text className="text-gray-500 text-lg font-bold">{item.name?.charAt(0).toUpperCase()}</Text>
                    )}
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="text-white font-bold text-base mr-2">{item.name}</Text>
                        {isGuest && (
                            <View className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                                <Text className="text-gray-400 text-[10px] font-bold tracking-wide">VISITANTE</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row items-center mt-1">
                        {/* Belt Indicator */}
                        <View className={`w-3 h-3 rounded-full mr-2 ${beltColor === 'BLACK' ? 'bg-zinc-950 border border-red-600' : (beltColorsMap[beltColor] || 'bg-gray-400')}`} />
                        <Text className="text-gray-400 text-xs font-medium">{formatBeltName(beltColor)}</Text>
                    </View>
                </View>

                {/* Check Status */}
                {item.status === 'PRESENT' && (
                    <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/20">
                        <Ionicons name="checkmark" size={18} color="white" />
                    </View>
                )}
                {item.status === 'PENDING' && (
                    <View className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 items-center justify-center">
                        <View className="w-2 h-2 bg-zinc-500 rounded-full" />
                    </View>
                )}
                {item.status === 'ABSENT' && (
                    <View className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center">
                        <Ionicons name="close" size={18} color="#ef4444" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <StatusBar style="light" />

            {renderHeader()}

            {loading && !details ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <View className="flex-1">
                    <View className="pb-4">
                        {renderHero()}

                        {/* Segmented Control */}
                        <View className="flex-row mx-4 mb-4 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                            {[
                                { key: 'CONFIRMED', label: 'Confirmados' },
                                { key: 'PENDING', label: 'Pendentes' },
                                { key: 'ABSENT', label: 'Ausentes' }
                            ].map((tab) => (
                                <TouchableOpacity
                                    key={tab.key}
                                    onPress={() => setSelectedTab(tab.key as any)}
                                    className={`flex-1 py-1.5 items-center rounded-md ${selectedTab === tab.key ? 'bg-zinc-800 shadow-sm' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-xs font-bold ${selectedTab === tab.key ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <ScrollView className={`flex-1 px-4 ${isCancelled ? 'opacity-50' : ''}`}>
                        {sortedStudents.map((item: any) => (
                            <View key={item.id}>
                                {renderAttendanceItem({ item })}
                            </View>
                        ))}
                        <View className="h-20" />
                    </ScrollView>
                </View>
            )}

            {renderAddModal()}
        </SafeAreaView>
    );
}
