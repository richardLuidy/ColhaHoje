import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles'; // 🟢 Puxando o CSS global limpo
import axios from 'axios';
import { API_URL } from '../api';
import { useCart } from '../context/CartContext';

// 🕒 NOVA FUNÇÃO INTELIGENTE: Transforma "420" em "7h 00min"
const formatarTempo = (totalMinutos: number) => {
    if (!totalMinutos) return '0 min';
    
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (horas > 0) {
        return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
    }
    return `${minutos} min`;
};

export default function Ofertas({ onVerDetalhes }: { onVerDetalhes: (produto: any) => void }) {
    const [ofertas, setOfertas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { adicionarAoCarrinho } = useCart();

    const buscarOfertasAtivas = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/ofertas`, { params: { _t: Date.now() } });
            const ativas = response.data.filter((o: any) => o.status === 'ativa');
            setOfertas(ativas);
        } catch (error) {
            console.error("Erro ao carregar ofertas:", error);
        } finally {
            setCarregando(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { buscarOfertasAtivas(); }, [buscarOfertasAtivas]);

    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={{ flex: 1, backgroundColor: '#F8F9FA' }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buscarOfertasAtivas(); }} />}
        >
            <Text style={[styles.tituloSecaoSério, { marginLeft: 15, marginTop: 20 }]}>Ofertas Relâmpago ⚡</Text>

            {ofertas.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Ionicons name="flash-off-outline" size={50} color="#CCC" />
                    <Text style={{ color: '#999', marginTop: 10, textAlign: 'center' }}>
                        Nenhuma oferta relâmpago ativa no momento.
                    </Text>
                </View>
            ) : (
                <View style={styles.gridOfertasFigma}>
                    {ofertas.map((oferta: any) => {
                        const imgPath = oferta.produto?.imagem_url;
                        
                        // Proteção contra crash 
                        const uriStr = typeof imgPath === 'string' && imgPath.trim() !== '' 
                            ? `${API_URL}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`
                            : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';

                        return (
                            <TouchableOpacity 
                                key={oferta.id} 
                                style={styles.cardOfertaFigma}
                                activeOpacity={0.9}
                                onPress={() => onVerDetalhes({ ...oferta.produto, preco: oferta.preco_promocional })}
                            >
                                {/* PARTE SUPERIOR - IMAGEM E BADGES FIGMA */}
                                <View style={styles.containerImagemOfertaFigma}>
                                    <Image source={{ uri: uriStr }} style={styles.imagemOfertaFigma} />
                                    
                                    {/* 🟢 BADGE TEMPO AGORA É INTELIGENTE */}
                                    <View style={styles.badgeTempoOfertaFigma}>
                                        <Ionicons name="flash" size={10} color="#FFF" />
                                        <Text style={styles.textoTempoOfertaFigma}>
                                            {formatarTempo(oferta.duracao_minutos)}
                                        </Text>
                                    </View>
                                    
                                    {/* FAVORITO */}
                                    <TouchableOpacity style={styles.btnFavoritoOfertaFigma}>
                                        <Ionicons name="heart-outline" size={16} color="#333" />
                                    </TouchableOpacity>
                                    
                                    {/* ESTOQUE */}
                                    <View style={styles.badgeEstoqueOfertaFigma}>
                                        <Text style={styles.textoEstoqueOfertaFigma}>
                                            {oferta.produto?.quantidade || 0} {oferta.produto?.unidade === 'Kg' ? 'kg.' : 'unid.'}
                                        </Text>
                                    </View>
                                </View>

                                {/* PARTE INFERIOR - INFORMAÇÕES */}
                                <View style={styles.infoOfertaFigma}>
                                    <Text style={styles.nomeProdutoOfertaFigma} numberOfLines={1}>
                                        {oferta.produto?.nome_produto || "Produto"}
                                    </Text>
                                    
                                    <View style={styles.linhaPrecoOfertaFigma}>
                                        <Text style={styles.precoPromoOfertaFigma}>
                                            R$ {parseFloat(oferta.preco_promocional || 0).toFixed(2).replace('.', ',')}
                                        </Text>
                                        <Text style={styles.precoOriginalOfertaFigma}>
                                            R$ {parseFloat(oferta.preco_original || 0).toFixed(2).replace('.', ',')}
                                        </Text>
                                    </View>

                                    {/* BOTÃO ADICIONAR */}
                                    <TouchableOpacity 
                                        style={styles.btnAdicionarOfertaFigma}
                                        onPress={() => adicionarAoCarrinho({ ...oferta.produto, preco: oferta.preco_promocional })}
                                    >
                                        <Ionicons name="cart-outline" size={16} color="#FFF" />
                                        <Text style={styles.textoBtnAdicionarOfertaFigma}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}