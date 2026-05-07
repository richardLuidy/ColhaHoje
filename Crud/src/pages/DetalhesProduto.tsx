import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import { API_URL } from '../api';
import { useCart } from '../context/CartContext';

// Pega a largura exata da tela do celular
const { width } = Dimensions.get('window');

export default function DetalhesProduto({ produto, onVoltar }: { produto: any, onVoltar: () => void }) {
    const { adicionarAoCarrinho } = useCart();
    const [qtd, setQtd] = useState(1);

    if (!produto) return null;

    const handleAdd = () => {
        for(let i = 0; i < qtd; i++) {
            adicionarAoCarrinho(produto);
        }
        onVoltar();
    };

    return (
        // 🔴 BLINDAGEM MÁXIMA: Força a tela a ter a largura exata do celular e se alinhar no centro
        <View style={{ flex: 1, width: width, backgroundColor: '#FFF', alignSelf: 'center' }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                
                <Image 
                    source={{ uri: `${API_URL.replace(/\/$/, '')}/${produto.imagem_url?.replace(/^\//, '')}` }}
                    style={{ width: '100%', height: 300, backgroundColor: '#F5F5F5' }}
                    resizeMode="cover"
                />

                {/* Caixa Branca com os textos */}
                <View style={{ 
                    flex: 1, 
                    backgroundColor: '#FFF', 
                    marginTop: -30, 
                    borderTopLeftRadius: 30, 
                    borderTopRightRadius: 30, 
                    paddingHorizontal: 25, // Garante que o texto não cole nas bordas
                    paddingTop: 30,
                    paddingBottom: 40
                }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.cinzaTecnico }}>
                        {produto.nome_produto}
                    </Text>
                    
                    {/* 🟢 Trazendo a unidade de medida dinâmica do banco */}
                    <Text style={{ fontSize: 15, color: colors.placeholder, marginTop: 4, marginBottom: 15 }}>
                        {produto.categoria || 'Produto Fresco'} • {produto.unidade_medida || produto.unidade || 'Unidade'}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.verdeColheita }}>
                            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backGroundPage || '#F0F8F5', padding: 12, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 20 }}>
                        <Ionicons name="leaf" size={18} color={colors.verdeColheita} />
                        <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: colors.cinzaTecnico }}>
                            {/* 🟢 AQUI ESTÁ A CORREÇÃO: Buscando o nome real do produtor do banco */}
                            Produtor: {produto?.produtor?.nome || produto?.nome_produtor || 'Produtor Local'}
                        </Text>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.cinzaTecnico, marginBottom: 10 }}>
                        Descrição
                    </Text>
                    <Text style={{ fontSize: 15, color: '#666', lineHeight: 24 }}>
                        {produto.descricao || 'Este produto foi colhido hoje mesmo e trazido direto da horta para você. Sem agrotóxicos e com o sabor real da natureza.'}
                    </Text>
                </View>
            </ScrollView>

            {/* Rodapé Fixo Blindado */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 5 }}>
                    <TouchableOpacity onPress={() => qtd > 1 && setQtd(qtd - 1)} style={{ padding: 12 }}>
                        <Ionicons name="remove" size={22} color={colors.verdeColheita} />
                    </TouchableOpacity>
                    
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 12, minWidth: 20, textAlign: 'center' }}>
                        {qtd}
                    </Text>
                    
                    {/* 🟢 TRAVA DE ESTOQUE COM ALERTA E MEDIDA DINÂMICA */}
                    <TouchableOpacity 
                        onPress={() => {
                            const estoqueMaximo = produto.quantidade_estoque || produto.quantidade || 0;
                            if (qtd < estoqueMaximo) {
                                setQtd(qtd + 1);
                            } else {
                                Alert.alert(
                                    "Estoque Limite", 
                                    `O produtor tem apenas ${estoqueMaximo} ${produto.unidade_medida || produto.unidade || 'unid.'} no momento.`
                                );
                            }
                        }} 
                        style={{ padding: 12 }}
                    >
                        <Ionicons name="add" size={22} color={colors.verdeColheita} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={{ backgroundColor: colors.verdeColheita, flex: 1, marginLeft: 20, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                    onPress={handleAdd}
                >
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Adicionar à Sacola</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}