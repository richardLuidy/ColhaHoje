import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import styles from '../../styles';
import { colors } from '../../colors';

const categoriasAtivas = ['Frutas', 'Legumes', 'Verduras', 'Raízes', 'Orgânicos'];
const unidadesAgricolas = ['Caixa', 'Saco', 'Maço', 'Kg', 'Unidade', 'Bandeja', 'Dúzia'];

import { API_URL } from '../../api'; 

interface CadastrarProdutoProps {
  onVoltar: () => void;
  produtoEditando?: any; // 🟢 Recebe os dados se for uma edição
}

export default function CadastrarProduto({ onVoltar, produtoEditando }: CadastrarProdutoProps) {

  const [loading, setLoading] = useState(false);
  const [produtorId, setProdutorId] = useState<number | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);

  const [nomeProduto, setNomeProduto] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Frutas');
  const [preco, setPreco] = useState('');
  const [unidade, setUnidade] = useState('Caixa');
  const [quantidade, setQuantidade] = useState(1);
  const [imagemUri, setImagemUri] = useState<string | null>(null);

  // 🟢 Lógica para preencher os campos se estiver EDITANDO
  useEffect(() => {
    if (produtoEditando) {
      setNomeProduto(produtoEditando.nome_produto);
      setCategoriaSelecionada(produtoEditando.categoria);
      setPreco(produtoEditando.preco.toString().replace('.', ','));
      setUnidade(produtoEditando.unidade);
      setQuantidade(produtoEditando.quantidade);
      setImagemUri(produtoEditando.imagem_url); // Carrega a foto atual
    }
  }, [produtoEditando]);

  useEffect(() => {
    const carregarDadosDaNuvem = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        if (idSalvo) {
          setProdutorId(parseInt(idSalvo));
          const response = await axios.get(`${API_URL}/produtor/dados/${idSalvo}`);
          const dadosDaNuvem = response.data;
          if (dadosDaNuvem.endereco_id) setEnderecoId(dadosDaNuvem.endereco_id);
        }
      } catch (error) {
        console.error("❌ ERRO AO BUSCAR DADOS!", error);
      }
    };
    carregarDadosDaNuvem();
  }, []);

  const formatarPreco = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9,]/g, '');
    setPreco(apenasNumeros);
  };

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão negada", "Precisamos de acesso à sua galeria.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7, 
    });
    if (!resultado.canceled) setImagemUri(resultado.assets[0].uri); 
  };

  const aumentarQuantidade = () => setQuantidade(quantidade + 1);
  const diminuirQuantidade = () => quantidade > 1 && setQuantidade(quantidade - 1);

  // 🟢 FINALIZAR (DINÂMICO: POST OU PUT)
  const finalizarCadastro = async () => {
    if (!nomeProduto || !preco || !produtorId) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }

    if (!enderecoId) {
      Alert.alert(
        "Endereço Necessário",
        "Você precisa cadastrar um endereço antes de vender produtos. Vá para o menu Perfil > Endereços para adicionar um endereço.",
        [
          { text: "Voltar", style: "cancel" },
          { text: "Ir para Endereços", onPress: onVoltar } // Volta para o menu do perfil
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nome_produto', nomeProduto);
      formData.append('categoria', categoriaSelecionada);
      formData.append('preco', parseFloat(preco.replace(',', '.')).toString());
      formData.append('unidade', unidade);
      formData.append('quantidade', quantidade.toString());
      formData.append('produtor_id', produtorId.toString());
      formData.append('endereco_id', enderecoId.toString());

      // Só envia a imagem se ela for uma URI local (uma foto nova escolhida agora)
      if (imagemUri && !imagemUri.startsWith('http')) {
        const filename = imagemUri.split('/').pop() || 'foto.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append('imagem', { uri: imagemUri, name: filename, type } as any); 
      }

      // 🟢 O PULO DO GATO: Decide se usa POST (novo) ou PUT (editar)
      const config = {
        method: produtoEditando ? 'put' : 'post',
        url: produtoEditando ? `${API_URL}/produtos/${produtoEditando.id}` : `${API_URL}/produtos`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const response = await axios(config);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Sucesso!", 
          produtoEditando ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!",
          [{ text: "OK", onPress: () => onVoltar() }]
        );
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.telaTodaCadastrar}>
      <ScrollView style={styles.containerScrollCadastrar} showsVerticalScrollIndicator={false}>
        {/* Título Dinâmico */}
        <Text style={styles.tituloPaginaCadastrar}>
            {produtoEditando ? "Editar Produto" : "Cadastrar Produto"}
        </Text>

        <View style={styles.areaFotosCadastrar}>
          <TouchableOpacity style={styles.fotoPrincipalCadastrar} onPress={escolherFoto}>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            ) : (
              <>
                <Ionicons name="camera" size={50} color={colors.cinzaTecnico} />
                <Text style={styles.textoFotoCadastrar}>Adicionar foto principal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.labelGeralCadastrar}>Nome do Produto:</Text>
        <TextInput style={styles.inputGeralCadastrar} value={nomeProduto} onChangeText={setNomeProduto} />

        <Text style={styles.labelGeralCadastrar}>Nome do Produtor:</Text>
        <TextInput style={[styles.inputGeralCadastrar, styles.inputDesativadoCadastrar]} value={nomeProdutor} editable={false} />

        <Text style={styles.labelGeralCadastrar}>Localização:</Text>
        <TextInput style={[styles.inputGeralCadastrar, styles.inputDesativadoCadastrar]} value={localizacao} editable={false} />

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

        <View style={styles.linhaDuplaCadastrar}>
          <View style={styles.colunaEsquerdaCadastrar}>
            <Text style={styles.labelGeralCadastrar}>Preço de venda:</Text>
            <View style={styles.inputPrecoBoxCadastrar}>
              <Text style={styles.moedaTextCadastrar}>R$:</Text>
              <TextInput style={styles.inputPrecoCadastrar} keyboardType="numeric" value={preco} onChangeText={formatarPreco} />
            </View>
          </View>
          <View style={styles.colunaDireitaCadastrar}>
            <Text style={styles.labelGeralCadastrar}>Unidade:</Text>
            <View style={styles.pickerBoxCadastrar}>
              <Picker selectedValue={unidade} onValueChange={(v) => setUnidade(v)} style={styles.pickerCadastrar} mode="dropdown">
                {unidadesAgricolas.map((und) => <Picker.Item key={und} label={und} value={und} />)}
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.labelGeralCadastrar}>Quantidade Disponível:</Text>
        <View style={styles.quantidadeContainerCadastrar}>
          <TouchableOpacity style={styles.btnQtdCadastrar} onPress={diminuirQuantidade}><Text style={styles.btnQtdTextoCadastrar}>—</Text></TouchableOpacity>
          <View style={styles.numeroBoxCadastrar}><Text style={styles.numeroTextoCadastrar}>{quantidade}</Text></View>
          <TouchableOpacity style={styles.btnQtdCadastrar} onPress={aumentarQuantidade}><Text style={styles.btnQtdTextoCadastrar}>+</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnCadastrarFinal} onPress={finalizarCadastro} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.branco} />
          ) : (
            <Text style={styles.textoBtnCadastrarFinal}>
                {produtoEditando ? "Salvar Alterações" : "Cadastrar Produto"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}