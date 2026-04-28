import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, ImageBackground, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';

// 🟢 Importando nossa API centralizada
import api, { API_URL } from '../api';

export default function Inicio() {
    const [tempoRestante, setTempoRestante] = useState("");
    const [produtos, setProdutos] = useState<any[]>([]);
    const [ofertaDestaque, setOfertaDestaque] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // 🟢 Para a bolinha de atualizar

    // 🟢 FUNÇÃO QUE BUSCA OS DADOS (SEM O HOOK QUE CAUSA ERRO)
    const buscarDadosFresquinhos = async () => {
        try {
            const resProdutos = await api.get('/produtos');
            setProdutos(resProdutos.data);

            const resOferta = await api.get('/ofertas/destaque');
            setOfertaDestaque(resOferta.data || null);
        } catch (error) {
            console.error("Erro ao carregar a tela Início:", error);
        }
    };

    // Roda a primeira vez que a tela abre
    useEffect(() => {
        buscarDadosFresquinhos().finally(() => setCarregando(false));
    }, []);

    // Roda quando você puxa a tela para baixo
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        buscarDadosFresquinhos().finally(() => setRefreshing(false));
    }, []);

    // 🟢 LÓGICA DO RELÓGIO EM TEMPO REAL
    useEffect(() => {
        if (!ofertaDestaque) return;

        const interval = setInterval(() => {
            const agora = new Date().getTime();
            const criacao = new Date(ofertaDestaque.criado_em).getTime();
            const duracaoMs = ofertaDestaque.duracao_minutos * 60 * 1000;
            const limite = criacao + duracaoMs;
            const distancia = limite - agora;

            if (distancia < 0) {
                setTempoRestante("Expirado");
                clearInterval(interval);
            } else {
                const h = Math.floor(distancia / (1000 * 60 * 60));
                const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distancia % (1000 * 60)) / 1000);

                setTempoRestante(
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                );
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

    const imagemDestaque = ofertaDestaque?.produto.imagem_url
        ? { uri: `${API_URL}${ofertaDestaque.produto.imagem_url}` }
        : { uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&h=400' };

    return (
        <ScrollView
            style={styles.containerHomeSério}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerHomeSério}
            // 🟢 Puxar para atualizar ativado!
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.verdeColheita]} />}
        >

            {/* 🔴 BANNER DE OFERTA RELÂMPAGO */}
            {ofertaDestaque && ofertaDestaque.produto && (
                <View style={styles.bannerDestaqueSério}>
                    <ImageBackground
                        source={imagemDestaque}
                        style={styles.bannerImageBackgroundSério}
                        resizeMode="cover"
                    >
                        <View style={styles.bannerTopOverlaySério}>
                            <Text style={styles.bannerTitleOverSério}>OFERTA RELÂMPAGO!</Text>

                            <View style={styles.bannerTimerBlockSério}>
                                <Text style={styles.bannerTimerTextSério}>{tempoRestante}</Text>
                            </View>
                        </View>

                        <View style={styles.bannerBottomInfoOverlaySério}>
                            <Text style={styles.bannerBottomNameSério}>{ofertaDestaque.produto.nome_produto}</Text>
                            <View style={styles.bannerBottomPricesSério}>
                                <Text style={styles.bannerBottomPriceRiscadoSério}>
                                    R$ {parseFloat(ofertaDestaque.preco_original).toFixed(2).replace('.', ',')}
                                </Text>
                                <Text style={styles.bannerBottomPriceNovoSério}>
                                    R$ {parseFloat(ofertaDestaque.preco_promocional).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            )}

            {/* 🟢 CATÁLOGO DE PRODUTOS - Ocupando mais espaço lateral */}
            <View style={{ width: '100%', paddingHorizontal: 12, marginTop: 20 }}>
                <Text style={[styles.tituloSecaoSério, { marginLeft: 8 }]}>Ofertas Fresquinhas</Text>

                <View style={styles.gridProdutosSério}>
                    {produtos
                        .filter((p: any) => p.id !== ofertaDestaque?.produto_id)
                        .map((produto: any) => (
                            <View key={produto.id} style={styles.cardProdutoSério}>

                                {/* Foto do Produto - Arredondada e com Altura de 160px para preencher */}
                                <View style={styles.cardCatalogueImageContainerSério}>
                                    {produto.imagem_url ? (
                                        <Image
                                            source={{ uri: `${API_URL}${produto.imagem_url}` }}
                                            style={styles.cardCatalogueImageSério}
                                        />
                                    ) : (
                                        <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                                    )}

                                    {/* Etiqueta de Categoria no Verde Lima oficial */}
                                    <View style={styles.badgeOrganicoSério}>
                                        <Text style={styles.badgeOrganicoTextSério}>
                                            {produto.categoria || "Produto"}
                                        </Text>
                                    </View>
                                </View>

                                {/* Informações do Produto com leitura clara */}
                                <View style={styles.cardCatalogueInfoSério}>
                                    <Text style={styles.cardCatalogueNameSério} numberOfLines={1}>
                                        {produto.nome_produto}
                                    </Text>
                                    <Text style={styles.cardCatalogueVendorSério} numberOfLines={1}>
                                        {produto.nome_produtor}
                                    </Text>

                                    <View style={styles.cardCataloguePriceRowSério}>
                                        <Text style={styles.cardCataloguePriceSério}>
                                            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                                        </Text>

                                        <TouchableOpacity style={styles.btnAddCardNewSério}>
                                            <Ionicons name="add" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                </View>

                {produtos.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 40, color: colors.placeholder }}>
                        Nenhum produto cadastrado no Vale do Ribeira.
                    </Text>
                )}
            </View>

        </ScrollView>
    );
}