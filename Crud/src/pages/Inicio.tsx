import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, ImageBackground, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';

import api, { API_URL } from '../api';

// 🟢 ACESSANDO O CONTEXTO DA SACOLA
import { useCart } from '../context/CartContext';

export default function Inicio() {
    const { adicionarAoCarrinho } = useCart();

    const [tempoRestante, setTempoRestante] = useState("");
    const [produtos, setProdutos] = useState<any[]>([]);
    const [todasAsOfertas, setTodasAsOfertas] = useState<any[]>([]);
    const [ofertaDestaque, setOfertaDestaque] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [agora, setAgora] = useState(new Date().getTime());

    const buscarDadosFresquinhos = async () => {
        try {
            const resProdutos = await api.get('/produtos');
            setProdutos(resProdutos.data);

            const resTodasOfertas = await api.get('/ofertas');
            setTodasAsOfertas(resTodasOfertas.data);

            const resOferta = await api.get('/ofertas/destaque');
            setOfertaDestaque(resOferta.data || null);
            
            setAgora(new Date().getTime());
        } catch (error) {
            console.error("Erro ao carregar a tela Início:", error);
        }
    };

    useEffect(() => {
        buscarDadosFresquinhos().finally(() => setCarregando(false));
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        buscarDadosFresquinhos().finally(() => setRefreshing(false));
    }, []);

    // 🟢 LÓGICA DO CRONÔMETRO
    useEffect(() => {
        const interval = setInterval(() => {
            const timeAgora = new Date().getTime();
            setAgora(timeAgora);

            if (ofertaDestaque) {
                const criacao = new Date(ofertaDestaque.criado_em).getTime();
                const duracaoMs = ofertaDestaque.duracao_minutos * 60 * 1000;
                const limite = criacao + duracaoMs;
                const distancia = limite - timeAgora;

                if (distancia < 0) {
                    setTempoRestante("Expirado");
                } else {
                    const h = Math.floor(distancia / (1000 * 60 * 60));
                    const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((distancia % (1000 * 60)) / 1000);
                    setTempoRestante(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [ofertaDestaque]);

    if (carregando) {
        return (
            <View style={styles.centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    // 🧠 FILTRO DE PRODUTOS E OFERTAS
    const produtosVisiveis = produtos.filter(produto => {
        const ofertaDeste = todasAsOfertas.find(o => o.produto_id === produto.id);
        if (ofertaDeste) {
            const limite = new Date(ofertaDeste.criado_em).getTime() + (ofertaDeste.duracao_minutos * 60 * 1000);
            const expirou = limite <= agora;
            if (expirou) return false;
        }
        if (produto.id === ofertaDestaque?.produto_id && tempoRestante !== "Expirado") return false;
        return true;
    });

    return (
        <ScrollView
            style={styles.containerHomeSério}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerHomeSério}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.verdeColheita]} />}
        >

          {/* 🔴 BANNER OFERTA DESTAQUE - ATUALIZADO */}
            {ofertaDestaque && tempoRestante !== "Expirado" && (
                <View style={styles.bannerDestaqueSério}>
                    
                    {/* LADO ESQUERDO: INFORMAÇÕES */}
                    <View style={styles.bannerEsquerdaSério}>
                        
                        {/* 1. Etiquetas de Tempo */}
                        <View>
                            <View style={styles.bannerBadgesRowSério}>
                                <View style={styles.badgeRelampagoSério}>
                                    <Ionicons name="flash" size={12} color="#FFF" />
                                    <Text style={styles.badgeTextBrancoSério}>OFERTA RELÂMPAGO</Text>
                                </View>
                            </View>
                            <View style={[styles.badgeTimerSério, { alignSelf: 'flex-start', marginTop: 6 }]}>
                                <Ionicons name="time-outline" size={12} color="#FFF" />
                                <Text style={styles.badgeTextBrancoSério}>{tempoRestante}</Text>
                            </View>
                        </View>

                        {/* 2. Nome e Preços */}
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ color: '#1A1A1A', fontSize: 20, fontWeight: 'bold' }} numberOfLines={1}>
                                {ofertaDestaque.produto.nome_produto}
                            </Text>
                            <Text style={{ color: '#999', fontSize: 13, textDecorationLine: 'line-through' }}>
                                De R$ {parseFloat(ofertaDestaque.preco_original).toFixed(2).replace('.', ',')}
                            </Text>
                            <Text style={styles.bannerPorApenasSério}>Por apenas</Text>
                            <Text style={{ color: '#2E7D32', fontSize: 26, fontWeight: 'bold' }}>
                                R$ {parseFloat(ofertaDestaque.preco_promocional).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>

                        {/* 3. Estoque e Ação */}
                        <View>
                            <View style={{ backgroundColor: '#FFF9C4', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 5 }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FBC02D' }}>
                                   📦 {ofertaDestaque.produto.quantidade_estoque || ofertaDestaque.produto.quantidade} unidades
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.bannerBotaoAdicionarSério}
                                onPress={() => adicionarAoCarrinho({ ...ofertaDestaque.produto, preco: ofertaDestaque.preco_promocional })}
                            >
                                <Ionicons name="add" size={20} color="#FFF" />
                                <Text style={[styles.badgeTextBrancoSério, {fontSize: 15}]}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* LADO DIREITO: IMAGEM */}
                    <View style={styles.bannerDireitaSério}>
                        <Image 
                            source={{ uri: `${API_URL}${ofertaDestaque.produto.imagem_url}` }} 
                            style={styles.bannerImageSério}
                        />
                    </View>
                </View>
            )}

            <View style={{ width: '100%', paddingHorizontal: 12, marginTop: 20 }}>
                <Text style={[styles.tituloSecaoSério, { marginLeft: 8 }]}>Ofertas Fresquinhas</Text>

                <View style={styles.gridProdutosSério}>
                    {produtosVisiveis.map((produto: any) => (
                        <View key={produto.id} style={styles.cardProdutoSério}>
                            <View style={styles.cardCatalogueImageContainerSério}>
                                {produto.imagem_url ? (
                                    <Image source={{ uri: `${API_URL}${produto.imagem_url}` }} style={styles.cardCatalogueImageSério} />
                                ) : (
                                    <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                                )}

                                {/* 🟡 BADGE DE ESTOQUE NO CARD */}
                                <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FBC02D' }}>
                                        {produto.quantidade_estoque || produto.quantidade} unid.
                                    </Text>
                                </View>

                                <View style={styles.badgeOrganicoSério}>
                                    <Text style={styles.badgeOrganicoTextSério}>{produto.categoria || "Produto"}</Text>
                                </View>
                            </View>

                            <View style={styles.cardCatalogueInfoSério}>
                                <Text style={styles.cardCatalogueNameSério} numberOfLines={1}>{produto.nome_produto}</Text>
                                <Text style={styles.cardCatalogueVendorSério} numberOfLines={1}>{produto.nome_produtor}</Text>
                                <View style={styles.cardCataloguePriceRowSério}>
                                    <Text style={styles.cardCataloguePriceSério}>
                                        R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                                    </Text>
                                    
                                    <TouchableOpacity 
                                        style={styles.btnAddCardNewSério}
                                        onPress={() => adicionarAoCarrinho(produto)}
                                    >
                                        <Ionicons name="add" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {produtosVisiveis.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 40, color: colors.placeholder }}>
                        Nenhum produto disponível no momento.
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}