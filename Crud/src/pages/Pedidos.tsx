import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import api, { API_URL } from '../api';

// 🕒 FUNÇÃO PARA FORMATAR A DATA NO TOPO DO CARD
const formatarDataCurta = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data não disponível';

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);

    return `${dia}/${mes}/${ano}`;
};

// 🕒 GERA O HORÁRIO DINÂMICO DE ENTREGA (Hora atual + 45 min)
const gerarPrevisaoEntrega = (dataPedido: string) => {
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + 45);

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = String(agora.getFullYear()).slice(-2);

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    return `Hoje (${dia}/${mes}/${ano}), até as ${horas}:${minutos}`;
};

export default function Pedidos() {
    const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'historico'>('andamento');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pedidos, setPedidos] = useState<any[]>([]);

    const carregarPedidos = async () => {
        try {
            // Buscando os pedidos do usuário Richard (ID 1)
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

                {/* HEADER - ID E STATUS */}
                <View style={styles.pedidoHeader}>
                    <Text style={styles.pedidoIdText}>
                        Pedido #{String(item.id).padStart(4, '0')}
                    </Text>

                    <View style={[styles.pedidoBadgeStatus, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name={badgeIcon as any} size={14} color={corVerdeFigma} />
                        <Text style={[styles.badgeText, { color: corVerdeFigma }]}>
                            {badgeText}
                        </Text>
                    </View>
                </View>

                {/* STEPPER - LINHA DO TEMPO */}
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

                {/* 🛒 LISTA DE TODOS OS ITENS COMPRADOS */}
                <View style={styles.pedidoSecaoHeader}>
                    <Ionicons name="cart-outline" size={16} color="#4B5563" />
                    <Text style={styles.pedidoSecaoTitulo}>Itens do Pedido ({item.itens?.length || 0})</Text>
                </View>

                <View style={styles.pedidoListaItens}>
                    {item.itens?.map((subItem: any, index: number) => (
                        <View key={index} style={styles.pedidoItemRow}>
                            <View style={styles.pedidoItemIconContainer}>
                                {subItem.produto?.imagem_url ? (
                                    <Image
                                        source={{ uri: `${API_URL}${subItem.produto.imagem_url}` }}
                                        style={styles.pedidoProdutoImagem}
                                    />
                                ) : (
                                    <Ionicons name="leaf-outline" size={24} color="#9CA3AF" />
                                )}
                            </View>

                            <View style={styles.pedidoItemInfoCenter}>
                                <Text style={styles.pedidoProdutoTitulo}>
                                    {subItem.produto?.nome_produto || "Produto"}
                                </Text>
                                <Text style={styles.pedidoProdutoSub}>
                                    R$ {parseFloat(subItem.preco_unit).toFixed(2).replace('.', ',')} / {subItem.produto?.unidade || 'unid'}
                                </Text>
                            </View>

                            <View style={styles.pedidoItemInfoRight}>
                                <View style={styles.pedidoItemQtdBadge}>
                                    <Text style={styles.pedidoItemQtdText}>
                                        {subItem.quantidade} {subItem.produto?.unidade === 'Kg' ? 'kg' : 'unid.'}
                                    </Text>
                                </View>
                                <Text style={styles.pedidoItemTotalText}>
                                    R$ {(subItem.quantidade * subItem.preco_unit).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.pedidoDivisor} />

                {/* 📍 INFO DO FORNECEDOR E ENDEREÇO */}
                <View style={styles.pedidoSecaoHeader}>
                    <Ionicons name="storefront-outline" size={16} color="#4B5563" />
                    <Text style={styles.pedidoSecaoTitulo}>Fornecedor e Entrega</Text>
                </View>

                {(() => {
                    // 🧠 EXTRAINDO OS DADOS REAIS QUE VIERAM DO BANCO (PRISMA)
                    const nomeProdutor = primeiroItem?.produto?.produtor?.nome || 'Produtor Local';

                    // Aqui definimos qual endereço mostrar. 
                    // Tenta pegar o endereço vinculado ao produto, se não tiver, pega o endereço do cliente (Bamburral)
                    const endereco = primeiroItem?.produto?.endereco || item.cliente?.enderecos?.[0];

                    const rua = endereco?.rua || 'Endereço não cadastrado';
                    const numero = endereco?.numero ? `, ${endereco.numero}` : '';
                    const bairro = endereco?.bairro ? `- ${endereco.bairro}` : '';
                    const cidade = endereco?.cidade || 'Registro';
                    const estado = endereco?.estado || 'SP';
                    const cep = endereco?.cep || '00000-000';

                    return (
                        <View style={styles.pedidoFornecedorContainer}>
                            <Text style={styles.pedidoFornecedorLabel}>
                                Produtor: <Text style={styles.pedidoFornecedorNome}>{nomeProdutor}</Text>
                            </Text>

                            <View style={styles.pedidoEnderecoLinha}>
                                <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
                                <Text style={styles.pedidoEnderecoTexto}>
                                    {rua}{numero} {bairro}
                                </Text>
                            </View>
                            <Text style={styles.pedidoEnderecoTextoSemIcone}>
                                {cidade} - {estado}
                            </Text>
                            <Text style={styles.pedidoEnderecoTextoSemIcone}>
                                CEP: {cep}
                            </Text>
                        </View>
                    );
                })()}

                <View style={styles.pedidoDivisor} />

                {/* 🕒 PREVISÃO DE ENTREGA DINÂMICA */}
                <View style={styles.pedidoPrevisaoContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons name="time-outline" size={16} color="#F59E0B" />
                        <Text style={[styles.pedidoPrevisaoLabel, { marginLeft: 6 }]}>Previsão de Entrega:</Text>
                    </View>
                    <Text style={styles.pedidoPrevisaoData}>
                        {gerarPrevisaoEntrega(item.data_pedido)}
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

            {/* ABAS DE NAVEGAÇÃO */}
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