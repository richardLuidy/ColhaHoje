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

// 🟢 Mantenha 10.0.2.2 já que você usa o emulador do Android Studio!
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

  const [imagemUri, setImagemUri] = useState<string | null>(null);

  const formatarPreco = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9,]/g, '');
    setPreco(apenasNumeros);
  };

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissao.granted === false) {
      Alert.alert("Permissão negada", "Precisamos de acesso à sua galeria para escolher uma foto.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7, 
    });

    if (!resultado.canceled) {
      setImagemUri(resultado.assets[0].uri); 
    }
  };

  useEffect(() => {
    const carregarDadosDaNuvem = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        
        if (idSalvo) {
          setProdutorId(parseInt(idSalvo));
          const response = await axios.get(`${API_URL}/produtor/dados/${idSalvo}`);
          const dadosDaNuvem = response.data;

          setNomeProdutor(dadosDaNuvem.nome);
          setLocalizacao(dadosDaNuvem.localizacao);

          if (dadosDaNuvem.endereco_id) {
            setEnderecoId(dadosDaNuvem.endereco_id);
          }
        }
      } catch (error) {
        console.error("❌ ERRO AO BUSCAR DADOS!", error);
      }
    };
    carregarDadosDaNuvem();
  }, []);

  const aumentarQuantidade = () => setQuantidade(quantidade + 1);
  const diminuirQuantidade = () => quantidade > 1 && setQuantidade(quantidade - 1);

  // ==========================================================
  // 🟢 NOVA FUNÇÃO FINALIZAR CADASTRO (COM UPLOAD DE IMAGEM REAL)
  // ==========================================================
  const finalizarCadastro = async () => {
    if (!nomeProduto || !preco || !produtorId || !enderecoId) {
      Alert.alert("Erro", "Por favor, preencha o nome do produto, preço e verifique se você tem um endereço cadastrado.");
      return;
    }

    try {
      setLoading(true);

      // 1. Criamos o "caminhão de entrega" FormData
      const formData = new FormData();
      
      // 2. Colocamos todos os textos lá dentro
      formData.append('nome_produto', nomeProduto);
      formData.append('nome_produtor', nomeProdutor);
      formData.append('localizacao', localizacao);
      formData.append('categoria', categoriaSelecionada);
      formData.append('preco', parseFloat(preco.replace(',', '.')).toString());
      formData.append('unidade', unidade);
      formData.append('quantidade', quantidade.toString());
      formData.append('produtor_id', produtorId.toString());
      formData.append('endereco_id', enderecoId.toString());

      // 3. Se o usuário escolheu uma foto, nós a empacotamos
      if (imagemUri) {
        const filename = imagemUri.split('/').pop() || 'foto.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('imagem', {
          uri: imagemUri,
          name: filename,
          type: type,
        } as any); 
      }

      // 4. Mandamos o caminhão para o servidor
      const response = await axios.post(`${API_URL}/produtos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // 🟢 A MÁGICA AQUI: O alerta aguarda o clique no botão "OK" para chamar o onVoltar()
        Alert.alert(
          "Sucesso!", 
          "Seu produto já está na nuvem ColhaHoje com a foto!",
          [
            {
              text: "OK",
              onPress: () => {
                onVoltar(); // Só executa depois que o produtor clicar em OK
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao enviar produto:", error);
      Alert.alert("Erro na Nuvem", "Não foi possível salvar o produto e a foto agora.");
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
          onChangeText={setNomeProdutor}
        />

        <Text style={styles.labelGeralCadastrar}>Localização:</Text>
        <TextInput
          style={[styles.inputGeralCadastrar, styles.inputDesativadoCadastrar]}
          value={localizacao}
          onChangeText={setLocalizacao}
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