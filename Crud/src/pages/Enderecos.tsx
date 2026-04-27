import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import styles from '../../styles';
import { colors } from '../../colors';
import { API_URL } from '../api'; 

interface EnderecosProps {
  onVoltar: () => void;
}

export default function Enderecos({ onVoltar }: EnderecosProps) {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState(''); 
  const [estado, setEstado] = useState(''); 

  const [loading, setLoading] = useState(false);
  const [produtorId, setProdutorId] = useState<number | null>(null);

  // 🔄 MUDANÇA 1: useEffect agora busca dados na API assim que a tela abre
  useEffect(() => {
    const sincronizarDadosComBanco = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        if (!idSalvo) return;
        
        const parsedId = parseInt(idSalvo);
        setProdutorId(parsedId);

        setLoading(true);
        // 🚀 Busca na Nuvem: Verifica se o usuário já tem endereço salvo no banco
        const response = await axios.get(`${API_URL}/enderecos/usuario/${parsedId}`);

        if (response.data && response.data.length > 0) {
          // Se encontrou dados na API, preenchemos o formulário
          const dadosDB = response.data[0]; 
          
          setCep(dadosDB.cep);
          setRua(dadosDB.rua);
          setBairro(dadosDB.bairro);
          setCidade(dadosDB.cidade);
          setEstado(dadosDB.estado);
          // Trata o número para não aparecer "S/N" no input se o produtor quiser editar
          setNumero(dadosDB.numero === 'S/N' ? '' : dadosDB.numero);
          
          // 🔄 Sincroniza o cache local (AsyncStorage) com os dados novos da nuvem
          await AsyncStorage.setItem('user_cep', dadosDB.cep);
          await AsyncStorage.setItem('user_rua', dadosDB.rua);
          await AsyncStorage.setItem('user_bairro', dadosDB.bairro);
          await AsyncStorage.setItem('user_cidade', dadosDB.cidade);
          await AsyncStorage.setItem('user_estado', dadosDB.estado);
        }
      } catch (e) {
        console.log("Erro ao sincronizar com a nuvem, mantendo dados locais.");
      } finally {
        setLoading(false);
      }
    };

    sincronizarDadosComBanco();
  }, []);

  const handleChangeCep = async (texto: string) => {
    let value = texto.replace(/\D/g, ''); 
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8); 
    }
    setCep(value);

    if (value.length === 9) {
      try {
        const limpo = value.replace('-', '');
        const res = await axios.get(`https://viacep.com.br/ws/${limpo}/json/`);
        if (!res.data.erro) {
          setRua(res.data.logradouro);
          setBairro(res.data.bairro);
          setCidade(res.data.localidade);
          setEstado(res.data.uf);
        } else {
          Alert.alert("Aviso", "CEP não encontrado.");
        }
      } catch (e) {
        console.log("Erro na busca do CEP");
      }
    }
  };

  const handleSalvar = async () => {
    if (!cep || !rua || !bairro || !cidade || !estado) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (!produtorId) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    try {
      setLoading(true);

      // 🟢 ADICIONADO AQUI: Pedido de permissão para usar o GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária', 
          'Precisamos da permissão de localização para marcar o seu endereço no mapa.'
        );
        setLoading(false); // Tira o loading se ele negar
        return; // Para a função aqui
      }

      const numFinal = numero.trim() === '' ? 'S/N' : numero;

      // Obter coordenadas do endereço
      let latitude = null;
      let longitude = null;
      try {
        const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}, ${cep}, Brasil`;
        const geocoded = await Location.geocodeAsync(enderecoCompleto);
        if (geocoded.length > 0) {
          latitude = geocoded[0].latitude;
          longitude = geocoded[0].longitude;
        }
      } catch (geoError) {
        console.warn('Não foi possível geocodificar o endereço:', geoError);
        // Continua sem coordenadas se geocoding falhar
      }

      // 🟢 Salvando na Nuvem
      const response = await axios.post(`${API_URL}/enderecos`, {
        cep,
        rua,
        numero: numFinal,
        bairro,
        cidade,
        estado,
        latitude,
        longitude,
        usuario_id: produtorId
      });

      if (response.status === 201) {
        // 🟢 Atualizando cache local
        await AsyncStorage.setItem('user_cep', cep);
        await AsyncStorage.setItem('user_rua', rua);
        await AsyncStorage.setItem('user_numero', numFinal);
        await AsyncStorage.setItem('user_bairro', bairro);
        await AsyncStorage.setItem('user_cidade', cidade);
        await AsyncStorage.setItem('user_estado', estado);

        Alert.alert("Sucesso", "Endereço salvo com sucesso!");
      }
    } catch (e: any) {
      // 🟢 O NOSSO ESPIÃO: vai imprimir o erro real no terminal do VS Code
      console.log("🔥 ERRO NA API:", e.response?.data || e.message);
      Alert.alert("Erro", "Não foi possível salvar na nuvem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerEnderecoCentral} showsVerticalScrollIndicator={false}>
      <View style={styles.headerEndereco}>
        <Text style={styles.tituloEndereco}>Meus Endereços</Text>
      </View>

      <Text style={styles.labelEndereco}>CEP</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputFieldEndereco} 
          value={cep} 
          onChangeText={handleChangeCep} 
          placeholder="00000-000" 
          keyboardType="numeric"
          maxLength={9}
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <Text style={styles.labelEndereco}>Rua / Logradouro</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputFieldEndereco} 
          value={rua} 
          onChangeText={setRua} 
          placeholder="ex: Estrada Municipal, km 12" 
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <Text style={styles.labelEndereco}>Bairro</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputFieldEndereco} 
          value={bairro} 
          onChangeText={setBairro} 
          placeholder="Ex: Bamburral"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <View style={styles.rowEndereco}>
        <View style={{ width: '70%' }}>
          <Text style={styles.labelEndereco}>Cidade</Text>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <TextInput 
              style={styles.inputFieldEndereco} 
              value={cidade} 
              onChangeText={setCidade} 
              placeholder="Ex: Registro"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        </View>

        <View style={{ width: '25%' }}>
          <Text style={styles.labelEndereco}>Estado</Text>
          <View style={[styles.inputContainer, { width: '100%' }]}>
            <TextInput 
              style={styles.inputFieldEndereco} 
              value={estado} 
              onChangeText={setEstado} 
              placeholder="SP"
              maxLength={2}
              autoCapitalize="characters"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        </View>
      </View>

      <Text style={styles.labelEndereco}>Nº (Opcional)</Text>
      <View style={[styles.inputContainer, { width: '45%' }]}>
        <TextInput 
          style={styles.inputFieldEndereco} 
          value={numero} 
          onChangeText={setNumero} 
          placeholder="Ex: 02"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <TouchableOpacity 
        style={styles.btnSalvarEndereco} 
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.buttonText}>Salvar Endereço</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}