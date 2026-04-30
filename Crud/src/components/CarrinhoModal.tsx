import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles';
import { API_URL } from '../api';
import { useCart } from '../context/CartContext';

interface CarrinhoModalProps {
    visivel: boolean;
    onFechar: () => void;
    onFinalizar: () => void;
}

export default function CarrinhoModal({ visivel, onFechar, onFinalizar }: CarrinhoModalProps) {
    const { items, atualizarQuantidade, removerDoCarrinho, valorTotal, quantidadeTotal } = useCart();

    return (
        <Modal 
            visible={visivel} 
            animationType="slide" 
            transparent={true}
            statusBarTranslucent={true} // 🟢 Faz o modal cobrir a tela toda, incluindo o menu
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{
                    backgroundColor: '#FFF',
                    height: '85%',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    padding: 20
                }}>

                    {/* HEADER DO MODAL */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.cinzaTecnico }}>
                            Sua Sacola ({quantidadeTotal})
                        </Text>
                        <TouchableOpacity onPress={onFechar}>
                            <Ionicons name="close-circle" size={32} color={colors.placeholder} />
                        </TouchableOpacity>
                    </View>

                    {/* LISTA DE ITENS */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {items.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 100 }}>
                                <Ionicons name="cart-outline" size={80} color="#CCC" />
                                <Text style={{ color: colors.placeholder, marginTop: 10 }}>Sua sacola está vazia.</Text>
                            </View>
                        ) : (
                            items.map((item) => (
                                <View key={item.id} style={styles.itemCarrinhoSério}>
                                    <Image
                                        source={{ uri: `${API_URL}${item.imagem_url}` }}
                                        style={styles.imagemItemCarrinhoSério}
                                    />

                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }} numberOfLines={1}>
                                            {item.nome_produto}
                                        </Text>
                                        <Text style={{ color: colors.verdeColheita, fontWeight: 'bold' }}>
                                            R$ {item.preco.toFixed(2).replace('.', ',')}
                                        </Text>

                                        {/* CONTROLES DE QUANTIDADE */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                            <TouchableOpacity
                                                onPress={() => atualizarQuantidade(item.id, 'diminuir')}
                                                style={{ backgroundColor: '#F0F0F0', borderRadius: 5, padding: 4 }}
                                            >
                                                <Ionicons name="remove" size={18} color={colors.cinzaTecnico} />
                                            </TouchableOpacity>

                                            <Text style={{ marginHorizontal: 15, fontWeight: 'bold' }}>{item.quantidade}</Text>

                                            <TouchableOpacity
                                                onPress={() => atualizarQuantidade(item.id, 'aumentar')}
                                                style={{
                                                    backgroundColor: item.quantidade >= item.estoque ? '#F5F5F5' : '#F0F0F0',
                                                    borderRadius: 5,
                                                    padding: 4
                                                }}
                                                disabled={item.quantidade >= item.estoque}
                                            >
                                                <Ionicons
                                                    name="add"
                                                    size={18}
                                                    color={item.quantidade >= item.estoque ? '#CCC' : colors.cinzaTecnico}
                                                />
                                            </TouchableOpacity>

                                            {/* 🟢 CORREÇÃO: "Máximo!" em vez de "Mínimo!" */}
                                            {item.quantidade >= item.estoque && (
                                                <Text style={{ fontSize: 10, color: '#FF4444', marginLeft: 10 }}>Máximo!</Text>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}>
                                        <Ionicons name="trash-outline" size={22} color="#FF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* RODAPÉ COM TOTAL E BOTÃO */}
                    {items.length > 0 && (
                        <View style={styles.footerCarrinhoSério}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                <Text style={{ fontSize: 18, color: colors.cinzaTecnico }}>Total:</Text>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.verdeColheita }}>
                                    R$ {valorTotal.toFixed(2).replace('.', ',')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.btnFinalizarCarrinhoSério}
                                onPress={onFinalizar}
                            >
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>
                                    Finalizar Pedido
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}