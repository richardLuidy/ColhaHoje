import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import stylesGlobal from '../../styles'; // Reusing global styles where possible
import { useCart } from '../contexts/CartContext';

export default function Ofertas() {
    const { addToCart } = useCart();
    const [produtos, setProdutos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            // Buscar ofertas relâmpago ativas
            const resOfertas = await fetch('http://10.0.2.2:3000/ofertas');
            if (resOfertas.ok) {
                const listaOfertas = await resOfertas.json();
                // Filtrar apenas ofertas ativas
                const ofertasAtivas = listaOfertas.filter((oferta: any) => oferta.status === 'ativa');
                setProdutos(ofertasAtivas);
            }
        } catch (error) {
            console.error("Erro ao carregar Ofertas:", error);
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.headerTitle}>
                <Text style={styles.title}>Todas as Ofertas</Text>
                <Text style={styles.subtitle}>Encontre os melhores produtos do Vale do Ribeira</Text>
            </View>

            <View style={styles.grid}>
                {produtos.map((oferta) => (
                    <View key={oferta.id} style={stylesGlobal.cardProdutoSério}>
                        <View style={stylesGlobal.cardCatalogueImageContainerSério}>
                            {oferta.produto?.imagem_url ? (
                                <Image source={{ uri: oferta.produto.imagem_url }} style={stylesGlobal.cardCatalogueImageSério} />
                            ) : (
                                <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                            )}
                            <View style={[stylesGlobal.badgeOrganicoSério, { backgroundColor: '#FFA000' }]}>
                                <Text style={stylesGlobal.badgeOrganicoTextSério}>
                                    OFERTA
                                </Text>
                            </View>
                        </View>

                        <View style={stylesGlobal.cardCatalogueInfoSério}>
                            <Text style={stylesGlobal.cardCatalogueNameSério} numberOfLines={1}>{oferta.produto?.nome_produto}</Text>
                            <Text style={stylesGlobal.cardCatalogueVendorSério} numberOfLines={1}>{oferta.produto?.nome_produtor}</Text>

                            <View style={{ marginBottom: 4 }}>
                                <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through' }}>
                                    R$ {parseFloat(oferta.preco_original).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            <View style={stylesGlobal.cardCataloguePriceRowSério}>
                                <Text style={[stylesGlobal.cardCataloguePriceSério, { color: '#FFA000' }]}>
                                    R$ {parseFloat(oferta.preco_promocional).toFixed(2).replace('.', ',')}
                                </Text>

                                <TouchableOpacity 
                                    style={stylesGlobal.btnAddCardNewSério}
                                    onPress={() => addToCart({
                                        produto_id: oferta.produto.id,
                                        nome_produto: oferta.produto.nome_produto,
                                        nome_produtor: oferta.produto.nome_produtor,
                                        preco: oferta.preco_promocional,
                                        imagem_url: oferta.produto.imagem_url,
                                        quantidade: 1
                                    })}
                                >
                                    <Ionicons name="add" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {produtos.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: colors.placeholder, width: '100%' }}>
                        Nenhuma oferta disponível no momento.
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    headerTitle: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E1E1E',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    }
});