import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import api, { API_URL } from '../api';

const formatarDataCurta = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data não disponível';
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    
    return `${dia}/${mes}/${ano}`;
};

export default function Pedidos() {
    const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'historico'>('andamento');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pedidos, setPedidos] = useState<any[]>([]);

    const carregarPedidos = async () => {
        try {
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
        const primeiroItem = item.itens && item.itens.length > 0 ? item.itens[0] : null;
        const maisItens = item.itens?.length > 1 ? ` + ${item.itens.length - 1} itens` : '';

        const statusAtual = item.status || 'pendente'; 
        const isConfirmado = true; 
        const isPreparacao = ['preparacao', 'em_rota', 'entregue'].includes(statusAtual);
        const isEmRota = ['em_rota', 'entregue'].includes(statusAtual);
        const isEntregue = statusAtual === 'entregue';

        const corVerdeFigma = '#2F5233';
        const corCinzaFigma = '#E5E7EB';

        let badgeText = "Confirmado";
        let badgeIcon = "checkmark-circle-outline";
        if (statusAtual === 'preparacao') { badgeText = "Em Preparação"; badgeIcon = "cube-outline"; }
        if (statusAtual === 'em_rota') { badgeText = "Em Rota de Entrega"; badgeIcon = "bus-outline"; }
        if (statusAtual === 'entregue') { badgeText = "Entregue"; badgeIcon = "checkmark-done"; }

        return (
            <View style={styles.pedidoCardFigma}>
                
                {/* HEADER */}
                <View style={styles.pedidoHeader}>
                    <Text style={styles.pedidoIdText}>
                        Pedido #{String(item.id).padStart(4, '0')}
                    </Text>
                    
                    <View style={[styles.pedidoBadgeStatus, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name={badgeIcon as any} size={14} color={corVerdeFigma} />
                        <Text style={[styles.pedidoBadgeText, { color: corVerdeFigma }]}>
                            {badgeText}
                        </Text>
                    </View>
                </View>

                {/* STEPPER DA LINHA DO TEMPO */}
                <View style={styles.pedidoStepperContainer}>
                    <View style={styles.pedidoStep}>
                        <View style={[styles.pedidoStepCircle, { backgroundColor: isConfirmado ? corVerdeFigma : corCinzaFigma }]}>
                            <Ionicons name="checkmark" size={14} color="#FFF" />
                        </View>
                        <Text style={[styles.pedidoStepLabel, { color: isConfirmado ? corVerdeFigma : '#9CA3AF', fontWeight: isConfirmado ? '600' : 'normal' }]}>Confirmado</Text>
                    </View>

                    <View style={[styles.pedidoStepLine, { backgroundColor: isPreparacao ? corVerdeFigma : corCinzaFigma }]} />

                    <View style={styles.pedidoStep}>
                        <View style={[styles.pedidoStepCircle, { backgroundColor: isPreparacao ? corVerdeFigma : corCinzaFigma }]}>
                            <Ionicons name="checkmark" size={14} color="#FFF" />
                        </View>
                        <Text style={[styles.pedidoStepLabel, { color: isPreparacao ? corVerdeFigma : '#9CA3AF', fontWeight: isPreparacao ? '600' : 'normal' }]}>Preparação</Text>
                    </View>

                    <View style={[styles.pedidoStepLine, { backgroundColor: isEmRota ? corVerdeFigma : corCinzaFigma }]} />

                    <View style={styles.pedidoStep}>
                        <View style={[styles.pedidoStepCircle, { backgroundColor: isEmRota ? corVerdeFigma : corCinzaFigma }]}>
                            <Ionicons name="bus-outline" size={14} color="#FFF" />
                        </View>
                        <Text style={[styles.pedidoStepLabel, { color: isEmRota ? corVerdeFigma : '#9CA3AF', fontWeight: isEmRota ? '600' : 'normal' }]}>Em Rota</Text>
                    </View>

                    <View style={[styles.pedidoStepLine, { backgroundColor: isEntregue ? corVerdeFigma : corCinzaFigma }]} />

                    <View style={styles.pedidoStep}>
                        <View style={[styles.pedidoStepCircle, { backgroundColor: isEntregue ? corVerdeFigma : corCinzaFigma }]}>
                            {isEntregue && <Ionicons name="checkmark-done" size={14} color="#FFF" />}
                        </View>
                        <Text style={[styles.pedidoStepLabel, { color: isEntregue ? corVerdeFigma : '#9CA3AF', fontWeight: isEntregue ? '600' : 'normal' }]}>Entregue</Text>
                    </View>
                </View>

                <View style={styles.pedidoDivisor} />

                {/* INFO DO PRODUTO */}
                <View style={styles.pedidoProdutoContainer}>
                    <View style={styles.pedidoIconContainer}>
                        {primeiroItem?.produto?.imagem_url ? (
                            <Image 
                                source={{ uri: `${API_URL}${primeiroItem.produto.imagem_url}` }} 
                                style={styles.pedidoProdutoImagem}
                            />
                        ) : (
                            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                        )}
                    </View>
                    
                    <View style={styles.pedidoInfoContainer}>
                        <Text style={styles.pedidoProdutoTitulo}>
                            {primeiroItem ? primeiroItem.produto.nome_produto : "Produto"}{maisItens}
                        </Text>
                        <Text style={styles.pedidoProdutoSub}>
                            Fornecedor: {primeiroItem?.produto?.produtor?.nome || 'Sítio X'} (Registro, SP)
                        </Text>
                    </View>
                </View>

                {/* PREVISÃO DE ENTREGA */}
                <View style={styles.pedidoPrevisaoContainer}>
                    <Text style={styles.pedidoPrevisaoLabel}>Previsão de Entrega:</Text>
                    <Text style={styles.pedidoPrevisaoData}>
                        Hoje ({formatarDataCurta(item.data_pedido)}), até as 17:03
                    </Text>
                </View>

                {/* BOTÕES DE AÇÃO */}
                <View style={styles.pedidoBotoesContainer}>
                    <TouchableOpacity style={styles.pedidoBtnRastrear}>
                        <Ionicons name="location-outline" size={16} color="#FFF" />
                        <Text style={styles.pedidoBtnRastrearTexto}>Rastrear no Mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pedidoBtnFalar}>
                        <Ionicons name="logo-whatsapp" size={16} color="#4B5563" />
                        <Text style={styles.pedidoBtnFalarTexto}>Falar com Produtor</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <StatusBar style="dark" />

            <View style={styles.pedidosTabContainer}>
                <TouchableOpacity 
                    onPress={() => setAbaAtiva('andamento')}
                    style={[styles.pedidosTabButton, abaAtiva === 'andamento' && styles.pedidosTabActive]}
                >
                    <Text style={[styles.pedidosTabText, { color: abaAtiva === 'andamento' ? colors.verdeColheita : '#999' }]}>
                        PEDIDOS EM ANDAMENTO
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setAbaAtiva('historico')}
                    style={[styles.pedidosTabButton, abaAtiva === 'historico' && styles.pedidosTabActiveIndicator]}
                >
                    <Text style={[styles.pedidosTabText, { color: abaAtiva === 'historico' ? colors.verdeColheita : '#999' }]}>
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