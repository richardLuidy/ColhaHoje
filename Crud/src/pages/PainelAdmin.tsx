import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../../styles'; 
import { colors } from '../../colors';
import { API_URL } from '../api';

interface PainelAdminProps {
    onVoltar: () => void;
}

export default function PainelAdmin({ onVoltar }: PainelAdminProps) {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState({
        totais: { usuarios: 0, produtos: 0, pedidos: 0 },
        ultimosUsuarios: [],
        ultimosProdutos: [],
        ofertasAtivas: [],
        ultimosPedidos: []
    });

    const carregarMetricas = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/admin/dashboard`);
            if (response.data) {
                setDados(response.data);
            }
        } catch (error) {
            console.error("Erro ao carregar admin:", error);
            Alert.alert("Erro de Conexão", "Não foi possível carregar as métricas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarMetricas();
    }, [carregarMetricas]);

    return (
        <View style={styles.adminContainer}>
            {/* CABEÇALHO DO ADMIN */}
            <View style={styles.adminHeader}>
                <TouchableOpacity onPress={onVoltar} style={styles.adminBtnVoltar}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
                    <Text style={styles.adminHeaderTitle}>Painel de Controle</Text>
                    <Text style={styles.adminHeaderSubtitle}>Visão Geral • ColhaHoje</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.adminLoadingContainer}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                    <Text style={{ marginTop: 10, color: '#666' }}>A carregar dados do sistema...</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
                    
                    <View style={styles.adminAlertBox}>
                        <Ionicons name="shield-checkmark" size={24} color="#D4AF37" />
                        <Text style={styles.adminAlertText}>Você está num ambiente restrito para administradores.</Text>
                    </View>

                    {/* KPIs */}
                    <Text style={styles.adminSectionTitle}>MÉTRICAS GERAIS</Text>
                    <View style={styles.adminRowCards}>
                        <View style={styles.adminKpiCard}>
                            <View style={[styles.adminIconCircle, { backgroundColor: '#E3F2FD' }]}><Ionicons name="people" size={24} color="#2196F3" /></View>
                            <Text style={styles.adminKpiValue}>{dados.totais.usuarios}</Text>
                            <Text style={styles.adminKpiLabel}>Usuários</Text>
                        </View>
                        <View style={styles.adminKpiCard}>
                            <View style={[styles.adminIconCircle, { backgroundColor: '#E8F5E9' }]}><Ionicons name="leaf" size={24} color={colors.verdeColheita} /></View>
                            <Text style={styles.adminKpiValue}>{dados.totais.produtos}</Text>
                            <Text style={styles.adminKpiLabel}>Produtos Ativos</Text>
                        </View>
                        <View style={styles.adminKpiCard}>
                            <View style={[styles.adminIconCircle, { backgroundColor: '#FFF3E0' }]}><Ionicons name="cube" size={24} color="#FF9800" /></View>
                            <Text style={styles.adminKpiValue}>{dados.totais.pedidos}</Text>
                            <Text style={styles.adminKpiLabel}>Pedidos</Text>
                        </View>
                    </View>

                    {/* 1. SECÇÃO: USUÁRIOS */}
                    <View style={styles.adminHeaderList}>
                        <Text style={styles.adminSectionTitle}>ÚLTIMOS USUÁRIOS REGISTADOS</Text>
                        <TouchableOpacity onPress={carregarMetricas}><Ionicons name="refresh" size={20} color={colors.verdeColheita} /></TouchableOpacity>
                    </View>
                    <View style={styles.adminListContainer}>
                        {(!dados.ultimosUsuarios || dados.ultimosUsuarios.length === 0) ? (
                            <Text style={styles.adminEmptyText}>Nenhum utilizador registado.</Text>
                        ) : (
                            dados.ultimosUsuarios.map((user: any, index: number) => (
                                <View key={user.id} style={[styles.adminListItem, index === dados.ultimosUsuarios.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View style={styles.adminItemLeft}>
                                        <View style={[styles.adminItemIcon, { backgroundColor: '#E3F2FD' }]}>
                                            <Ionicons name="mail-outline" size={18} color="#2196F3" />
                                        </View>
                                        <View>
                                            <Text style={styles.adminItemName}>{user.nome}</Text>
                                            <Text style={styles.adminItemCategory}>{user.email}</Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={[styles.adminItemUnit, { textTransform: 'uppercase', fontWeight: 'bold' }]}>{user.tipo_usuario}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    {/* 2. SECÇÃO: CATÁLOGO */}
                    <View style={[styles.adminHeaderList, { marginTop: 25 }]}>
                        <Text style={styles.adminSectionTitle}>PRODUTOS NO CATÁLOGO</Text>
                    </View>
                    <View style={styles.adminListContainer}>
                        {(!dados.ultimosProdutos || dados.ultimosProdutos.length === 0) ? (
                            <Text style={styles.adminEmptyText}>Nenhum produto cadastrado ainda.</Text>
                        ) : (
                            dados.ultimosProdutos.map((produto: any, index: number) => (
                                <View key={produto.id} style={[styles.adminListItem, index === dados.ultimosProdutos.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View style={styles.adminItemLeft}>
                                        <View style={styles.adminItemIcon}>
                                            <Ionicons name="pricetag-outline" size={18} color="#555" />
                                        </View>
                                        <View>
                                            <Text style={styles.adminItemName}>{produto.nome_produto}</Text>
                                            <Text style={styles.adminItemCategory}>ID: #{produto.id} • {produto.categoria}</Text>
                                            <Text style={[styles.adminItemCategory, { color: colors.verdeColheita, fontWeight: '600' }]}>
                                                Vendedor: {produto.produtor?.nome || 'Desconhecido'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.adminItemPrice}>R$ {parseFloat(produto.preco || 0).toFixed(2).replace('.', ',')}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    {/* 3. SECÇÃO: OFERTAS RELÂMPAGO */}
                    <View style={[styles.adminHeaderList, { marginTop: 25 }]}>
                        <Text style={styles.adminSectionTitle}>OFERTAS RELÂMPAGO ATIVAS</Text>
                    </View>
                    <View style={styles.adminListContainer}>
                        {(!dados.ofertasAtivas || dados.ofertasAtivas.length === 0) ? (
                            <Text style={styles.adminEmptyText}>Nenhuma oferta relâmpago ativa.</Text>
                        ) : (
                            dados.ofertasAtivas.map((oferta: any, index: number) => {
                                const produtoNome = oferta.produto?.nome_produto || 'Produto Removido';
                                return (
                                    <View key={oferta.id} style={[styles.adminListItem, index === dados.ofertasAtivas.length - 1 && { borderBottomWidth: 0 }]}>
                                        <View style={styles.adminItemLeft}>
                                            <View style={[styles.adminItemIcon, { backgroundColor: '#FFF9C4' }]}>
                                                <Ionicons name="flash" size={18} color="#FBC02D" />
                                            </View>
                                            <View>
                                                <Text style={styles.adminItemName}>{produtoNome}</Text>
                                                <Text style={styles.adminItemCategory}>Duração: {oferta.duracao_minutos} min</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={[styles.adminItemPrice, { color: '#D32F2F' }]}>
                                                R$ {parseFloat(oferta.preco_promocional || 0).toFixed(2).replace('.', ',')}
                                            </Text>
                                            <Text style={[styles.adminItemUnit, { textDecorationLine: 'line-through' }]}>
                                                R$ {parseFloat(oferta.preco_original || 0).toFixed(2).replace('.', ',')}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>

                    {/* 4. SECÇÃO: TRANSAÇÕES */}
                    <View style={[styles.adminHeaderList, { marginTop: 25 }]}>
                        <Text style={styles.adminSectionTitle}>HISTÓRICO DE TRANSAÇÕES</Text>
                    </View>
                    <View style={styles.adminListContainer}>
                        {(!dados.ultimosPedidos || dados.ultimosPedidos.length === 0) ? (
                            <Text style={styles.adminEmptyText}>Nenhuma transação registada.</Text>
                        ) : (
                            dados.ultimosPedidos.map((pedido: any, index: number) => {
                                const nomeProdutor = pedido.itens?.[0]?.produto?.produtor?.nome || 'Produtor ColhaHoje';
                                const nomeCliente = pedido.cliente?.nome || 'Cliente ColhaHoje';

                                return (
                                    <View key={pedido.id} style={[styles.adminListItem, index === dados.ultimosPedidos.length - 1 && { borderBottomWidth: 0 }]}>
                                        <View style={styles.adminItemLeft}>
                                            <View style={[styles.adminItemIcon, { backgroundColor: '#E8F5E9' }]}>
                                                <Ionicons name="swap-horizontal" size={18} color={colors.verdeColheita} />
                                            </View>
                                            <View>
                                                <Text style={styles.adminItemName}>Pedido #{pedido.id}</Text>
                                                <Text style={styles.adminItemCategory}>De: {nomeProdutor}</Text>
                                                <Text style={styles.adminItemCategory}>Para: {nomeCliente}</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={styles.adminItemPrice}>R$ {parseFloat(pedido.total || 0).toFixed(2).replace('.', ',')}</Text>
                                            <Text style={[styles.adminItemUnit, { textTransform: 'capitalize' }]}>{pedido.status}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>

                    <TouchableOpacity style={styles.adminBtnRelatorio} onPress={() => Alert.alert("Sucesso", "Relatório completo enviado para admin@colhahoje.com")}>
                        <Ionicons name="document-text-outline" size={20} color="#FFF" />
                        <Text style={styles.adminBtnRelatorioText}>Gerar Relatório Completo</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}