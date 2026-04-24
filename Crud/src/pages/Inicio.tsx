import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import { API_URL } from '../../api';

export default function Inicio() {
    const [ofertaDestaque, setOfertaDestaque] = useState<any>(null);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [tempoRestante, setTempoRestante] = useState("");

    useEffect(() => {
        carregarDadosHome();
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
                setOfertaDestaque(null);
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

    const carregarDadosHome = async () => {
        try {
            const resOferta = await fetch(`${API_URL}/ofertas/destaque`);
            if (resOferta.ok) {
                const oferta = await resOferta.json();
                setOfertaDestaque(oferta);
            }

            const resProdutos = await fetch(`${API_URL}/produtos`);
            if (resProdutos.ok) {
                const listaProdutos = await resProdutos.json();
                setProdutos(listaProdutos);
            }
        } catch (error) {
            console.error("Erro ao carregar a Home:", error);
        } finally {
            setCarregando(false);
        }
    };

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
        >

            {/* 🔴 BANNER DE OFERTA RELÂMPAGO */}
            {ofertaDestaque && (
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

            {/* 🟢 CATÁLOGO DE PRODUTOS */}
            <Text style={styles.tituloSecaoSério}>Ofertas Fresquinhas</Text>

            <View style={styles.gridProdutosSério}>
                {produtos
                    .filter(p => p.id !== ofertaDestaque?.produto_id) // 👈 A mágica acontece aqui!
                    .map((produto) => (
                        <View key={produto.id} style={styles.cardProdutoSério}>

                            <View style={styles.cardCatalogueImageContainerSério}>
                                {produto.imagem_url ? (
                                    <Image source={{ uri: `${API_URL}${produto.imagem_url}` }} style={styles.cardCatalogueImageSério} />
                                ) : (
                                    <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                                )}

                                {/* 🟢 A MÁGICA AQUI: Trocamos "Orgânico" pela categoria real do banco! */}
                                <View style={styles.badgeOrganicoSério}>
                                    <Text style={styles.badgeOrganicoTextSério}>
                                        {produto.categoria || "Produto"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardCatalogueInfoSério}>
                                <Text style={styles.cardCatalogueNameSério} numberOfLines={1}>{produto.nome_produto}</Text>
                                <Text style={styles.cardCatalogueVendorSério} numberOfLines={1}>{produto.nome_produtor}</Text>

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

                {produtos.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: colors.placeholder }}>
                        Nenhum produto cadastrado no Vale do Ribeira.
                    </Text>
                )}
            </View>

        </ScrollView>
    );
}