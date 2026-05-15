import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// 🕒 GERA O HORÁRIO DINÂMICO BASEADO NA DATA REAL DO PEDIDO NO BANCO
const gerarPrevisaoEntrega = (dataPedido: string) => {
    // 🟢 CORREÇÃO: Usa a data da criação do pedido para fixar o horário
    const dataBase = dataPedido ? new Date(dataPedido) : new Date();
    dataBase.setMinutes(dataBase.getMinutes() + 45); 

    const dia = String(dataBase.getDate()).padStart(2, '0');
    const mes = String(dataBase.getMonth() + 1).padStart(2, '0');
    const ano = String(dataBase.getFullYear()).slice(-2);

    const horas = String(dataBase.getHours()).padStart(2, '0');
    const minutos = String(dataBase.getMinutes()).padStart(2, '0');

    return `Hoje (${dia}/${mes}/${ano}), até as ${horas}:${minutos}`;
};

export default function Pedidos() {
    const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'historico'>('andamento');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pedidos, setPedidos] = useState<any[]>([]);

   const carregarPedidos = async () => {
        try {
            const response = await api.get(`/pedidos/usuario/7`);
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

    const pedidosFiltrados = pedidos.filter(p => {
        const status = p.status?.toLowerCase() || '';
        const isFinalizado = status === 'entregue' || status === 'cancelado';
        return abaAtiva === 'andamento' ? !isFinalizado : isFinalizado;
    });

    // 🟢 RENDERIZAÇÃO DO HISTÓRICO
    const renderHistorico = (item: any) => {
        const produtoObj = item.produto; 
        const isCancelado = item.status === 'cancelado';

        return (
            <View style={styles.cardHistorico}>
                <View style={styles.historicoHeaderCard}>
                    <Text style={styles.historicoDataText}>
                        {formatarDataCurta(item.data_pedido)} - Pedido #{String(item.id).padStart(4, '0')}
                    </Text>
                    <View style={[styles.historicoBadgeStatus, { backgroundColor: isCancelado ? '#FEE2E2' : '#D1FAE5' }]}>
                        <Ionicons 
                            name={isCancelado ? "close" : "checkmark"} 
                            size={16} 
                            color={isCancelado ? '#B91C1C' : '#065F46'} 
                        />
                    </View>
                </View>

                <View style={styles.historicoConteudo}>
                    <View style={styles.historicoImage}> 
                        {produtoObj?.imagem_url ? (
                            <Image 
                                source={{ uri: `${API_URL}${produtoObj.imagem_url}` }} 
                                style={{ width: '100%', height: '100%', borderRadius: 12 }} 
                            />
                        ) : (
                            <Ionicons name="leaf-outline" size={30} color="#9CA3AF" />
                        )}
                    </View>
                    
                    <View style={styles.historicoInfoText}>
                        <Text style={styles.historicoTituloProduto} numberOfLines={1}>
                            {item.quantidade}x {produtoObj?.nome_produto || 'Produto'}
                        </Text>
                        <Text style={styles.historicoFornecedor}>
                            {/* 🟢 Mostra o nome do produtor no histórico */}
                            Fornecedor: {produtoObj?.usuario?.nome || 'Produtor Local'}
                        </Text>
                        <Text style={styles.historicoTotal}>
                            Total: R$ {parseFloat(item.preco_total || 0).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </View>

                <View style={styles.historicoRowBotoes}>
                    <TouchableOpacity style={styles.btnHistoricoDetalhes}>
                        <Text style={{ color: colors.verdeColheita, fontWeight: 'bold' }}>Ver Detalhes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.btnHistoricoRefazer}>
                        <Ionicons name="refresh-outline" size={16} color="#FFF" style={{marginRight: 5}} />
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Refazer Pedido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // 🔵 RENDERIZAÇÃO DE ANDAMENTO
    const renderCardPedido = ({ item }: { item: any }) => {
        if (abaAtiva === 'historico') return renderHistorico(item);

        const produtoObj = item.produto;

        const statusAtual = item.status?.toLowerCase() || 'pendente';
        const isConfirmado = true;
        const isPreparacao = statusAtual.includes('prepara') || statusAtual.includes('rota') || statusAtual.includes('entregue');
        const isEmRota = statusAtual.includes('rota') || statusAtual.includes('entregue');
        const isEntregue = statusAtual.includes('entregue');

        const corVerdeFigma = '#2F5233';
        const corCinzaFigma = '#E5E7EB';

        let badgeText = "Confirmado";
        let badgeIcon = "checkmark-circle-outline";
        if (statusAtual.includes('prepara')) { badgeText = "Em Preparação"; badgeIcon = "cube-outline"; }
        if (statusAtual.includes('rota')) { badgeText = "Em Rota de Entrega"; badgeIcon = "bus-outline"; }
        if (statusAtual.includes('entregue')) { badgeText = "Entregue"; badgeIcon = "checkmark-done"; }

        return (
            <View style={styles.pedidoCardFigma}>
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

                <View style={styles.pedidoStepperContainer}>
                    {/* Stepper Steps */}
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

                <View style={styles.pedidoSecaoHeader}>
                    <Ionicons name="cart-outline" size={16} color="#4B5563" />
                    <Text style={styles.pedidoSecaoTitulo}>Itens do Pedido (1)</Text>
                </View>

                <View style={styles.pedidoListaItens}>
                    <View style={styles.pedidoItemRow}>
                        <View style={styles.pedidoItemIconContainer}>
                            {produtoObj?.imagem_url ? (
                                <Image
                                    source={{ uri: `${API_URL}${produtoObj.imagem_url}` }}
                                    style={styles.pedidoProdutoImagem}
                                />
                            ) : (
                                <Ionicons name="leaf-outline" size={24} color="#9CA3AF" />
                            )}
                        </View>

                        <View style={styles.pedidoItemInfoCenter}>
                            <Text style={styles.pedidoProdutoTitulo}>
                                {produtoObj?.nome_produto || "Produto"}
                            </Text>
                            <Text style={styles.pedidoProdutoSub}>
                                R$ {parseFloat(produtoObj?.preco || 0).toFixed(2).replace('.', ',')} / {produtoObj?.unidade || 'unid'}
                            </Text>
                        </View>

                        <View style={styles.pedidoItemInfoRight}>
                            <View style={styles.pedidoItemQtdBadge}>
                                <Text style={styles.pedidoItemQtdText}>
                                    {/* 🟢 CORREÇÃO: Unidade de medida dinâmica (Caixa, Kg, etc) */}
                                    {item.quantidade} {produtoObj?.unidade?.toLowerCase() || 'unid.'}
                                </Text>
                            </View>
                            <Text style={styles.pedidoItemTotalText}>
                                R$ {parseFloat(item.preco_total || 0).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.pedidoDivisor} />

                <View style={styles.pedidoSecaoHeader}>
                    <Ionicons name="storefront-outline" size={16} color="#4B5563" />
                    <Text style={styles.pedidoSecaoTitulo}>Fornecedor e Entrega</Text>
                </View>

                {(() => {
                    {/* 🟢 CORREÇÃO: Puxa o nome do Produtor (usuario) corretamente */}
                    const nomeProdutor = produtoObj?.usuario?.nome || 'Produtor Local';
                    const endereco = produtoObj?.endereco || item.comprador?.enderecos?.[0];
                    
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
                            <Text style={styles.pedidoEnderecoTextoSemIcone}>{cidade} - {estado}</Text>
                            <Text style={styles.pedidoEnderecoTextoSemIcone}>CEP: {cep}</Text>
                        </View>
                    );
                })()}

                <View style={styles.pedidoDivisor} />

                <View style={styles.pedidoPrevisaoContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons name="time-outline" size={16} color="#F59E0B" />
                        <Text style={[styles.pedidoPrevisaoLabel, { marginLeft: 6 }]}>Previsão de Entrega:</Text>
                    </View>
                    <Text style={styles.pedidoPrevisaoData}>
                        {/* 🟢 CORREÇÃO: Horário fixado na hora da compra */}
                        {gerarPrevisaoEntrega(item.data_pedido)}
                    </Text>
                </View>

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
            {/* 🟢 CORREÇÃO: O <StatusBar style="dark" /> foi removido para herdar os ícones brancos do App.tsx */}
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