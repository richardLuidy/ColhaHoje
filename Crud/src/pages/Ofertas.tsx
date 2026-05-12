import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import stylesGlobal from '../../styles'; // Reusing global styles where possible

export default function Ofertas() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const resProdutos = await fetch('http://192.168.0.116:3000/produtos');
            if (resProdutos.ok) {
                const listaProdutos = await resProdutos.json();
                setProdutos(listaProdutos);
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
                {produtos.map((produto) => (
                    <View key={produto.id} style={stylesGlobal.cardProdutoSério}>
                        <View style={stylesGlobal.cardCatalogueImageContainerSério}>
                            {produto.imagem_url ? (
                                <Image source={{ uri: produto.imagem_url }} style={stylesGlobal.cardCatalogueImageSério} />
                            ) : (
                                <Ionicons name="leaf-outline" size={40} color={colors.placeholder} />
                            )}
                            <View style={stylesGlobal.badgeOrganicoSério}>
                                <Text style={stylesGlobal.badgeOrganicoTextSério}>
                                    {produto.categoria || "Produto"}
                                </Text>
                            </View>
                        </View>

                        <View style={stylesGlobal.cardCatalogueInfoSério}>
                            <Text style={stylesGlobal.cardCatalogueNameSério} numberOfLines={1}>{produto.nome_produto}</Text>
                            <Text style={stylesGlobal.cardCatalogueVendorSério} numberOfLines={1}>{produto.nome_produtor}</Text>

                            <View style={stylesGlobal.cardCataloguePriceRowSério}>
                                <Text style={stylesGlobal.cardCataloguePriceSério}>
                                    R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                                </Text>

                                <TouchableOpacity style={stylesGlobal.btnAddCardNewSério}>
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
        gap: 15, // Using gap if supported, else rely on space-between
    }
});