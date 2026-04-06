import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles';
import { colors } from '../../colors';

// 📂 Importação dos Ícones SVG
const iconDados = Image.resolveAssetSource(require('../assets/icon-dados.svg')).uri;
const iconEndereco = Image.resolveAssetSource(require('../assets/icon-endereco.svg')).uri;
const iconHistorico = Image.resolveAssetSource(require('../assets/icon-historico.svg')).uri;
const iconPagamento = Image.resolveAssetSource(require('../assets/icon-pagamento.svg')).uri;
const iconConfig = Image.resolveAssetSource(require('../assets/icon-config.svg')).uri;
const iconVender = Image.resolveAssetSource(require('../assets/icon-vender.svg')).uri;

// Definição da Prop para o Logout
interface PerfilProps {
  onLogout: () => void;
}

export default function Perfil({ onLogout }: PerfilProps) {
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...');

  useEffect(() => {
    const carregarDadosReais = async () => {
      try {
        const nomeSalvo = await AsyncStorage.getItem('user_name');
        if (nomeSalvo) {
          setNomeUsuario(nomeSalvo);
        } else {
          setNomeUsuario("Usuário"); 
        }
      } catch (e) {
        console.error("Erro ao ler AsyncStorage:", e);
        setNomeUsuario("Usuário");
      }
    };
    carregarDadosReais();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      onLogout(); 
      console.log("Usuário deslogado");
    } catch (e) {
      console.error("Erro ao deslogar:", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerLogin} showsVerticalScrollIndicator={false}>
      
      {/* 👤 Header */}
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={70} color={colors.cinzaTecnico} />
        </View>
        <Text style={styles.profileName}>Olá, {nomeUsuario}!</Text>
      </View>

      {/* 🔘 Botões */}
      <TouchableOpacity style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconDados} />
        <Text style={styles.inputLabel}>Meus Dados Pessoais</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconEndereco} />
        <Text style={styles.inputLabel}>Endereços</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconHistorico} />
        <Text style={styles.inputLabel}>Histórico de Pedidos</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconPagamento} />
        <Text style={styles.inputLabel}>Métodos de Pagamento</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconConfig} />
        <Text style={styles.inputLabel}>Configurações</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      {/* 🟢 Quero Vender */}
      <TouchableOpacity style={[styles.inputContainer, styles.buttonSeller]}>
        <SvgUri width={24} height={24} uri={iconVender} />
        <Text style={styles.inputLabelSeller}>Quero Vender</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.verdeColheita} style={styles.iconChevron} />
      </TouchableOpacity>

      {/* 🚪 Botão Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}