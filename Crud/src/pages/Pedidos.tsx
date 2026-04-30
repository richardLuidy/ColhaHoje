import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import api, { API_URL } from '../api';

export default function Pedidos() {
    const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'historico'>('andamento');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pedidos, setPedidos] = useState<any[]>([]);

    const carregarPedidos = async () => {
        try {
            // Simulando busca para o usuário logado
            const response = await api.get('/pedidos/usuario/1');
            setPedidos(response.data);
        } catch (error) {
            console.log("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        carregarPedidos();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarPedidos();
    }, []);

    const pedidosFiltrados = pedidos.filter(p => 
        abaAtiva === 'andamento' 
            ? ['pendente', 'preparacao', 'em_rota'].includes(p.status) 
            : ['entregue', 'cancelado'].includes(p.status)
    );

    const renderCardPedido = ({ item }: { item: any }) => {
        const isHistorico = abaAtiva === 'historico';
        const primeiroItem = item.itens && item.itens.length > 0 ? item.itens[0] : null;

        return (
            /* 🟢 CORRIGIDO: Usando 'pedidoCard' do seu CSS */
            <View style={styles.pedidoCard}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>
                            Pedido #{item.id} • {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* 🟢 CORRIGIDO: Usando 'pedidoIconContainer' do seu CSS */}
                        <View style={styles.pedidoIconContainer}>
                            {primeiroItem ? (
                                <Image 
                                    source={{ uri: `${API_URL}${primeiroItem.produto.imagem_url}` }} 
                                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                />
                            ) : (
                                <Text style={{ fontSize: 24 }}>📦</Text>
                            )}
                        </View>
                        
                        {/* 🟢 CORRIGIDO: Usando 'pedidoInfoContainer' do seu CSS */}
                        <View style={styles.pedidoInfoContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}>
                                {primeiroItem ? primeiroItem.produto.nome_produto : "Pedido ColhaHoje"}
                            </Text>
                            <Text style={{ color: colors.verdeColheita, fontWeight: 'bold', marginTop: 4 }}>
                                R$ {parseFloat(item.total).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>

                        {/* 🟢 CORRIGIDO: Usando 'pedidoStatusBadge' do seu CSS */}
                        <View style={[
                            styles.pedidoStatusBadge, 
                            { backgroundColor: item.status === 'entregue' ? '#E8F5E9' : '#FFF3E0' }
                        ]}>
                            <Text style={[
                                styles.pedidoStatusText, 
                                { color: item.status === 'entregue' ? colors.verdeColheita : '#E65100' }
                            ]}>
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <StatusBar style="dark" />

            {/* 🟢 CABEÇALHO COM ABAS (Sincronizado com seu CSS) */}
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

            {loading ? (
                <ActivityIndicator size="large" color={colors.verdeColheita} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={pedidosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCardPedido}
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.verdeColheita]} />}
                    ListEmptyComponent={
                        <View style={styles.pedidosEmptyContainer}>
                            <Ionicons name="cart-outline" size={80} color="#CCC" />
                            <Text style={{ color: '#999', marginTop: 10, fontSize: 16 }}>Nenhum pedido nesta aba.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}