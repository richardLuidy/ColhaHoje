import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../styles';
import { colors } from '../../colors';
import { API_URL } from '../api';

interface MinhasOfertasProps {
    onVoltar: () => void;
}

export default function MinhasOfertas({ onVoltar }: MinhasOfertasProps) {
    const [ofertas, setOfertas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [agora, setAgora] = useState(new Date().getTime());

    // 🟢 Atualiza o "agora" a cada minuto para o cronômetro seguir rodando
    useEffect(() => {
        const interval = setInterval(() => {
            setAgora(new Date().getTime());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const buscarMinhasOfertas = useCallback(async () => {
        try {
            const idSalvo = await AsyncStorage.getItem('user_id');
            if (!idSalvo) return;

            const response = await axios.get(`${API_URL}/ofertas`);
            const minhasOfertinhas = response.data.filter((o: any) => o.produto.produtor_id === parseInt(idSalvo));

            setOfertas(minhasOfertinhas);
        } catch (error) {
            console.error("Erro ao buscar ofertas:", error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        buscarMinhasOfertas();
    }, [buscarMinhasOfertas]);

    // 🟢 FUNÇÃO DE CÁLCULO SINCRONIZADO
    const calcularTempoRestante = (criadoEm: string, duracaoMinutos: number) => {
        const dataCriacao = new Date(criadoEm).getTime();
        const dataExpiracao = dataCriacao + (duracaoMinutos * 60 * 1000);
        const diferencaMs = dataExpiracao - agora;

        if (diferencaMs <= 0) return "Expirado";

        const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
        const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));

        if (horas > 0) {
            return `${horas}h ${minutos}min`;
        }
        return `${minutos} min`;
    };

    const deletarOferta = async (idOferta: number) => {
        Alert.alert(
            "Remover Promoção",
            "Deseja retirar este produto da Oferta Relâmpago? Ele voltará ao preço normal no catálogo.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/ofertas/${idOferta}`);
                            Alert.alert("Sucesso", "Produto voltou ao catálogo normal!");
                            buscarMinhasOfertas();
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível remover a oferta.");
                        }
                    }
                }
            ]
        );
    };

    if (carregando) {
        return (
            <View style={styles.centerHomeSério}>
                <ActivityIndicator size="large" color={colors.verdeColheita} />
            </View>
        );
    }

    return (
        <View style={styles.containerMinhasOfertasSério}>
            {/* Header */}
            <View style={styles.headerMinhasOfertasSério}>
                <TouchableOpacity onPress={onVoltar} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.verdeColheita} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.cinzaTecnico, marginLeft: 15 }}>
                    Minhas Ofertas
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {ofertas.map((oferta) => (
                    <View key={oferta.id} style={styles.cardOfertaGerenciamentoSério}>

                        {/* 1. Foto do Produto */}
                        <Image
                            source={{ uri: `${API_URL}${oferta.produto.imagem_url}` }}
                            style={styles.imagemOfertaGerenciamentoSério}
                        />

                        {/* 2. Informações */}
                        <View style={styles.infoOfertaGerenciamentoSério}>
                            <Text style={styles.tituloOfertaGerenciamentoSério} numberOfLines={1}>
                                {oferta.produto.nome_produto}
                            </Text>

                            <View style={styles.rowPrecosOfertaSério}>
                                <Text style={styles.precoAntigoOfertaSério}>
                                    R$ {parseFloat(oferta.preco_original).toFixed(2).replace('.', ',')}
                                </Text>
                                <Text style={styles.precoNovoOfertaSério}>
                                    R$ {parseFloat(oferta.preco_promocional).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            {/* 🟢 Badge de Tempo Sincronizado */}
                            <View style={styles.timerBadgeOfertaSério}>
                                <Ionicons name="time-outline" size={13} color={colors.laranjaAlerta} />
                                <Text style={styles.timerTextOfertaSério}>
                                    Expira em: {calcularTempoRestante(oferta.criado_em, oferta.duracao_minutos)}
                                </Text>
                            </View>
                        </View>

                        {/* 3. Botão de Lixeira */}
                        <TouchableOpacity
                            style={styles.btnRemoverOfertaSério}
                            onPress={() => deletarOferta(oferta.id)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Empty State */}
                {ofertas.length === 0 && (
                    <View style={{ alignItems: 'center', marginTop: 80 }}>
                        <Ionicons name="flash-off-outline" size={80} color={colors.backGroundPage} />
                        <Text style={{ color: colors.placeholder, marginTop: 15, textAlign: 'center', fontSize: 16 }}>
                            Nenhuma oferta relâmpago ativa.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}