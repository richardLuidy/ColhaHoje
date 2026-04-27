import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import { useOfertasRelampago } from '../hooks/api';
import { API_URL } from '../api';

export default function Ofertas() {
    const { data: ofertas = [], isLoading: carregando } = useOfertasRelampago();

    if (carregando) {
        return (
            <View style={(styles as any).centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <ScrollView
            style={(styles as any).containerHomeSério}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={(styles as any).contentContainerHomeSério}
        >
            <Text style={(styles as any).tituloSecaoSério}>Todas as Ofertas</Text>

            <View style={(styles as any).gridProdutosSério}>
                {ofertas.map((oferta: any) => {
                    const imagem = oferta.produto.imagem_url
                        ? { uri: `${API_URL}${oferta.produto.imagem_url}` }
                        : { uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&h=400' };

                    return (
                        <View key={oferta.id} style={(styles as any).cardProdutoSério}>
                            <View style={(styles as any).cardCatalogueImageContainerSério}>
                                <Image source={imagem} style={(styles as any).cardCatalogueImageSério} />
                                <View style={(styles as any).badgeOrganicoSério}>
                                    <Text style={(styles as any).badgeOrganicoTextSério}>
                                        {oferta.produto.categoria || "Oferta"}
                                    </Text>
                                </View>
                            </View>

                            <View style={(styles as any).cardCatalogueInfoSério}>
                                <Text style={(styles as any).cardCatalogueNameSério} numberOfLines={1}>
                                    {oferta.produto.nome_produto}
                                </Text>
                                <Text style={(styles as any).cardCatalogueVendorSério} numberOfLines={1}>
                                    {oferta.produto.nome_produtor}
                                </Text>

                                <View style={(styles as any).cardCataloguePriceRowSério}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={(styles as any).cardCataloguePriceSério}>
                                            R$ {parseFloat(oferta.preco_promocional).toFixed(2).replace('.', ',')}
                                        </Text>
                                        
                                        {/* 🟢 Aqui estava o erro: Adicionei (styles as any) para forçar o reconhecimento */}
                                        <Text style={(styles as any).cardCataloguePriceRiscadoSério}>
                                            R$ {parseFloat(oferta.preco_original).toFixed(2).replace('.', ',')}
                                        </Text>
                                    </View>

                                    <TouchableOpacity style={(styles as any).btnAddCardNewSério}>
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