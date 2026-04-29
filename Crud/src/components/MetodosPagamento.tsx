import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../styles';
import { colors } from '../../colors';
import { API_URL } from '../api';

interface MetodosPagamentoProps {
    onVoltar: () => void;
}

export default function MetodosPagamento({ onVoltar }: MetodosPagamentoProps) {
    const [cartoes, setCartoes] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);

    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeTitular, setNomeTitular] = useState('');
    const [validade, setValidade] = useState('');

    const buscarCartoes = useCallback(async () => {
        try {
            const idSalvo = await AsyncStorage.getItem('user_id');
            if (!idSalvo) return;
            const response = await axios.get(`${API_URL}/cartoes/${idSalvo}`);
            setCartoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar cartões:", error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        buscarCartoes();
    }, [buscarCartoes]);

    const obterEstiloBandeira = (bandeira: string) => {
        const b = bandeira.toLowerCase();
        if (b === 'visa') return { corFundo: '#1A1F71' };
        if (b === 'mastercard') return { corFundo: '#222222' };
        if (b === 'amex') return { corFundo: '#006FCF' };
        return { corFundo: '#607D8B' };
    };

    const identificarBandeira = (numero: string) => {
        if (numero.startsWith('4')) return 'Visa';
        if (numero.startsWith('5')) return 'Mastercard';
        if (numero.startsWith('3')) return 'Amex';
        return 'Outro';
    };

    const formatarNumeroInput = (texto: string) => {
        const limpo = texto.replace(/\D/g, '').substring(0, 16);
        const formatado = limpo.replace(/(\d{4})(?=\d)/g, '$1 ');
        setNumeroCartao(formatado);
    };

    const formatarValidadeInput = (texto: string) => {
        const limpo = texto.replace(/\D/g, '').substring(0, 4);
        if (limpo.length >= 3) {
            setValidade(`${limpo.substring(0, 2)}/${limpo.substring(2)}`);
        } else {
            setValidade(limpo);
        }
    };

    const adicionarCartao = async () => {
        if (numeroCartao.length < 19 || nomeTitular === '' || validade.length < 5) {
            Alert.alert("Erro", "Preencha todos os campos do cartão corretamente.");
            return;
        }
        try {
            const idSalvo = await AsyncStorage.getItem('user_id');
            const bandeira = identificarBandeira(numeroCartao);
            await axios.post(`${API_URL}/cartoes`, {
                usuario_id: idSalvo,
                numero_cartao: numeroCartao.replace(/\s/g, ''),
                bandeira: bandeira,
                nome_titular: nomeTitular,
                validade: validade
            });
            Alert.alert("Sucesso", "Cartão salvo com segurança!");
            setModalAberto(false);
            setNumeroCartao(''); setNomeTitular(''); setValidade('');
            buscarCartoes();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o cartão.");
        }
    };

    const deletarCartao = async (id: number) => {
        Alert.alert("Remover Cartão", "Deseja realmente apagar este cartão?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sim, Remover", style: "destructive", onPress: async () => {
                try {
                    await axios.delete(`${API_URL}/cartoes/${id}`);
                    buscarCartoes();
                } catch (error) { Alert.alert("Erro", "Não foi possível remover."); }
            }}
        ]);
    };

    if (carregando) {
        return (
            <View style={styles.centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <ScrollView 
                contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20, flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
            >
                {/* 🟢 TÍTULO LIMPO (SEM HEADER INTERNO) */}
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.cinzaTecnico, marginBottom: 25 }}>
                    Meus Cartões
                </Text>

                {/* 🟢 LISTA OCUPANDO 100% DA LARGURA */}
                {cartoes.map((cartao) => {
                    const estilo = obterEstiloBandeira(cartao.bandeira);
                    return (
                        <View key={cartao.id} style={{ width: '100%', marginBottom: 20 }}>
                            <View style={[styles.cartaoCreditoSério, { backgroundColor: estilo.corFundo, width: '100%', marginHorizontal: 0 }]}>
                                <View style={styles.linhaTopCartaoSério}>
                                    <Ionicons name="hardware-chip" size={40} color="#FFD700" />
                                    <Text style={styles.textoBandeiraSério}>{cartao.bandeira}</Text>
                                </View>
                                <Text style={styles.numeroCartaoSério}>**** **** **** {cartao.numero_final}</Text>
                                <View style={styles.linhaBottomCartaoSério}>
                                    <View style={styles.blocoTextoCartaoSério}>
                                        <Text style={styles.textoLabelCartaoSério}>Titular</Text>
                                        <Text style={styles.textoValorCartaoSério}>{cartao.nome_titular}</Text>
                                    </View>
                                    <View style={styles.blocoTextoCartaoSério}>
                                        <Text style={styles.textoLabelCartaoSério}>Validade</Text>
                                        <Text style={styles.textoValorCartaoSério}>{cartao.validade}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={[styles.btnRemoverCartaoSério, { top: 5, right: 5, elevation: 10 }]} 
                                onPress={() => deletarCartao(cartao.id)}
                            >
                                <Ionicons name="trash" size={16} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {cartoes.length === 0 && (
                    <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
                        <Ionicons name="card-outline" size={80} color="#CCC" />
                        <Text style={{ color: colors.placeholder, marginTop: 15 }}>Nenhum cartão salvo.</Text>
                    </View>
                )}

                <TouchableOpacity 
                    style={[styles.btnAdicionarCartaoSério, { width: '100%', height: 55, marginTop: 10 }]} 
                    onPress={() => setModalAberto(true)}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#FFF" />
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                        Adicionar Novo Cartão
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* 🟢 MODAL DE CADASTRO */}
            <Modal visible={modalAberto} animationType="slide" transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.cinzaTecnico }}>Novo Cartão</Text>
                            <TouchableOpacity onPress={() => setModalAberto(false)}>
                                <Ionicons name="close-circle" size={30} color={colors.placeholder} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 14, color: colors.cinzaTecnico, marginBottom: 5, fontWeight: 'bold' }}>Número do Cartão</Text>
                        <TextInput
                            style={{ backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' }}
                            placeholder="0000 0000 0000 0000" keyboardType="numeric" value={numeroCartao} onChangeText={formatarNumeroInput} maxLength={19}
                        />

                        <Text style={{ fontSize: 14, color: colors.cinzaTecnico, marginBottom: 5, fontWeight: 'bold' }}>Nome do Titular</Text>
                        <TextInput
                            style={{ backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' }}
                            placeholder="NOME IGUAL AO CARTÃO" autoCapitalize="characters" value={nomeTitular} onChangeText={setNomeTitular}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={{ fontSize: 14, color: colors.cinzaTecnico, marginBottom: 5, fontWeight: 'bold' }}>Validade</Text>
                                <TextInput
                                    style={{ backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' }}
                                    placeholder="MM/AA" keyboardType="numeric" value={validade} onChangeText={formatarValidadeInput} maxLength={5}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, color: colors.cinzaTecnico, marginBottom: 5, fontWeight: 'bold' }}>CVV</Text>
                                <TextInput
                                    style={{ backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' }}
                                    placeholder="123" keyboardType="numeric" maxLength={4} secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.btnAdicionarCartaoSério, { marginTop: 20 }]} onPress={adicionarCartao}>
                            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Salvar Cartão Seguro</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}