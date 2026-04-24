import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../../colors';
import { API_URL } from '../../api';

export default function Mapa() {
    const [produtores, setProdutores] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutores();
    }, []);

    const carregarProdutores = async () => {
        try {
            const res = await fetch(`${API_URL}/produtos`);
            if (res.ok) {
                const produtos = await res.json();
                // Simular coordenadas para os produtores (em um app real, viria do banco)
                const produtoresComCoords = produtos.map((produto: any, index: number) => ({
                    ...produto,
                    latitude: -23.5505 + (index * 0.01), // Exemplo: São Paulo + variação
                    longitude: -46.6333 + (index * 0.01),
                }));
                setProdutores(produtoresComCoords);
            }
        } catch (error) {
            console.error("Erro ao carregar produtores:", error);
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
                <Text>Carregando mapa...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -23.5505, // São Paulo como exemplo
                    longitude: -46.6333,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {produtores.map((produtor) => (
                    <Marker
                        key={produtor.id}
                        coordinate={{
                            latitude: produtor.latitude,
                            longitude: produtor.longitude,
                        }}
                        title={produtor.nome_produtor}
                        description={produtor.nome_produto}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.branco,
    },
});