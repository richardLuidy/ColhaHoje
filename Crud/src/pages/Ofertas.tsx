import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import { useOfertasRelampago } from '../hooks/api';

export default function Ofertas() {
    // 🟢 REACT QUERY: Cache inteligente para ofertas
    const { data: ofertas = [], isLoading: carregando } = useOfertasRelampago();

    if (carregando) {
        return (
            <View style={styles.centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.containerHomeSério}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerHomeSério}
        >
            <Text style={styles.tituloSecaoSério}>Todas as Ofertas</Text>

            <View style={styles.gridProdutosSério}>
                {ofertas.map((oferta) => {
                    const imagem = oferta.produto.imagem_url
                        ? { uri: `${API_URL}${oferta.produto.imagem_url}` }
                        : { uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&h=400' };

                    return (
                        <View key={oferta.id} style={styles.cardProdutoSério}>
                            <View style={styles.cardCatalogueImageContainerSério}>
                                <Image source={imagem} style={styles.cardCatalogueImageSério} />
                                <View style={styles.badgeOrganicoSério}>
                                    <Text style={styles.badgeOrganicoTextSério}>
                                        {oferta.produto.categoria || "Oferta"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardCatalogueInfoSério}>
                                <Text style={styles.cardCatalogueNameSério} numberOfLines={1}>{oferta.produto.nome_produto}</Text>
                                <Text style={styles.cardCatalogueVendorSério} numberOfLines={1}>{oferta.produto.nome_produtor}</Text>

                                <View style={styles.cardCataloguePriceRowSério}>
                                    <Text style={styles.cardCataloguePriceSério}>
                                        R$ {parseFloat(oferta.preco_promocional).toFixed(2).replace('.', ',')}
                                    </Text>
                                    <Text style={styles.cardCataloguePriceRiscadoSério}>
                                        R$ {parseFloat(oferta.preco_original).toFixed(2).replace('.', ',')}
                                    </Text>

                                    <TouchableOpacity style={styles.btnAddCardNewSério}>
                                        <Ionicons name="add" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}