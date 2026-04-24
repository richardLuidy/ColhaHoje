import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../../colors';
import { useProdutores } from '../hooks/api';

export default function Mapa() {
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true);
    const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Region | null>(null);

    // 🟢 REACT QUERY: Cache inteligente para produtores
    const { data: produtores = [], isLoading: carregandoProdutores } = useProdutores();

    const carregando = carregandoLocalizacao || carregandoProdutores;

    useEffect(() => {
        solicitarPermissaoLocalizacao();
    }, []);

    const solicitarPermissaoLocalizacao = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permissão de Localização',
                    'Precisamos da sua localização para mostrar produtores próximos.',
                    [{ text: 'OK' }]
                );
                setCarregandoLocalizacao(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const region: Region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setLocalizacaoUsuario(region);
            setCarregandoLocalizacao(false);
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            // Fallback para localização padrão
            setLocalizacaoUsuario({
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setCarregandoLocalizacao(false);
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
                initialRegion={localizacaoUsuario || {
                    latitude: -23.5505,
                    longitude: -46.6333,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {produtores.map((produtor) => (
                    <Marker
                        key={produtor.id}
                        coordinate={{
                            latitude: produtor.latitude,
                            longitude: produtor.longitude,
                        }}
                        title={produtor.nome_produtor}
                        description={`${produtor.nome_produto} - R$ ${produtor.preco}`}
                        pinColor={colors.verdeColheita}
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