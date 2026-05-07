import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import axios from 'axios';
import styles from '../../styles';
import { colors } from '../../colors';
import { API_URL } from '../api';

import CadastrarProduto from './CadastrarProduto';
import OfertaRelampago from '../components/OfertaRelampago';
import MinhasOfertas from '../components/MinhasOfertas';

interface QueroVenderProps {
  onVoltar: () => void;
}

export default function QueroVender({ onVoltar }: QueroVenderProps) {
  const [abrindoCadastro, setAbrindoCadastro] = useState(false);
  const [vendoMinhasOfertas, setVendoMinhasOfertas] = useState(false);
  const [modalOfertaAberto, setModalOfertaAberto] = useState(false);
  
  const [vendoPedidos, setVendoPedidos] = useState(false);
  const [pedidosRecebidos, setPedidosRecebidos] = useState<any[]>([]);
  const [faturamentoDia, setFaturamentoDia] = useState(0);

  const [listaProdutosEstoque, setListaProdutosEstoque] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [produtoParaEditar, setProdutoParaEditar] = useState<any>(null);

  const [totalProdutos, setTotalProdutos] = useState<number | string>('...');
  const [filtroAtivo, setFiltroAtivo] = useState<'Todos' | 'Catálogo' | 'Ofertas'>('Todos');
  const [ofertasBrutas, setOfertasBrutas] = useState<any[]>([]);
  const [agora, setAgora] = useState(new Date().getTime());

  const fecharTudoEAtualizar = useCallback(() => {
    setAbrindoCadastro(false);
    setVendoMinhasOfertas(false);
    setVendoPedidos(false);
    setProdutoParaEditar(null);
    setTotalProdutos('...'); 
    setListaProdutosEstoque([]);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 500);
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('onHeaderBackPress', (callback) => {
      if (abrindoCadastro || vendoMinhasOfertas || vendoPedidos) {
        fecharTudoEAtualizar();
        callback(true);
      } else {
        callback(false); 
      }
    });

    return () => subscription.remove();
  }, [abrindoCadastro, vendoMinhasOfertas, vendoPedidos, fecharTudoEAtualizar]);

  useEffect(() => {
    const interval = setInterval(() => setAgora(new Date().getTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  const buscarDadosEstoque = useCallback(async () => {
    try {
      const idSalvo = await AsyncStorage.getItem('user_id');
      if (!idSalvo) return;

      // 1. Busca Produtos
      const responseContar = await axios.get(`${API_URL}/produtos/contar/${idSalvo}`, { params: { _cache: Date.now() } });
      if (responseContar.status === 200) setTotalProdutos(responseContar.data.total);

      const responseLista = await axios.get(`${API_URL}/produtos?produtor_id=${idSalvo}`, { params: { _cache: Date.now() } });
      if (responseLista.status === 200) setListaProdutosEstoque(responseLista.data);

      const responseOfertas = await axios.get(`${API_URL}/ofertas`);
      const minhasOft = responseOfertas.data.filter((o: any) => o.produto.produtor_id === parseInt(idSalvo));
      setOfertasBrutas(minhasOft);

      // 2. 🟢 Busca os Pedidos Recebidos REAL (SEM SIMULAÇÃO)
      try {
        const responsePedidos = await axios.get(`${API_URL}/pedidos/produtor/${idSalvo}`);
        setPedidosRecebidos(responsePedidos.data);
        const faturamento = responsePedidos.data.reduce((acc: number, p: any) => acc + (parseFloat(p.total) || 0), 0);
        setFaturamentoDia(faturamento);
      } catch (err) {
        console.error("Erro ao buscar pedidos do backend:", err);
        setPedidosRecebidos([]); 
        setFaturamentoDia(0);
      }

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setTotalProdutos(0);
    }
  }, []);

  useEffect(() => {
    buscarDadosEstoque();
  }, [refreshKey, buscarDadosEstoque]);

  const confirmarExclusao = (id: number, nome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja apagar o produto "${nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim, Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/produtos/${id}`);
              setRefreshKey(prev => prev + 1);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          } 
        }
      ]
    );
  };

  const abrirMenuOpcoes = (produto: any) => {
    const taEmOferta = ofertasBrutas.some(o => o.produto.id === produto.id);
    Alert.alert("Opções do Produto", produto.nome_produto, [
      { text: "Cancelar", style: "cancel" },
      { text: taEmOferta ? "Gerenciar Oferta ⚡" : "Criar Oferta ⚡", onPress: () => { setProdutoParaEditar(produto); setModalOfertaAberto(true); } },
      { text: "Editar Detalhes 📦", onPress: () => { setProdutoParaEditar(produto); setAbrindoCadastro(true); } }
    ]);
  };

  // 🟢 FUNÇÃO PARA ATUALIZAR STATUS DO PEDIDO (REAL)
  const atualizarStatusPedido = async (pedidoId: number, novoStatus: string) => {
    try {
        await axios.put(`${API_URL}/pedidos/${pedidoId}/status`, { status: novoStatus });
        buscarDadosEstoque(); // Recarrega os dados silenciosamente para atualizar a tela
    } catch (error) {
        Alert.alert("Erro", "Não foi possível atualizar o status no servidor.");
        console.error("Erro no PUT status:", error);
    }
  };

  const produtosFiltrados = listaProdutosEstoque.filter((produto) => {
    const ofertaDesteProduto = ofertasBrutas.find(o => o.produto.id === produto.id);
    if (ofertaDesteProduto) {
      const limite = new Date(ofertaDesteProduto.criado_em).getTime() + (ofertaDesteProduto.duracao_minutos * 60 * 1000);
      if (limite <= agora) return false;
      if (filtroAtivo === 'Catálogo') return false;
    } else {
      if (filtroAtivo === 'Ofertas') return false;
    }
    return true; 
  });

  if (abrindoCadastro) return <CadastrarProduto key={`cad-${refreshKey}`} onVoltar={fecharTudoEAtualizar} produtoEditando={produtoParaEditar} />;
  if (vendoMinhasOfertas) return <MinhasOfertas onVoltar={fecharTudoEAtualizar} />;
  
  if (vendoPedidos) {
      return (
          <ScrollView contentContainerStyle={{ padding: 15, backgroundColor: '#F4F6F8', flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.verdeColheita, marginBottom: 20, marginTop: 10 }}>Gerenciar Pedidos</Text>
              
              {pedidosRecebidos.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Nenhum pedido recebido ainda.</Text>
              ) : (
                  pedidosRecebidos.map((pedido) => {
                      const status = pedido.status?.toLowerCase() || '';
                      return (
                          <View key={pedido.id} style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10, marginBottom: 10 }}>
                                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>👤 {pedido.cliente?.nome || 'Cliente ColhaHoje'}</Text>
                                  <Text style={{ fontSize: 14, color: '#999', fontWeight: 'bold' }}>#{pedido.id}</Text>
                              </View>
                              
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                  <Text style={{ fontSize: 15, color: '#555', flex: 1 }}>
                                      {pedido.itens?.map((i: any) => `${i.quantidade}x ${i.produto?.nome_produto || 'Item'}`).join('\n')}
                                  </Text>
                                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.verdeColheita }}>R$ {parseFloat(pedido.total || 0).toFixed(2).replace('.', ',')}</Text>
                              </View>

                              <Text style={{ fontSize: 14, color: '#666', marginBottom: 10, fontStyle: 'italic', textAlign: 'center' }}>Status: {pedido.status}</Text>
                              
                              {status.includes('pendente') && (
                                  <TouchableOpacity style={[stylesLocal.btnAcao, { backgroundColor: '#FFC107' }]} onPress={() => atualizarStatusPedido(pedido.id, 'preparação')}>
                                      <Text style={stylesLocal.btnTextoEscuro}>Aceitar e Preparar</Text>
                                  </TouchableOpacity>
                              )}
                              {status.includes('prepar') && (
                                  <TouchableOpacity style={[stylesLocal.btnAcao, { backgroundColor: '#17A2B8' }]} onPress={() => atualizarStatusPedido(pedido.id, 'em rota')}>
                                      <Text style={stylesLocal.btnTextoBranco}>Saiu para Entrega</Text>
                                  </TouchableOpacity>
                              )}
                              {(status.includes('rota') || status.includes('caminho')) && (
                                  <TouchableOpacity style={[stylesLocal.btnAcao, { backgroundColor: colors.verdeColheita }]} onPress={() => atualizarStatusPedido(pedido.id, 'entregue')}>
                                      <Text style={stylesLocal.btnTextoBranco}>Marcar como Entregue</Text>
                                  </TouchableOpacity>
                              )}
                              {status.includes('entregue') && (
                                  <Text style={{ color: colors.verdeColheita, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>✅ Pedido Finalizado</Text>
                              )}
                          </View>
                      )
                  })
              )}
          </ScrollView>
      )
  }

  return (
    <ScrollView contentContainerStyle={styles.containerQueroVenderSério} showsVerticalScrollIndicator={false}>
      
      <View style={{ marginTop: 10, marginBottom: 20, marginLeft: 5 }}>
        <Text style={styles.tituloSessaoItalicoSério}>Painel de Vendas</Text>
      </View>

      <View style={styles.rowCardsSério}>
        <View style={styles.cardPequenoSério}>
          <Text style={styles.cardLabelSério}>Vendas do Dia</Text>
          <Text style={styles.cardValorSério}>R$ {faturamentoDia.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.cardPequenoSério}>
          <Text style={styles.cardLabelSério}>Produtos Ativos</Text>
          <Text style={styles.cardValorSério}>{totalProdutos}</Text>
        </View>
      </View>

      <Text style={[styles.tituloSessaoSério, { marginTop: 15, marginBottom: 10 }]}>Logística</Text>
      <TouchableOpacity 
        style={[styles.cardCadastrarNovoSério, { borderColor: '#FFC107', borderWidth: 1 }]} 
        onPress={() => setVendoPedidos(true)}
      >
        <Ionicons name="cube-outline" size={40} color="#FFC107" />
        <View style={styles.infoEstoqueSério}>
          <Text style={styles.tituloEstoqueSério}>Gerenciar Pedidos</Text>
          <Text style={styles.descEstoqueSério}>
             Você tem {pedidosRecebidos.filter(p => p.status.toLowerCase().includes('pendente')).length} pedidos aguardando.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.placeholder} />
      </TouchableOpacity>

      <View style={styles.cardDestaqueBrancaoSério}>
        <View style={styles.headerDestaqueSério}>
          <Text style={styles.tituloSessaoSério}>Destaque seu Produto!</Text>
        </View>
        <View style={styles.cardMenorLaranjadoSério}>
          <Text style={styles.tituloOfertaLaranjaItalicoSério}>Oferta Relâmpago Ativar!</Text>
          <View style={styles.areaDestaqueConteudoSério}>
            <View style={styles.areaDestaqueEsquerdaSério}>
              <View style={styles.areaImagemPlaceholderGrandeSério}>
                <Ionicons name="camera-outline" size={50} color="#ccc" />
              </View>
            </View>
            <View style={styles.areaDestaqueDireitaSério}>
              <Text style={styles.textoPrecoNormalZeradoDetalheSério}>De R$ 0,00/kg</Text>
              <Text style={styles.textoPrecoDestaqueZeradoGrandeSério}>R$ 0,00/kg</Text>
              <Text style={styles.textoTimerLabelZeradoSério}>Encerrar em:</Text>
              <Text style={styles.textoTimerZeradoGrandeSério}>00:00:00</Text>
            </View>
          </View>
        </View>
        <Text style={styles.tituloProdutoOfertaGeralSério}>Nenhum produto em oferta</Text>
        <Text style={styles.descProdutoOfertaGeralSério}>Crie uma oferta agora e venda o que sobrou do dia.</Text>
        <TouchableOpacity style={styles.btnVerPedidosOuterSério} onPress={() => setVendoMinhasOfertas(true)}>
          <Text style={styles.textoBtnBrancoSério}>Minhas ofertas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRedondoFlutuanteSério} onPress={() => setModalOfertaAberto(true)}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.textoIconeFlutuanteSério}>Criar oferta</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.tituloSessaoSério, { marginTop: 25, marginBottom: 10 }]}>Cadastrar Produto</Text>
      <TouchableOpacity style={styles.cardCadastrarNovoSério} onPress={() => setAbrindoCadastro(true)}>
        <Ionicons name="add-circle" size={40} color={colors.verdeColheita} />
        <View style={styles.infoEstoqueSério}>
          <Text style={styles.tituloEstoqueSério}>Adicionar Novo Produto</Text>
          <Text style={styles.descEstoqueSério}>Cadastre sua colheita para venda regular sem prazo.</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.placeholder} />
      </TouchableOpacity>

      <Text style={[styles.tituloSessaoSério, { marginTop: 30, marginBottom: 15 }]}>Central do Produtor</Text>
      <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 5 }}>
        {['Todos', 'Catálogo', 'Ofertas'].map(filtro => (
          <TouchableOpacity
            key={filtro}
            onPress={() => setFiltroAtivo(filtro as any)}
            style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: filtroAtivo === filtro ? colors.verdeColheita : '#F0F0F0', marginRight: 10 }}
          >
            <Text style={{ color: filtroAtivo === filtro ? '#FFF' : colors.placeholder, fontWeight: 'bold', fontSize: 12 }}>{filtro}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {produtosFiltrados.map((produto) => {
        const taEmOferta = ofertasBrutas.some(o => o.produto.id === produto.id);
        return (
          <View key={produto.id} style={styles.cardEstoqueSério}>
            {produto.imagem_url ? (
              <Image source={{ uri: `${API_URL}${produto.imagem_url}` }} style={styles.imagemEstoqueSério} />
            ) : (
              <View style={styles.quadradoPlaceholderSério}>
                <Ionicons name="leaf-outline" size={30} color={colors.placeholder} />
              </View>
            )}
            <View style={styles.infoEstoqueListSério}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={[styles.badgeCategoriaRealSério, { marginRight: 6 }]}>
                  <Text style={styles.badgeCategoriaTextRealSério}>{produto.categoria}</Text>
                </View>
                {taEmOferta ? (
                  <View style={[styles.badgeCategoriaRealSério, { backgroundColor: '#FFF5E6' }]}>
                    <Text style={[styles.badgeCategoriaTextRealSério, { color: colors.laranjaAlerta }]}>⚡ Em Oferta</Text>
                  </View>
                ) : (
                  <View style={[styles.badgeCategoriaRealSério, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.badgeCategoriaTextRealSério, { color: colors.verdeColheita }]}>🛒 Catálogo</Text>
                  </View>
                )}
              </View>
              <Text style={styles.tituloEstoqueListSério} numberOfLines={1}>{produto.nome_produto}</Text>
              <View style={styles.linhaPrecoQuantidadeSério}>
                <Text style={styles.precoEstoqueSério}>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}<Text style={styles.unidadeEstoqueSério}> / {produto.unidade}</Text></Text>
                <Text style={styles.quantidadeEstoqueSério}>{produto.quantidade} unid.</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => abrirMenuOpcoes(produto)}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.placeholder} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => confirmarExclusao(produto.id, produto.nome_produto)}>
                    <Ionicons name="trash-outline" size={22} color="#D32F2F" />
                </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
      <OfertaRelampago visivel={modalOfertaAberto} onClose={() => { setModalOfertaAberto(false); setProdutoParaEditar(null); }} />
    </ScrollView>
  );
}

const stylesLocal = StyleSheet.create({
    btnAcao: { width: '100%', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    btnTextoBranco: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
    btnTextoEscuro: { color: '#333', fontWeight: 'bold', fontSize: 15 }
});