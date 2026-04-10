import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import styles from '../../styles'; 
import { colors } from '../../colors';

const categoriasAtivas = ['Frutas', 'Legumes', 'Verduras', 'Raízes', 'Orgânicos'];
const unidadesAgricolas = ['Caixa', 'Saco', 'Maço', 'Kg', 'Unidade', 'Bandeja', 'Dúzia'];


const API_URL = 'http://10.0.2.2:3000';

interface CadastrarProdutoProps {
  onVoltar: () => void;
}

export default function CadastrarProduto({ onVoltar }: CadastrarProdutoProps) {

  const [loading, setLoading] = useState(false);
  const [produtorId, setProdutorId] = useState<number | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);

  const [nomeProduto, setNomeProduto] = useState('');
  const [nomeProdutor, setNomeProdutor] = useState(''); 
  const [localizacao, setLocalizacao] = useState('');   
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Frutas');
  const [preco, setPreco] = useState('');
  const [unidade, setUnidade] = useState('Caixa');
  const [quantidade, setQuantidade] = useState(1); 

  // 🟢 NOVO: Função que arranca qualquer letra e deixa só número e vírgula
  const formatarPreco = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9,]/g, '');
    setPreco(apenasNumeros);
  };

  useEffect(() => {
    const carregarDadosDaNuvem = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        console.log("🔍 DEBUG - ID Salvo no celular:", idSalvo); 
        
        if (idSalvo) {
          setProdutorId(parseInt(idSalvo));

          console.log(`🔍 DEBUG - Buscando dados na URL: ${API_URL}/produtor/dados/${idSalvo}`); 
          const response = await axios.get(`${API_URL}/produtor/dados/${idSalvo}`);
          const dadosDaNuvem = response.data;

          console.log("🔍 DEBUG - Dados que vieram da Nuvem:", dadosDaNuvem); 

          setNomeProdutor(dadosDaNuvem.nome);
          setLocalizacao(dadosDaNuvem.localizacao);
          
          if (dadosDaNuvem.endereco_id) {
             setEnderecoId(dadosDaNuvem.endereco_id);
          }
        } else {
          console.log("⚠️ NENHUM ID ENCONTRADO - O usuário fez login?");
        }
      } catch (error) {
        console.error("❌ ERRO AO BUSCAR DADOS! Verifique o seu IP e o servidor Node.", error);
      }
    };
    carregarDadosDaNuvem();
  }, []);

  const aumentarQuantidade = () => setQuantidade(quantidade + 1);
  const diminuirQuantidade = () => quantidade > 1 && setQuantidade(quantidade - 1);

  const finalizarCadastro = async () => {
    if (!nomeProduto || !preco || !produtorId || !enderecoId) {
      Alert.alert("Erro", "Por favor, preencha o nome do produto, preço e verifique se você tem um endereço cadastrado.");
      return;
    }

    const dadosParaEnvio = {
      nome_produto: nomeProduto,
      nome_produtor: nomeProdutor,
      localizacao: localizacao,
      categoria: categoriaSelecionada,
      preco: parseFloat(preco.replace(',', '.')), 
      unidade: unidade,
      quantidade: quantidade,
      produtor_id: produtorId,
      endereco_id: enderecoId, 
      imagem_url: '' 
    };

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/produtos`, dadosParaEnvio);

      if (response.status === 201) {
        Alert.alert("Sucesso!", "Seu produto já está na nuvem ColhaHoje!");
        onVoltar(); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro na Nuvem", "Não foi possível salvar o produto agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.telaTodaCadastrar}>
      <ScrollView style={styles.containerScrollCadastrar} showsVerticalScrollIndicator={false}>
        <Text style={styles.tituloPaginaCadastrar}>Cadastrar Produto</Text>

        {/* ÁREA DE FOTOS */}
        <View style={styles.areaFotosCadastrar}>
           <View style={styles.fotoPrincipalCadastrar}>
             <Ionicons name="camera" size={50} color={colors.cinzaTecnico} />
             <Text style={styles.textoFotoCadastrar}>Adicionar foto principal</Text>
           </View>
        </View>

        {/* INPUTS GERAIS */}
        <Text style={styles.labelGeralCadastrar}>Nome do Produto:</Text>
        <TextInput 
          style={styles.inputGeralCadastrar} 
          placeholder="ex: Morango Orgânico do Vale" 
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />

        <Text style={styles.labelGeralCadastrar}>Nome do Produtor:</Text>
        <TextInput 
          style={[styles.inputGeralCadastrar, styles.inputDesativadoCadastrar]} 
          value={nomeProdutor}
          editable={false}
        />

        <Text style={styles.labelGeralCadastrar}>Localização:</Text>
        <TextInput 
          style={[styles.inputGeralCadastrar, styles.inputDesativadoCadastrar]} 
          value={localizacao}
          editable={false}
        />

        {/* CATEGORIAS */}
        <Text style={styles.labelCategoriaCadastrar}>Categoria</Text>
        <View style={styles.categoriaContainerCadastrar}>
          {categoriasAtivas.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chipBaseCadastrar, categoriaSelecionada === cat ? styles.chipAtivoCadastrar : styles.chipInativoCadastrar]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text style={categoriaSelecionada === cat ? styles.textoChipAtivoCadastrar : styles.textoChipInativoCadastrar}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PREÇO E UNIDADE */}
        <View style={styles.linhaDuplaCadastrar}>
          <View style={styles.colunaEsquerdaCadastrar}>
            <Text style={styles.labelGeralCadastrar}>Preço de venda:</Text>
            <View style={styles.inputPrecoBoxCadastrar}>
              <Text style={styles.moedaTextCadastrar}>R$:</Text>
              {/* 🟢 ALTERADO: Agora usa o formatarPreco em vez do setPreco direto */}
              <TextInput 
                style={styles.inputPrecoCadastrar} 
                keyboardType="numeric" 
                placeholder="0,00" 
                value={preco} 
                onChangeText={formatarPreco} 
              />
            </View>
          </View>

          <View style={styles.colunaDireitaCadastrar}>
            <Text style={styles.labelGeralCadastrar}>Unidade:</Text>
            <View style={styles.pickerBoxCadastrar}>
              <Picker selectedValue={unidade} onValueChange={(itemValue) => setUnidade(itemValue)} style={styles.pickerCadastrar} mode="dropdown">
                {unidadesAgricolas.map((und) => <Picker.Item key={und} label={und} value={und} />)}
              </Picker>
            </View>
          </View>
        </View>

        {/* QUANTIDADE */}
        <Text style={styles.labelGeralCadastrar}>Quantidade Disponível (Sacos, caixas, maços):</Text>
        <View style={styles.quantidadeContainerCadastrar}>
          <TouchableOpacity style={styles.btnQtdCadastrar} onPress={diminuirQuantidade}>
            <Text style={styles.btnQtdTextoCadastrar}>—</Text> 
          </TouchableOpacity>
          <View style={styles.numeroBoxCadastrar}>
            <Text style={styles.numeroTextoCadastrar}>{quantidade}</Text>
          </View>
          <TouchableOpacity style={styles.btnQtdCadastrar} onPress={aumentarQuantidade}>
            <Text style={styles.btnQtdTextoCadastrar}>+</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO FINAL */}
        <TouchableOpacity style={styles.btnCadastrarFinal} onPress={finalizarCadastro} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.branco} />
          ) : (
            <Text style={styles.textoBtnCadastrarFinal}>Cadastrar Produto</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}