import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../../styles';
import { colors } from '../../colors';

interface EnderecosProps {
  onVoltar: () => void;
}

export default function Enderecos({ onVoltar }: EnderecosProps) {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');

  // ⚡ Máscara de CEP (00000-000)
  const handleChangeCep = (texto: string) => {
    let value = texto.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    setCep(value);
  };

  return (
    <ScrollView contentContainerStyle={[styles.containerLogin, { paddingTop: 20 }]} showsVerticalScrollIndicator={false}>
      
      <View style={{ marginBottom: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.verdeColheita }}>
          Meus Endereços
        </Text>
      </View>

      {/* 📍 CEP */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        CEP
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={cep} 
          onChangeText={handleChangeCep} 
          placeholder="00000-000" 
          keyboardType="numeric"
          maxLength={9}
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* 🛣️ Rua / Logradouro */}
      <Text style={{ width: '90%', alignSelf: 'center', marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
        Rua / Logradouro
      </Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.inputField, { paddingLeft: 10 }]} 
          value={rua} 
          onChangeText={setRua} 
          placeholder="Ex: Av. das Hortaliças" 
          placeholderTextColor={colors.placeholder}
        />
      </View>

      {/* 🏠 Nº e Bairro na mesma linha */}
      <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between' }}>
        
        {/* Lado Esquerdo: Número (30% de espaço) */}
        <View style={{ width: '30%' }}>
            <Text style={{ marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
              Nº
            </Text>
            {/* 🟢 ADICIONEI width: '100%' AQUI PARA NÃO QUEBRAR A CAIXA */}
            <View style={[styles.inputContainer, { width: '100%' }]}>
                <TextInput 
                  style={[styles.inputField, { paddingLeft: 10 }]} 
                  value={numero} 
                  onChangeText={setNumero} 
                  keyboardType="numeric" 
                  placeholderTextColor={colors.placeholder}
                />
            </View>
        </View>

        {/* Lado Direito: Bairro (65% de espaço) */}
        <View style={{ width: '65%' }}>
            <Text style={{ marginBottom: 5, paddingLeft: 10, fontSize: 15, color: colors.cinzaTecnico, fontWeight: 'bold' }}>
              Bairro
            </Text>
            {/* 🟢 ADICIONEI width: '100%' AQUI PARA NÃO QUEBRAR A CAIXA */}
            <View style={[styles.inputContainer, { width: '100%' }]}>
                <TextInput 
                  style={[styles.inputField, { paddingLeft: 10 }]} 
                  value={bairro} 
                  onChangeText={setBairro} 
                  placeholderTextColor={colors.placeholder}
                />
            </View>
        </View>

      </View>

      {/* 💾 Botão Salvar */}
      <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 30 }]} onPress={() => Alert.alert("Salvo", "Endereço cadastrado!")}>
        <Text style={styles.buttonText}>Salvar Endereço</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
