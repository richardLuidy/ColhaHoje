import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import api, { API_URL } from '../api';
import { useCart } from '../context/CartContext';

// 🕒 FUNÇÃO INTELIGENTE: Transforma "420" em "7h 00min"
const formatarTempo = (totalMinutos: number) => {
    if (!totalMinutos) return '0 min';
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    if (horas > 0) {
        return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
    }
    return `${minutos} min`;
};

export default function Inicio({ onVerDetalhes }: { onVerDetalhes: (produto: any) => void }) {
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
            const [resProdutos, resTodasOfertas, resOferta] = await Promise.all([
                api.get('/produtos'),
                api.get('/ofertas'),
                api.get('/ofertas/destaque')
            ]);

            setProdutos(resProdutos.data);
            setTodasAsOfertas(resTodasOfertas.data);
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

    // 🟢 LÓGICA DO CRONÔMETRO DE DESTAQUE
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
                    // Usa a nova formatação inteligente
                    setTempoRestante(`${h > 0 ? h + 'h ' : ''}${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
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

    const produtosVisiveis = produtos.filter(produto => {
        const ofertaDeste = todasAsOfertas.find(o => o.produto_id === produto.id);
        if (ofertaDeste) {
            const limite = new Date(ofertaDeste.criado_em).getTime() + (ofertaDeste.duracao_minutos * 60 * 1000);
            if (limite <= agora) return false;
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

            {/* 🔴 BANNER OFERTA DESTAQUE */}
            {ofertaDestaque && tempoRestante !== "Expirado" && (
                <TouchableOpacity 
                    style={styles.bannerDestaqueSério}
                    activeOpacity={0.9}
                    onPress={() => onVerDetalhes({ ...ofertaDestaque.produto, preco: ofertaDestaque.preco_promocional })}
                >
                    {/* LADO ESQUERDO: INFORMAÇÕES */}
                    <View style={styles.bannerEsquerdaSério}>
                        
                        <View>
                            <View style={styles.badgeRelampagoSério}>
                                <Ionicons name="flash" size={10} color="#FFF" />
                                <Text style={styles.badgeTextBrancoSério}>OFERTA RELÂMPAGO</Text>
                            </View>
                            <View style={[styles.badgeTimerSério, { alignSelf: 'flex-start' }]}>
                                <Ionicons name="time-outline" size={10} color="#FFF" />
                                <Text style={styles.badgeTextBrancoSério}>{tempoRestante}</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 8 }}>
                            <Text style={{ color: '#1A1A1A', fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>
                                {ofertaDestaque.produto.nome_produto}
                            </Text>
                            <Text style={{ color: '#999', fontSize: 12, textDecorationLine: 'line-through' }}>
                                De R$ {parseFloat(ofertaDestaque.preco_original).toFixed(2).replace('.', ',')}
                            </Text>
                            <Text style={{ color: '#2E7D32', fontSize: 24, fontWeight: '900', marginTop: -2 }}>
                                R$ {parseFloat(ofertaDestaque.preco_promocional).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>

                        <View style={{ marginTop: 5 }}>
                            <View style={{ backgroundColor: '#FFF5E6', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 5 }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#B78103' }}>
                                    Estoque: {ofertaDestaque.produto.quantidade_estoque || ofertaDestaque.produto.quantidade} {ofertaDestaque.produto.unidade_medida || 'unid.'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.bannerBotaoAdicionarSério}
                                onPress={() => adicionarAoCarrinho({ ...ofertaDestaque.produto, preco: ofertaDestaque.preco_promocional })}
                            >
                                <Ionicons name="cart-outline" size={16} color="#FFF" />
                                <Text style={[styles.badgeTextBrancoSério, {fontSize: 13, marginLeft: 6}]}>Adicionar</Text>
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
                </TouchableOpacity>
            )}

            <View style={{ width: '100%', marginTop: 10 }}>
                <Text style={styles.tituloSecaoSério}>Ofertas Fresquinhas</Text>

                <View style={styles.gridProdutosSério}>
                    {produtosVisiveis.map((produto: any) => (
                        <TouchableOpacity 
                            key={produto.id} 
                            style={styles.cardProdutoSério}
                            activeOpacity={0.9}
                            onPress={() => onVerDetalhes(produto)}
                        >
                            <View style={styles.cardCatalogueImageContainerSério}>
                                {produto.imagem_url ? (
                                    <Image source={{ uri: `${API_URL}${produto.imagem_url}` }} style={styles.cardCatalogueImageSério} />
                                ) : (
                                    <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                                )}
                                
                                <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FBC02D' }}>
                                        {produto.quantidade_estoque || produto.quantidade} {produto.unidade_medida || 'unid.'}
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
                        </TouchableOpacity>
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