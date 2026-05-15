import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import { useCart } from '../context/CartContext';
import api from '../api';

export default function ConfirmarPedido({ onFinalizado }: { onFinalizado: () => void }) {
    const { items, valorTotal, limparCarrinho } = useCart();
    const [carregando, setCarregando] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('Pix');

   const finalizarCompra = async () => {
        setCarregando(true);
        try {
            const dadosPedido = {
                // 👇 A MÁGICA ACONTECE AQUI. Trocamos o fantasma 1 pelo seu ID 7 real!
                cliente_id: 7, 
                total: valorTotal,
                metodo_pagamento: metodoPagamento,
                itens: items.map(item => ({
                    produto_id: item.id,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco
                }))
            };

            await api.post('/pedidos', dadosPedido);
            
            Alert.alert("Sucesso!", "Seu pedido foi enviado para o produtor!");
            limparCarrinho();
            onFinalizado(); 
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível enviar seu pedido.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ScrollView style={styles.confirmarPedidoContainer}>
            <Text style={styles.confirmarPedidoTitulo}>Revisão do Pedido</Text>

            <View style={styles.cardRevisaoItens}>
                {items.map(item => (
                    <View key={item.id} style={styles.linhaProdutoRevisao}>
                        <Text style={{ color: colors.cinzaTecnico }}>
                            {item.quantidade}x {item.nome_produto}
                        </Text>
                        <Text style={{ fontWeight: '500' }}>
                            R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                ))}

                <View style={styles.totalConfirmacaoContainer}>
                    <Text style={{ fontSize: 14, color: '#999' }}>Total do Pedido</Text>
                    <Text style={styles.totalConfirmacaoValor}>
                        R$ {valorTotal.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>

            <Text style={styles.confirmarPedidoTitulo}>Forma de Pagamento</Text>

            {['Pix', 'Cartão', 'Dinheiro'].map(tipo => (
                <TouchableOpacity
                    key={tipo}
                    onPress={() => setMetodoPagamento(tipo)}
                    style={[
                        styles.metodoPagamentoBotao,
                        { borderColor: metodoPagamento === tipo ? colors.verdeColheita : 'transparent' }
                    ]}
                >
                    <Ionicons
                        name={tipo === 'Pix' ? "flash" : tipo === 'Cartão' ? "card" : "cash"}
                        size={22}
                        color={colors.verdeColheita}
                    />
                    <Text style={styles.metodoPagamentoTexto}>{tipo}</Text>

                    {metodoPagamento === tipo && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.verdeColheita} style={{ marginLeft: 'auto' }} />
                    )}
                </TouchableOpacity>
            ))}

            {/* 🟢 USANDO O NOME PADRÃO DO SEU CSS PARA BOTÕES */}
            <TouchableOpacity
                style={[styles.btnFinalizarCarrinhoSério, { marginTop: 20, marginBottom: 40 }]}
                onPress={finalizarCompra}
                disabled={carregando}
            >
                {carregando ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}>Confirmar e Pagar</Text>
                )}
            </TouchableOpacity>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
}