import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles';
import { colors } from '../../colors';

// Precisamos dessa prop para a tela saber como "voltar" para o menu do perfil
interface DadosPessoaisProps {
  onVoltar: () => void;
}

export default function DadosPessoais({ onVoltar }: DadosPessoaisProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const handleChangeTelefone = (texto: string) => {
    // Tira tudo que não é número
    let num = texto.replace(/\D/g, '');

    // Limita em 11 dígitos (máximo do celular com DDD)
    num = num.substring(0, 11);

    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (num.length > 2) {
      num = `(${num.substring(0, 2)}) ${num.substring(2)}`;
    }
    
    if (num.length > 9) {
      // Se tiver 11 números, o traço fica depois do 5º dígito do número (Celular)
      // Se tiver 10, o traço fica depois do 4º dígito (Fixo)
      const isCelular = num.length === 15; // (XX) XXXXX-XXXX tem 15 caracteres total
      
      if (num.length >= 14) { // Formato celular ou fixo completo
         // Essa regex ajusta o traço dependendo se sobrou 4 ou 5 números no final
         num = num.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      }
    }

    setTelefone(num);
  };

  const [documento, setDocumento] = useState(''); // CPF ou CNPJ
  
  // Função que aplica a máscara dinamicamente
  const handleChangeDocumento = (texto: string) => {
    // Primeiro, tira tudo que não for número (letras, espaços, etc)
    let num = texto.replace(/\D/g, '');

    // Se tiver até 11 dígitos, formata como CPF
    if (num.length <= 11) {
      num = num.replace(/(\d{3})(\d)/, '$1.$2');
      num = num.replace(/(\d{3})(\d)/, '$1.$2');
      num = num.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } 
    // Se passar de 11, formata como CNPJ
    else {
      num = num.substring(0, 14); // Trava o máximo em 14 números
      num = num.replace(/^(\d{2})(\d)/, '$1.$2');
      num = num.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      num = num.replace(/\.(\d{3})(\d)/, '.$1/$2');
      num = num.replace(/(\d{4})(\d)/, '$1-$2');
    }

    // Atualiza o estado com o valor já formatado
    setDocumento(num);
  };

  // 🟢 ATUALIZADO: Agora puxa os 4 dados da memória
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const nomeSalvo = await AsyncStorage.getItem('user_name');
        const emailSalvo = await AsyncStorage.getItem('user_email');
        const docSalvo = await AsyncStorage.getItem('user_documento'); 
        const telSalvo = await AsyncStorage.getItem('user_telefone'); 
        
        if (nomeSalvo) setNome(nomeSalvo);
        if (emailSalvo) setEmail(emailSalvo);
        if (docSalvo) setDocumento(docSalvo);
        if (telSalvo) setTelefone(telSalvo);
      } catch (e) {
        console.error("Erro ao carregar os dados:", e);
      }
    };
    carregarDados();
  }, []);

  // 🟢 ATUALIZADO: Agora salva os 4 dados na memória antes de voltar
  const handleSalvar = async () => { 
    try {
      await AsyncStorage.setItem('user_name', nome);
      await AsyncStorage.setItem('user_email', email);
      await AsyncStorage.setItem('user_documento', documento);
      await AsyncStorage.setItem('user_telefone', telefone);

      console.log("Dados que iriam para o banco:", { nome, email, telefone, documento });
      Alert.alert("Sucesso", "Seus dados foram atualizados!");
      onVoltar(); // Volta para o menu do perfil após salvar
    } catch (e) {
      console.error("Erro ao salvar dados", e);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
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
      <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 20 }]} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}