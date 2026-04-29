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

    // 🟢 Atualiza o relógio a cada minuto
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

    // 🟢 FUNÇÃO DE TEMPO RESTANTE
    const calcularTempoRestante = (criadoEm: string, duracaoMinutos: number) => {
        const dataCriacao = new Date(criadoEm).getTime();
        const dataExpiracao = dataCriacao + (duracaoMinutos * 60 * 1000);
        const diferencaMs = dataExpiracao - agora;

        if (diferencaMs <= 0) return "Expirou";

        const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
        const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));

        if (horas > 0) {
            return `${horas}h ${minutos}min`;
        }
        return `${minutos} min`;
    };

    // 🧠 INTELIGÊNCIA DE STATUS (SEPARADA PARA ATENDER AO DESIGN DA IMAGEM)
    const obterStatus = (oferta: any) => {
        const vendido = oferta.produto.quantidade <= 0;
        
        const dataCriacao = new Date(oferta.criado_em).getTime();
        const dataExpiracao = dataCriacao + (oferta.duracao_minutos * 60 * 1000);
        const diferencaMs = dataExpiracao - agora;
        
        const expirou = diferencaMs <= 0;
        const esgotando = diferencaMs > 0 && diferencaMs <= 60 * 60 * 1000; // Faltando menos de 1h

        // 1. O Status Principal que vai no canto superior direito
        let principal = { texto: 'Ativa', corFundo: '#E8F5E9', corTexto: '#388E3C', corBorda: colors.laranjaAlerta };
        
        if (vendido) {
            principal = { texto: 'Vendido', corFundo: '#E3F2FD', corTexto: '#1976D2', corBorda: '#1976D2' };
        } else if (expirou) {
            principal = { texto: 'Expirada', corFundo: '#FFEBEE', corTexto: '#D32F2F', corBorda: '#D32F2F' };
        }

        return { principal, expirou, esgotando, vendido };
    };

    const deletarOferta = async (idOferta: number) => {
        Alert.alert(
            "Remover Promoção",
            "Deseja retirar este produto da Oferta Relâmpago?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/ofertas/${idOferta}`);
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
            
            {/* 🟢 HEADER INTERNO COM A SETA DE VOLTAR */}
            <View style={styles.headerMinhasOfertasSério}>
                <TouchableOpacity onPress={onVoltar} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={28} color={colors.verdeColheita} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.cinzaTecnico, marginLeft: 15 }}>
                    Monitor de Ofertas
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                {ofertas.map((oferta) => {
                    const status = obterStatus(oferta); // Calcula o status daquele produto específico

                    return (
                        <View key={oferta.id} style={[styles.cardOfertaGerenciamentoSério, { borderLeftColor: status.principal.corBorda }]}>

                            {/* 🟢 STATUS CANTO SUPERIOR DIREITO (Igual da imagem) */}
                            <View style={[styles.badgeStatusTopRightSério, { backgroundColor: status.principal.corFundo }]}>
                                <View style={[styles.dotStatusSério, { backgroundColor: status.principal.corTexto }]} />
                                <Text style={[styles.badgeStatusTextoTopRightSério, { color: status.principal.corTexto }]}>
                                    {status.principal.texto}
                                </Text>
                            </View>

                            {/* 1. Foto do Produto */}
                            <Image
                                source={{ uri: `${API_URL}${oferta.produto.imagem_url}` }}
                                style={styles.imagemOfertaGerenciamentoSério}
                            />

                            {/* 2. Informações */}
                            <View style={styles.infoOfertaGerenciamentoSério}>
                                
                                {/* ⚠️ AVISO DE ESGOTANDO (Aparece em cima do título apenas se estiver acabando e não foi vendido) */}
                                {status.esgotando && !status.vendido && !status.expirou && (
                                    <View style={[styles.badgeStatusOfertaSério, { backgroundColor: '#FFF8E1' }]}>
                                        <Ionicons name="warning" size={10} color="#F57C00" />
                                        <Text style={[styles.badgeStatusTextoOfertaSério, { color: '#F57C00' }]}>
                                            Esgotando
                                        </Text>
                                    </View>
                                )}

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

                                {/* Badge de Tempo Baseado no Status */}
                                {!status.expirou && !status.vendido ? (
                                    // Relógio normal laranja
                                    <View style={styles.timerBadgeOfertaSério}>
                                        <Ionicons name="time-outline" size={13} color={colors.laranjaAlerta} />
                                        <Text style={styles.timerTextOfertaSério}>
                                            Expira em: {calcularTempoRestante(oferta.criado_em, oferta.duracao_minutos)}
                                        </Text>
                                    </View>
                                ) : status.expirou && !status.vendido ? (
                                    // Alerta vermelho de expirou (Igual o tomate da imagem)
                                    <View style={[styles.timerBadgeOfertaSério, { backgroundColor: '#FFEBEE' }]}>
                                        <Ionicons name="time-outline" size={13} color="#D32F2F" />
                                        <Text style={[styles.timerTextOfertaSério, { color: '#D32F2F' }]}>
                                            Expirou
                                        </Text>
                                    </View>
                                ) : null /* Se vendeu tudo, nem mostra relógio */}
                            </View>

                            {/* 3. Botão de Lixeira */}
                            <TouchableOpacity style={styles.btnRemoverOfertaSério} onPress={() => deletarOferta(oferta.id)}>
                                <Ionicons name="trash-outline" size={20} color="#FF5252" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

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