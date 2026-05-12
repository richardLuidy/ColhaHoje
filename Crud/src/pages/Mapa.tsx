import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '../../colors';

const { width, height } = Dimensions.get('window');

// Helper to spread markers around a center point
const getRandomOffset = (index: number) => {
    // Spread radius
    const radius = 0.02;
    const angle = index * (Math.PI * 2) / 7; // Spread them in a circle
    return {
        latitudeOffset: Math.sin(angle) * radius,
        longitudeOffset: Math.cos(angle) * radius,
    };
};

const getEmojiForCategory = (categoria: string, nome: string) => {
    const text = (categoria + ' ' + nome).toLowerCase();
    if (text.includes('banana')) return '🍌';
    if (text.includes('tomate')) return '🍅';
    if (text.includes('cenoura')) return '🥕';
    if (text.includes('milho')) return '🌽';
    if (text.includes('folha') || text.includes('alface')) return '🥬';
    if (text.includes('fruta')) return '🍎';
    return '📦';
};

export default function Mapa() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Center in Registro, SP (Vale do Ribeira)
    const initialRegion = {
        latitude: -24.4925,
        longitude: -47.8427,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };

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
            console.error("Erro ao carregar produtos pro Mapa:", error);
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.map} 
                initialRegion={initialRegion}
                showsUserLocation={true}
            >
                {produtos.map((produto, index) => {
                    const offset = getRandomOffset(index);
                    const coord = {
                        latitude: initialRegion.latitude + offset.latitudeOffset,
                        longitude: initialRegion.longitude + offset.longitudeOffset,
                    };
                    const isOrganico = produto.categoria?.toLowerCase() === 'orgânico';
                    
                    return (
                        <Marker 
                            key={produto.id} 
                            coordinate={coord}
                            title={produto.nome_produto}
                            description={`R$ ${parseFloat(produto.preco).toFixed(2)} - ${produto.nome_produtor}`}
                        >
                            <View style={[styles.customMarker, isOrganico ? styles.markerGreen : styles.markerRed]}>
                                <Text style={styles.markerEmoji}>
                                    {getEmojiForCategory(produto.categoria, produto.nome_produto)}
                                </Text>
                            </View>
                        </Marker>
                    );
                })}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    map: {
        width: width,
        height: height,
    },
    customMarker: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#FFF',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerGreen: {
        borderColor: '#387C59', // Verde para orgânicos
    },
    markerRed: {
        borderColor: '#D34A4A', // Vermelho para convencionais/outros
    },
    markerEmoji: {
        fontSize: 22,
    },
    floatingCard: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    floatingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E1E1E',
    },
    floatingSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    }
});