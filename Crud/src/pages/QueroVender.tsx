import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [totalProdutos, setTotalProdutos] = useState<number | string>('...');
  const [listaProdutosEstoque, setListaProdutosEstoque] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [produtoParaEditar, setProdutoParaEditar] = useState<any>(null);

  const [filtroAtivo, setFiltroAtivo] = useState<'Todos' | 'Catálogo' | 'Ofertas'>('Todos');
  
  const [ofertasBrutas, setOfertasBrutas] = useState<any[]>([]);
  const [agora, setAgora] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setAgora(new Date().getTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const buscarDadosEstoque = useCallback(async () => {
    try {
      const idSalvo = await AsyncStorage.getItem('user_id');
      if (!idSalvo) {
        setTotalProdutos(0);
        setListaProdutosEstoque([]);
        return;
      }

      const responseContar = await axios.get(`${API_URL}/produtos/contar/${idSalvo}`, {
        params: { _cache: Date.now() }
      });
      if (responseContar.status === 200) setTotalProdutos(responseContar.data.total);

      const responseLista = await axios.get(`${API_URL}/produtos?produtor_id=${idSalvo}`, {
        params: { _cache: Date.now() }
      });
      if (responseLista.status === 200) setListaProdutosEstoque(responseLista.data);

      try {
        const responseOfertas = await axios.get(`${API_URL}/ofertas`);
        const minhasOft = responseOfertas.data.filter((o: any) => o.produto.produtor_id === parseInt(idSalvo));
        setOfertasBrutas(minhasOft);
      } catch (e) {
        console.log("Erro ao buscar ofertas", e);
      }

    } catch (error) {
      console.error("Erro ao buscar dados do estoque:", error);
      setTotalProdutos(0);
      setListaProdutosEstoque([]);
    }
  }, []);

  useEffect(() => {
    buscarDadosEstoque();
  }, [refreshKey, buscarDadosEstoque]);

  // 🟢 MENU INTELIGENTE ATUALIZADO
  const abrirMenuOpcoes = (produto: any) => {
    const ofertaExistente = ofertasBrutas.find(o => o.produto.id === produto.id);
    const taEmOferta = !!ofertaExistente;

    Alert.alert(
      "Gerenciar Produto",
      `O que deseja fazer com "${produto.nome_produto}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: taEmOferta ? "Gerenciar Oferta ⚡" : "Criar Oferta ⚡",
          onPress: () => {
            setProdutoParaEditar(produto);
            setModalOfertaAberto(true);
          }
        },
        {
          text: "Editar Produto 📦",
          onPress: () => {
            setProdutoParaEditar(produto);
            setAbrindoCadastro(true);
          }
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmarExclusao(produto.id, produto.nome_produto)
        }
      ]
    );
  };

  const confirmarExclusao = (id: number, nome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente apagar o produto "${nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, Excluir", style: "destructive", onPress: () => deletarProduto(id) }
      ]
    );
  };

  const deletarProduto = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/produtos/${id}`);
      if (response.status === 200) {
        Alert.alert("Sucesso", "Produto removido com sucesso!");
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    }
  };

  const fecharTudoEAtualizar = () => {
    setAbrindoCadastro(false);
    setVendoMinhasOfertas(false);
    setProdutoParaEditar(null);
    setTotalProdutos('...');
    setListaProdutosEstoque([]);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 500);
  };

  if (abrindoCadastro) {
    return <CadastrarProduto key={`cad-${refreshKey}`} onVoltar={fecharTudoEAtualizar} produtoEditando={produtoParaEditar} />;
  }

  if (vendoMinhasOfertas) {
    return <MinhasOfertas onVoltar={fecharTudoEAtualizar} />;
  }

  // 🟢 FILTRO DE SEGURANÇA: Esconde se a oferta expirou
  const produtosFiltrados = listaProdutosEstoque.filter((produto) => {
    const ofertaDesteProduto = ofertasBrutas.find(o => o.produto.id === produto.id);
    
    if (ofertaDesteProduto) {
      const dataExpiracao = new Date(ofertaDesteProduto.criado_em).getTime() + (ofertaDesteProduto.duracao_minutos * 60 * 1000);
      const expirou = dataExpiracao <= agora;

      if (expirou) return false; // SOME DA LISTA se expirou (sua ideia de segurança)
      
      if (filtroAtivo === 'Catálogo') return false;
    } else {
      if (filtroAtivo === 'Ofertas') return false;
    }

    return true; 
  });

  return (
    <ScrollView key={`dash-${refreshKey}`} contentContainerStyle={styles.containerQueroVenderSério} showsVerticalScrollIndicator={false}>
      <Text style={styles.tituloSessaoItalicoSério}>Dashboard</Text>

      <View style={styles.rowCardsSério}>
        <View style={styles.cardPequenoSério}>
          <Text style={styles.cardLabelSério}>Vendas do Dia</Text>
          <Text style={styles.cardValorSério}>R$ 0,00</Text>
          <View style={styles.areaInfoVendasSério}>
            <View style={styles.areaGreyDotsSério}>
              {[...Array(6)].map((_, i) => <View key={i} style={styles.greyDotSério} />)}
            </View>
            <View style={styles.badgeVerdeSério}>
              <Text style={styles.badgeTextoSério}>+0%</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardPequenoSério}>
          <Text style={styles.cardLabelSério}>Produtos Ativos</Text>
          <Text style={styles.cardValorSério}>{totalProdutos}</Text>
          <View style={styles.areaPlantIconsSério}>
            <Ionicons name="nutrition-outline" size={20} color="#999" />
            <Ionicons name="leaf-outline" size={20} color="#999" />
            <Ionicons name="flower-outline" size={20} color="#999" />
          </View>
        </View>
      </View>

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

      
      <Text style={[styles.tituloSessaoSério, { marginTop: 30, marginBottom: 15 }]}>
        Central do Produtor
      </Text>
      
      <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 5 }}>
        {['Todos', 'Catálogo', 'Ofertas'].map(filtro => (
          <TouchableOpacity
            key={filtro}
            onPress={() => setFiltroAtivo(filtro as any)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: filtroAtivo === filtro ? colors.verdeColheita : '#F0F0F0',
              marginRight: 10,
            }}
          >
            <Text style={{
              color: filtroAtivo === filtro ? '#FFF' : colors.placeholder,
              fontWeight: 'bold',
              fontSize: 12
            }}>
              {filtro}
            </Text>
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
                <Text style={styles.precoEstoqueSério}>
                  R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                  <Text style={styles.unidadeEstoqueSério}> / {produto.unidade}</Text>
                </Text>
                <Text style={styles.quantidadeEstoqueSério}>{produto.quantidade} unid.</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnOpcoesEstoqueSério}
              onPress={() => abrirMenuOpcoes(produto)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.placeholder} />
            </TouchableOpacity>
          </View>
        );
      })}

      {produtosFiltrados.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: colors.placeholder }}>
          Nenhum produto encontrado neste filtro.
        </Text>
      )}

      <View style={{ height: 40 }} />

      <OfertaRelampago 
        visivel={modalOfertaAberto} 
        onClose={() => {
            setModalOfertaAberto(false);
            setProdutoParaEditar(null);
        }} 
      />
    </ScrollView>
  );
}