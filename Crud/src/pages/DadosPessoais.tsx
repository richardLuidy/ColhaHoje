import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // 🟢 1. Importando o Axios para falar com a nuvem
import styles from '../../styles';
import { colors } from '../../colors';

// 🟢 2. Configurando o IP do servidor (confirme se é esse mesmo que você usa)
const API_URL = 'http://10.0.2.2:3000'; 

interface DadosPessoaisProps {
  onVoltar: () => void;
}

export default function DadosPessoais({ onVoltar }: DadosPessoaisProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState(''); 
  const [loading, setLoading] = useState(false); // 🟢 Controle de loading
  
  const handleChangeTelefone = (texto: string) => {
    let num = texto.replace(/\D/g, '');
    num = num.substring(0, 11);

    if (num.length > 2) {
      num = `(${num.substring(0, 2)}) ${num.substring(2)}`;
    }
    
    if (num.length > 9) {
      if (num.length >= 14) { 
         num = num.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      }
    }
    setTelefone(num);
  };

  const handleChangeDocumento = (texto: string) => {
    let num = texto.replace(/\D/g, '');

    if (num.length <= 11) {
      num = num.replace(/(\d{3})(\d)/, '$1.$2');
      num = num.replace(/(\d{3})(\d)/, '$1.$2');
      num = num.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      num = num.substring(0, 14); 
      num = num.replace(/^(\d{2})(\d)/, '$1.$2');
      num = num.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      num = num.replace(/\.(\d{3})(\d)/, '.$1/$2');
      num = num.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setDocumento(num);
  };

  // 🟢 3. BUSCANDO DA NUVEM QUANDO A TELA ABRE
  useEffect(() => {
    const carregarDadosDaNuvem = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        if (!idSalvo) return;

        // Bate na API para pegar os dados fresquinhos do banco
        const response = await axios.get(`${API_URL}/usuarios/${idSalvo}`);
        
        if (response.data) {
          setNome(response.data.nome);
          setEmail(response.data.email);
          
          // AQUI ESTÁ A MÁGICA: O banco devolve 'whatsapp' e 'cpf_cnpj'
          // E nós guardamos nas variáveis que a tela já usa:
          setTelefone(response.data.whatsapp || '');
          setDocumento(response.data.cpf_cnpj || '');
        }
      } catch (e) {
        console.error("Erro ao carregar da nuvem:", e);
      }
    };
    
    carregarDadosDaNuvem();
  }, []);

  // 🟢 4. ENVIANDO PARA A NUVEM AO SALVAR
  const handleSalvar = async () => { 
    try {
      const idSalvo = await AsyncStorage.getItem('user_id');
      if (!idSalvo) {
        Alert.alert("Erro", "Sessão não encontrada. Faça login novamente.");
        return;
      }

      setLoading(true);

      // MÁGICA 2: Mandando para o banco com os nomes que ele entende
      await axios.put(`${API_URL}/usuarios/${idSalvo}`, {
        nome: nome,
        email: email,
        whatsapp: telefone, // A variável é telefone, mas o banco recebe whatsapp
        cpf_cnpj: documento // A variável é documento, mas o banco recebe cpf_cnpj
      });

      // Atualiza o cache local por garantia
      await AsyncStorage.setItem('user_name', nome);
      await AsyncStorage.setItem('user_email', email);
      await AsyncStorage.setItem('user_documento', documento);
      await AsyncStorage.setItem('user_telefone', telefone);

      Alert.alert("Sucesso", "Seus dados foram salvos na nuvem!");
      onVoltar(); 
    } catch (e) {
      console.error("Erro ao salvar dados na nuvem", e);
      Alert.alert("Erro", "Não foi possível salvar na nuvem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.containerLogin, { paddingTop: 20 }]} showsVerticalScrollIndicator={false}>
      
      <View style={{ marginBottom: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.verdeColheita }}>
          Meus Dados Pessoais
        </Text>
      </View>

      {/* 👤 Campo Nome */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        Nome Completo
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={nome} 
          onChangeText={setNome} 
          placeholder="Digite seu nome" 
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* ✉️ Campo Email */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        E-mail
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="seu@email.com" 
          keyboardType="email-address"
          placeholderTextColor={colors.placeholder}
          editable={false} // E-mail geralmente não deve ser editável após cadastro
        />
      </View>

      {/* 📄 Campo CPF/CNPJ */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        CPF / CNPJ
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={documento} 
          onChangeText={handleChangeDocumento} 
          placeholder="Ex: 000.000.000-00" 
          keyboardType="numeric"
          maxLength={18}
          placeholderTextColor={colors.placeholder}
        />
      </View>

     {/* 📱 Campo Telefone */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        Número de Celular
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={telefone} 
          onChangeText={handleChangeTelefone} 
          placeholder="Ex: (11) 99999-9999" 
          keyboardType="phone-pad"
          maxLength={15} 
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* 💾 Botão Salvar */}
      <TouchableOpacity 
        style={[styles.buttonPrimary, { marginTop: 20 }]} 
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
           <ActivityIndicator color={colors.branco} />
        ) : (
           <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}