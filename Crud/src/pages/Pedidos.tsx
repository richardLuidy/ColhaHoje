import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../colors';
import styles from '../../styles';
import api from '../api';

export default function Pedidos() {
    const [abaAtiva, setAbaAtiva] = useState('andamento'); // 'andamento' ou 'historico'
    const [loading, setLoading] = useState(true);
    const [pedidos, setPedidos] = useState<any[]>([]); // <any[]> remove o erro do TypeScript no .filter

    // Busca os pedidos na API
    const carregarPedidos = async () => {
        try {
            setLoading(true);
            // Simulando o ID 1 (depois pegamos do AsyncStorage do usuário logado)
            const response = await api.get('/pedidos/usuario/1');
            setPedidos(response.data);
        } catch (error) {
            console.log("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPedidos();
    }, []);

    // Filtra os pedidos com base na aba selecionada
    const pedidosFiltrados = pedidos.filter(p => 
        abaAtiva === 'andamento' ? p.status === 'pendente' : p.status !== 'pendente'
    );

    // Função que renderiza cada cartão de pedido (usando os novos estilos)
    const renderCardPedido = ({ item }: { item: any }) => (
        <View style={styles.pedidoCard}>
            {/* Ícone ou Foto do Produto */}
            <View style={styles.pedidoIconContainer}>
                <Text style={{ fontSize: 24 }}>📦</Text>
            </View>

            {/* Informações do Pedido */}
            <View style={styles.pedidoInfoContainer}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>
                    Pedido #{item.id}
                </Text>
                <Text style={{ color: '#666', fontSize: 14 }}>{item.metodo_pagamento}</Text>
                <Text style={{ color: colors.verdeColheita, fontWeight: 'bold', marginTop: 4 }}>
                    R$ {parseFloat(item.total).toFixed(2).replace('.', ',')}
                </Text>
            </View>

            {/* Badge de Status Dinâmica */}
            <View style={[
                styles.pedidoStatusBadge, 
                { backgroundColor: item.status === 'pendente' ? '#FFF3E0' : '#E8F5E9' }
            ]}>
                <Text style={[
                    styles.pedidoStatusText, 
                    { color: item.status === 'pendente' ? '#E65100' : colors.verdeColheita }
                ]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <StatusBar style="dark" />

            {/* 🟢 CABEÇALHO COM ABAS (Estilo João) */}
            <View style={styles.pedidosTabContainer}>
                <TouchableOpacity 
                    onPress={() => setAbaAtiva('andamento')}
                    style={[
                        styles.pedidosTabButton, 
                        abaAtiva === 'andamento' && styles.pedidosTabActive
                    ]}
                >
                    <Text style={[
                        styles.pedidosTabText, 
                        { color: abaAtiva === 'andamento' ? colors.verdeColheita : '#999' }
                    ]}>
                        PEDIDOS EM ANDAMENTO
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setAbaAtiva('historico')}
                    style={[
                        styles.pedidosTabButton, 
                        abaAtiva === 'historico' && styles.pedidosTabActiveIndicator
                    ]}
                >
                    <Text style={[
                        styles.pedidosTabText, 
                        { color: abaAtiva === 'historico' ? colors.verdeColheita : '#999' }
                    ]}>
                        HISTÓRICO
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 🟢 LISTAGEM DE PEDIDOS */}
            {loading ? (
                <ActivityIndicator size="large" color={colors.verdeColheita} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={pedidosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCardPedido}
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View style={styles.pedidosEmptyContainer}>
                            <Text style={{ fontSize: 50 }}>🛒</Text>
                            <Text style={{ color: '#999', marginTop: 10, fontSize: 16 }}>
                                Nenhum pedido nesta aba.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}