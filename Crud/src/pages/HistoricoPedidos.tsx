import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../colors';
import styles from '../../styles';
import api, { API_URL } from '../api'; // 🟢 Importando API_URL para puxar a imagem

export default function HistoricoPedidos() {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const buscarPedidos = async () => {
            try {
                const userId = await AsyncStorage.getItem('user_id'); 
                
                if (!userId) {
                    console.log("Nenhum usuário logado encontrado no AsyncStorage.");
                    setCarregando(false);
                    return;
                }

                const response = await api.get(`/pedidos/usuario/${userId}`); 
                // 🟢 Ordena os pedidos para o mais recente aparecer primeiro
                const pedidosOrdenados = response.data.sort((a: any, b: any) => b.id - a.id);
                setPedidos(pedidosOrdenados);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setCarregando(false);
            }
        };
        
        buscarPedidos();
    }, []);

    // 🟢 Cores e Ícones dos Status baseados no seu design Premium
    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('pendente') || s.includes('prepar')) return { bg: '#FFF9C4', text: '#B78103', icon: 'time-outline' };
        if (s.includes('rota') || s.includes('caminho')) return { bg: '#E1F5FE', text: '#0277BD', icon: 'bicycle-outline' };
        if (s.includes('entregue') || s.includes('concluí')) return { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle-outline' };
        if (s.includes('cancel')) return { bg: '#FFE5E5', text: '#D32F2F', icon: 'close-circle-outline' };
        return { bg: '#F0F0F0', text: '#555', icon: 'help-circle-outline' }; 
    };

    const formatarData = (dataIso: string) => {
        if (!dataIso) return '';
        const data = new Date(dataIso);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA', width: '100%' }}>
            
            <View style={styles.historicoHeader}>
                <Text style={styles.historicoTitle}>Histórico de Pedidos</Text>
                <Text style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Acompanhe todos os seus pedidos</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {pedidos.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }}>
                        Você ainda não fez nenhum pedido no ColhaHoje.
                    </Text>
                ) : (
                    pedidos.map((pedido) => {
                        const statusVisual = getStatusStyle(pedido.status);
                        
                        const nomeDoProdutor = pedido.itens && pedido.itens.length > 0 && pedido.itens[0].produto?.produtor?.nome 
                            ? pedido.itens[0].produto.produtor.nome 
                            : 'Produtor Parceiro';

                        return (
                            <View key={pedido.id} style={styles.cardPedido}>
                                
                                {/* 🟢 HEADER DO CARD */}
                                <View style={styles.cardTopPedido}>
                                    <View style={styles.headerEsquerdaPedido}>
                                        <View style={styles.iconBoxPedido}>
                                            <Ionicons name="receipt-outline" size={20} color="#2E7D32" />
                                        </View>
                                        <View>
                                            <Text style={styles.pedidoTitle}>Pedido #{pedido.id}</Text>
                                            <Text style={styles.produtorNomePedido}>{nomeDoProdutor}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.totalTextoPedido}>
                                        R$ {parseFloat(pedido.total || 0).toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>

                                {/* 🟢 DATA E HORA */}
                                <Text style={styles.dataTextoPedido}>
                                    {formatarData(pedido.data_pedido)}
                                </Text>

                                {/* 🟢 CAIXA DE ITENS COM IMAGEM */}
                                <View style={styles.itensContainerPedido}>
                                    {pedido.itens?.map((item: any, index: number) => {
                                        // Busca a imagem, e se não tiver, coloca um placeholder
                                        const imgPath = item.produto?.imagem_url;
                                        const uriStr = typeof imgPath === 'string' && imgPath.trim() !== '' 
                                            ? `${API_URL}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`
                                            : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';

                                        return (
                                            <View key={index} style={[styles.itemRowPedido, index === pedido.itens.length - 1 ? { marginBottom: 0 } : {}]}>
                                                <Image source={{ uri: uriStr }} style={styles.itemImagePedido} />
                                                <Text style={styles.itemTextPedido} numberOfLines={1}>
                                                    {item.quantidade}x {item.produto?.nome_produto || 'Produto'}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                {/* 🟢 RODAPÉ DO CARD (STATUS E BOTÃO) */}
                                <View style={styles.footerPedido}>
                                    <View style={[styles.badgeStatusPedido, { backgroundColor: statusVisual.bg }]}>
                                        <Ionicons name={statusVisual.icon as any} size={16} color={statusVisual.text} />
                                        <Text style={[styles.badgeTextoPedido, { color: statusVisual.text }]}>
                                            {pedido.status || 'Aguardando'}
                                        </Text>
                                    </View>

                                    {/* Esconde o botão se estiver cancelado */}
                                    {!pedido.status?.toLowerCase().includes('cancel') && (
                                        <TouchableOpacity style={styles.btnAcompanharPedido}>
                                            <Ionicons name="bus-outline" size={16} color="#FFF" />
                                            <Text style={styles.btnAcompanharTextoPedido}>Acompanhar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}