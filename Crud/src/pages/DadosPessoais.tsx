import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles';
import { colors } from '../../colors';

// 🟢 IMPORTAÇÃO CENTRALIZADA: Usa o IP correto que definimos no api.ts
import api from '../api'; 

interface DadosPessoaisProps {
  onVoltar: () => void;
}

export default function DadosPessoais({ onVoltar }: DadosPessoaisProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true); // Para o loading inicial
  
  // 🟢 MÁSCARA DE TELEFONE
  const handleChangeTelefone = (texto: string) => {
    let num = texto.replace(/\D/g, '');
    num = num.substring(0, 11);
    if (num.length > 2) num = `(${num.substring(0, 2)}) ${num.substring(2)}`;
    if (num.length > 9) num = num.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    setTelefone(num);
  };

  // 🟢 MÁSCARA DE CPF/CNPJ
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

  // 🟢 BUSCANDO DADOS DA API AO ABRIR A TELA
  useEffect(() => {
    const carregarDadosDaNuvem = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem('user_id');
        if (!idSalvo) {
            setCarregandoDados(false);
            return;
        }

        const response = await api.get(`/usuarios/${idSalvo}`);
        
        if (response.data) {
          setNome(response.data.nome || '');
          setEmail(response.data.email || '');
          // O banco usa 'whatsapp' e 'cpf_cnpj', mas nossa tela usa 'telefone' e 'documento'
          setTelefone(response.data.whatsapp || '');
          setDocumento(response.data.cpf_cnpj || '');
        }
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setCarregandoDados(false);
      }
    };
    
    carregarDadosDaNuvem();
  }, []);

  // 🟢 SALVANDO AS ALTERAÇÕES NA API
  const handleSalvar = async () => { 
    try {
      const idSalvo = await AsyncStorage.getItem('user_id');
      if (!idSalvo) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        return;
      }

      setLoading(true);

      // Enviando para o seu CRUD Node.js
      await api.put(`/usuarios/${idSalvo}`, {
        nome: nome,
        email: email,
        whatsapp: telefone, // mapeando para o campo do banco
        cpf_cnpj: documento  // mapeando para o campo do banco
      });

      // Atualiza o cache local para o nome mudar na Home imediatamente
      await AsyncStorage.setItem('user_name', nome);

      Alert.alert("Sucesso", "Seus dados foram atualizados com sucesso!");
      onVoltar(); 
    } catch (e) {
      console.error("Erro ao salvar:", e);
      Alert.alert("Erro de Conexão", "Não foi possível salvar. Verifique se o servidor está rodando no IP correto.");
    } finally {
      setLoading(false);
    }
  };

  if (carregandoDados) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.verdeColheita} />
            <Text style={{ marginTop: 10, color: colors.cinzaTecnico }}>Buscando seus dados...</Text>
        </View>
    );
  }

  return (
    <ScrollView 
        contentContainerStyle={[styles.containerLogin, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
    >
      
      <View style={{ marginBottom: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.verdeColheita }}>
          Meus Dados Pessoais
        </Text>
      </View>

      {/* Nome Completo */}
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

      {/* E-mail (Somente leitura para segurança) */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        E-mail
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: '#f5f5f5' }]}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10, color: '#888' }]} 
          value={email} 
          editable={false} 
        />
      </View>

      {/* CPF / CNPJ */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        CPF / CNPJ
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={documento} 
          onChangeText={handleChangeDocumento} 
          placeholder="000.000.000-00" 
          keyboardType="numeric"
          maxLength={18}
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* Telefone */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        Número de Celular
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={telefone} 
          onChangeText={handleChangeTelefone} 
          placeholder="(13) 99999-9999" 
          keyboardType="phone-pad"
          maxLength={15} 
          placeholderTextColor={colors.placeholder}
        />
      </View>

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