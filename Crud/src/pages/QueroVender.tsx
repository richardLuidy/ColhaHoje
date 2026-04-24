import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../../styles';
import { colors } from '../../colors';
import { API_URL } from '../../api';

import CadastrarProduto from './CadastrarProduto';
import OfertaRelampago from '../components/OfertaRelampago';

interface QueroVenderProps {
  onVoltar: () => void;
}

export default function QueroVender({ onVoltar }: QueroVenderProps) {
  const [abrindoCadastro, setAbrindoCadastro] = useState(false);
  const [modalOfertaAberto, setModalOfertaAberto] = useState(false);
  const [totalProdutos, setTotalProdutos] = useState<number | string>('...'); 
  const [listaProdutosEstoque, setListaProdutosEstoque] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🟢 ESTADO PARA EDIÇÃO
  const [produtoParaEditar, setProdutoParaEditar] = useState<any>(null);

  const API_URL = 'http://10.0.2.2:3000';

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
      
      if (responseContar.status === 200) {
        setTotalProdutos(responseContar.data.total); 
      }

      const responseLista = await axios.get(`${API_URL}/produtos?produtor_id=${idSalvo}`, {
        params: { _cache: Date.now() }
      });
      
      if (responseLista.status === 200) {
         setListaProdutosEstoque(responseLista.data);
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

  // 🟢 MENU DE OPÇÕES (EDITAR / EXCLUIR)
  const abrirMenuOpcoes = (produto: any) => {
    Alert.alert(
      "Gerenciar Produto",
      `O que deseja fazer com "${produto.nome_produto}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Editar", 
          onPress: () => {
            setProdutoParaEditar(produto); // Carrega os dados para a edição
            setAbrindoCadastro(true);      // Abre a tela
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

  const fecharCadastroEAtualizar = () => {
    setAbrindoCadastro(false);
    setProdutoParaEditar(null); // 🟢 Limpa o estado de edição ao fechar
    setTotalProdutos('...'); 
    setListaProdutosEstoque([]); 
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);
  };

  if (abrindoCadastro) {
    return (
      <CadastrarProduto 
        key={`cad-${refreshKey}`} 
        onVoltar={fecharCadastroEAtualizar} 
        produtoEditando={produtoParaEditar} // 🟢 Passa os dados para a tela de cadastro
      />
    );
  }

  return (
    <ScrollView 
      key={`dash-${refreshKey}`} 
      contentContainerStyle={styles.containerQueroVenderSério} 
      showsVerticalScrollIndicator={false}
    >
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

        <TouchableOpacity style={styles.btnVerPedidosOuterSério}>
          <Text style={styles.textoBtnBrancoSério}>Ver pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRedondoFlutuanteSério} onPress={() => setModalOfertaAberto(true)}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.textoIconeFlutuanteSério}>Criar oferta</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.tituloSessaoSério, { marginTop: 25, marginBottom: 10 }]}>Gerenciar Estoque</Text>

      <TouchableOpacity style={styles.cardCadastrarNovoSério} onPress={() => setAbrindoCadastro(true)}>
          <Ionicons name="add-circle" size={40} color={colors.verdeColheita} />
          <View style={styles.infoEstoqueSério}>
             <Text style={styles.tituloEstoqueSério}>Adicionar Produto ao Catálogo</Text>
             <Text style={styles.descEstoqueSério}>Cadastre sua colheita para venda regular sem prazo.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.placeholder} />
      </TouchableOpacity>

      {listaProdutosEstoque.map((produto) => (
          <View key={produto.id} style={styles.cardEstoqueSério}>
            {produto.imagem_url ? (
               <Image source={{ uri: `${API_URL}${produto.imagem_url}` }} style={styles.imagemEstoqueSério} />
            ) : (
               <View style={styles.quadradoPlaceholderSério}>
                  <Ionicons name="leaf-outline" size={30} color={colors.placeholder} />
               </View>
            )}

            <View style={styles.infoEstoqueListSério}>
                <View style={styles.linhaCategoriaBadgeSério}>
                    <View style={styles.badgeCategoriaRealSério}>
                        <Text style={styles.badgeCategoriaTextRealSério}>{produto.categoria}</Text>
                    </View>
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
      ))}

      {listaProdutosEstoque.length === 0 && totalProdutos === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.placeholder }}>
            Você ainda não tem produtos cadastrados.
          </Text>
      )}

      <View style={{ height: 40 }} />

      <OfertaRelampago visivel={modalOfertaAberto} onClose={() => setModalOfertaAberto(false)} />
    </ScrollView>
  );
}