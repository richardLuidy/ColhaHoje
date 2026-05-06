import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';

import api, { API_URL } from '../api';
import { useCart } from '../context/CartContext';

export default function Ofertas() {
    const { adicionarAoCarrinho } = useCart();
    
    const [ofertas, setOfertas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [agora, setAgora] = useState(new Date().getTime());

    // 🟢 BUSCA AS OFERTAS E PEGA AS FOTOS EMPRESTADAS DOS PRODUTOS
    const buscarOfertasDoBanco = async () => {
        try {
            // Busca as ofertas e os produtos ao mesmo tempo
            const resOfertas = await api.get('/ofertas');
            const resProdutos = await api.get('/produtos');

            // Truque Ninja: Junta a foto do produto na oferta
            const ofertasCompletas = resOfertas.data.map((oferta: any) => {
                const produtoReferencia = resProdutos.data.find((p: any) => p.id === oferta.produto_id);
                
                if (produtoReferencia && produtoReferencia.imagem_url) {
                    if (!oferta.produto) oferta.produto = {};
                    oferta.produto.imagem_url = produtoReferencia.imagem_url;
                }
                return oferta;
            });

            setOfertas(ofertasCompletas);
            setAgora(new Date().getTime());
        } catch (error) {
            console.error("Erro ao carregar ofertas:", error);
        }
    };

    useEffect(() => {
        buscarOfertasDoBanco().finally(() => setCarregando(false));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        buscarOfertasDoBanco().finally(() => setRefreshing(false));
    }, []);

    // 🟢 ATUALIZA O CRONÔMETRO A CADA SEGUNDO
    useEffect(() => {
        const interval = setInterval(() => {
            setAgora(new Date().getTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (carregando) {
        return (
            <View style={styles.centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <View style={styles.containerOfertas}>
            
            <Text style={[styles.tituloSecaoSério, { marginLeft: 15, marginTop: 40 }]}>
                Ofertas Fresquinhas
            </Text>

            {/* FILTROS */}
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollFiltrosOfertas}>
                    <TouchableOpacity style={[styles.pilulaFiltroSério, { backgroundColor: colors.verdeColheita }]}>
                        <Text style={[styles.pilulaFiltroTexto, { color: '#FFF' }]}>Todas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pilulaFiltroSério}>
                        <Text style={styles.pilulaFiltroTexto}>Acabando Logo ⏱️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pilulaFiltroSério}>
                        <Text style={styles.pilulaFiltroTexto}>Maior Desconto %</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.verdeColheita]} />}
            >
                {ofertas.map((item: any) => {
                    // Lógica de tempo para cada card
                    const criacao = new Date(item.criado_em).getTime();
                    const limite = criacao + (item.duracao_minutos * 60 * 1000);
                    const distancia = limite - agora;
                    
                    if (distancia < 0) return null; // Não mostra se expirou

                    const h = Math.floor(distancia / (1000 * 60 * 60)).toString().padStart(2, '0');
                    const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                    const s = Math.floor((distancia % (1000 * 60)) / 1000).toString().padStart(2, '0');

                    return (
                        <View key={item.id} style={styles.cardHorizontalOferta}>
                            
                            {/* ESQUERDA: IMAGEM FIXA */}
                            <View style={{ width: 130, height: '100%', backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
                                
                                {item.produto && item.produto.imagem_url ? (
                                    <Image 
                                        source={{ uri: `${API_URL}${item.produto.imagem_url.replace(/^\//, '')}` }} 
                                        style={{ width: '100%', height: '100%' }} 
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                                )}

                                <View style={styles.badgeDescontoHorizontal}>
                                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>-50%</Text>
                                </View>
                            </View>

                            {/* DIREITA: INFO DO BANCO */}
                            <View style={styles.infoCardHorizontalOferta}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.cinzaTecnico }} numberOfLines={1}>
                                    {item.produto?.nome_produto || "Produto em Oferta"}
                                </Text>

                                <View>
                                    <Text style={{ fontSize: 12, color: colors.placeholder, textDecorationLine: 'line-through' }}>
                                        R$ {parseFloat(item.preco_original).toFixed(2).replace('.', ',')}
                                    </Text>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.verdeColheita }}>
                                        R$ {parseFloat(item.preco_promocional).toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="time-outline" size={14} color={colors.cinzaTecnico} />
                                    <Text style={{ fontSize: 11, color: colors.cinzaTecnico, marginLeft: 4 }}>
                                        {h}:{m}:{s} restantes
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors.laranjaAlerta }}>
                                        Restam {item.produto?.quantidade_estoque || item.produto?.quantidade || 0} unid!
                                    </Text>
                                    
                                    <TouchableOpacity 
                                        style={styles.botaoAdicionarPequeno}
                                        onPress={() => adicionarAoCarrinho({ ...item.produto, preco: item.preco_promocional })}
                                    >
                                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })}

                {ofertas.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 50, color: colors.placeholder }}>
                        Nenhuma oferta disponível no momento.
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}