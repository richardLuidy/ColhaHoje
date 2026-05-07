import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles';
import { colors } from '../../colors';

// 📂 Importação das Telas Secundárias
import DadosPessoais from './DadosPessoais';
import Enderecos from './Enderecos';
import QueroVender from './QueroVender';
import MetodosPagamento from '../components/MetodosPagamento';
import HistoricoPedidos from './HistoricoPedidos'; 
import Configuracoes from './Configuracoes'; // 🟢 1. IMPORTAMOS A NOVA TELA

// 📂 Importação dos Ícones SVG
const iconDados = Image.resolveAssetSource(require('../assets/icon-dados.svg')).uri;
const iconEndereco = Image.resolveAssetSource(require('../assets/icon-endereco.svg')).uri;
const iconHistorico = Image.resolveAssetSource(require('../assets/icon-historico.svg')).uri;
const iconPagamento = Image.resolveAssetSource(require('../assets/icon-pagamento.svg')).uri;
const iconConfig = Image.resolveAssetSource(require('../assets/icon-config.svg')).uri;
const iconVender = Image.resolveAssetSource(require('../assets/icon-vender.svg')).uri;

// 🟢 2. ADICIONAMOS 'configuracoes' NA INTERFACE (Isso remove o erro do TypeScript)
interface PerfilProps {
  onLogout: () => void;
  telaAtual: 'menu' | 'dados' | 'enderecos' | 'vender' | 'pagamento' | 'historico' | 'configuracoes'; 
  setTelaAtual: (tela: 'menu' | 'dados' | 'enderecos' | 'vender' | 'pagamento' | 'historico' | 'configuracoes') => void;
}

export default function Perfil({ onLogout, telaAtual, setTelaAtual }: PerfilProps) {
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...');

  useEffect(() => {
    const carregarDadosReais = async () => {
      try {
        const nomeSalvo = await AsyncStorage.getItem('user_name');
        setNomeUsuario(nomeSalvo || "Usuário");
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
    } catch (e) {
      console.error("Erro ao deslogar:", e);
    }
  };

  // 🟢 3. LÓGICA DE EXIBIÇÃO (ROTEAMENTO)
  if (telaAtual === 'dados') return <DadosPessoais onVoltar={() => setTelaAtual('menu')} />;
  if (telaAtual === 'enderecos') return <Enderecos onVoltar={() => setTelaAtual('menu')} />;
  if (telaAtual === 'vender') return <QueroVender onVoltar={() => setTelaAtual('menu')} />;
  if (telaAtual === 'pagamento') return <MetodosPagamento onVoltar={() => setTelaAtual('menu')} />;
  if (telaAtual === 'historico') return <HistoricoPedidos />; // Removi o onVoltar se o Historico usa o Header do App
  
  // 🟢 NOVA ROTA DE CONFIGURAÇÕES
  if (telaAtual === 'configuracoes') {
    return <Configuracoes onVoltar={() => setTelaAtual('menu')} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.containerLogin} showsVerticalScrollIndicator={false}>

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={70} color={colors.cinzaTecnico} />
        </View>
        <Text style={styles.profileName}>Olá, {nomeUsuario}!</Text>
      </View>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setTelaAtual('dados')}>
        <SvgUri width={24} height={24} uri={iconDados} />
        <Text style={styles.inputLabel}>Meus Dados Pessoais</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setTelaAtual('enderecos')}>
        <SvgUri width={24} height={24} uri={iconEndereco} />
        <Text style={styles.inputLabel}>Endereços</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setTelaAtual('historico')}>
        <SvgUri width={24} height={24} uri={iconHistorico} />
        <Text style={styles.inputLabel}>Histórico de Pedidos</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer} onPress={() => setTelaAtual('pagamento')}>
        <SvgUri width={24} height={24} uri={iconPagamento} />
        <Text style={styles.inputLabel}>Métodos de Pagamento</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      {/* 🟢 4. BOTÃO DE CONFIGURAÇÕES COM AÇÃO! */}
      <TouchableOpacity 
        style={styles.inputContainer} 
        onPress={() => setTelaAtual('configuracoes')}
      >
        <SvgUri width={24} height={24} uri={iconConfig} />
        <Text style={styles.inputLabel}>Configurações</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.cinzaTecnico} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.inputContainer, styles.buttonSeller]} onPress={() => setTelaAtual('vender')}>
        <SvgUri width={24} height={24} uri={iconVender} />
        <Text style={styles.inputLabelSeller}>Quero Vender</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.verdeColheita} style={styles.iconChevron} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}