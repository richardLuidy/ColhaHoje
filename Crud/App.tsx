import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from './styles';
import Header from './src/components/Header';
import { CartProvider, useCart } from './src/contexts/CartContext';

// 🚀 TELAS
import Inicio from './src/pages/Inicio';
import Mapa from './src/pages/Mapa';
import Ofertas from './src/pages/Ofertas';
import Pedidos from './src/pages/Pedidos';
import Perfil from './src/pages/Perfil';
import Login from './src/pages/Login';
import Pesquisa from './src/pages/Pesquisa';
import Carrinho from './src/pages/Carrinho';

type TabKey = 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'carrinho' | 'perfil' | 'login';

const tabConfig: Record<Exclude<TabKey, 'login' | 'carrinho'>, { label: string; iconInactive: any; iconActive: any }> = {
  mapa: {
    label: 'Mapa',
    iconInactive: require('./src/assets/mapa_cinza.svg'),
    iconActive: require('./src/assets/mapa_verde.svg'),
  },
  ofertas: {
    label: 'Ofertas',
    iconInactive: require('./src/assets/ofertas_cinza.svg'),
    iconActive: require('./src/assets/ofertas_verde.svg'),
  },
  inicio: {
    label: 'Início',
    iconInactive: require('./src/assets/home_cinza.svg'),
    iconActive: require('./src/assets/home_verde.svg'),
  },
  pedidos: {
    label: 'Pedidos',
    iconInactive: require('./src/assets/pedidos_cinza.svg'),
    iconActive: require('./src/assets/pedidos_verde.svg'),
  },
  perfil: {
    label: 'Perfil',
    iconInactive: require('./src/assets/perfil_cinza.svg'),
    iconActive: require('./src/assets/perfil_verde.svg'),
  },
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('login');
  
  // 1. Definimos as abas do footer
  const tabs = Object.keys(tabConfig) as Exclude<TabKey, 'login' | 'carrinho'>[];

  // 🟢 NOVO ESTADO: Agora suporta 'menu', 'dados' e 'enderecos'
  const [subTelaPerfil, setSubTelaPerfil] = useState<'menu' | 'dados' | 'enderecos' | 'vender'>('menu');

  const [isSearching, setIsSearching] = useState(false);

  // 2. Criamos o resolvedIcons
  const resolvedIcons = useMemo(() => {
    const result = {} as Record<Exclude<TabKey, 'login'>, { active: string; inactive: string }>;

    tabs.forEach((key) => {
      const activeSource = Image.resolveAssetSource(tabConfig[key].iconActive);
      const inactiveSource = Image.resolveAssetSource(tabConfig[key].iconInactive);

      result[key] = {
        active: (activeSource.uri || '') as string,
        inactive: (inactiveSource.uri || '') as string,
      };
    });

    return result;
  }, []);

  // 🛡️ Lógica de Login
  if (activeTab === 'login') {
    return (
      <View style={styles.container}>
        <Login onLoginSuccess={() => setActiveTab('inicio')} />
        <StatusBar style="dark" />
      </View>
    );
  }

  // 🟢 Lógica de Pesquisa (Full Screen)
  if (isSearching) {
    return (
      <View style={styles.container}>
        <Pesquisa onBack={() => setIsSearching(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* 🟢 HEADER ATUALIZADO: Mostra a seta se estiver em 'dados' ou 'enderecos' */}
      <Header 
        activeTab={activeTab} 
        forceShowBack={activeTab === 'perfil' && subTelaPerfil !== 'menu'} 
        onBackPress={() => {
          if (activeTab === 'perfil') setSubTelaPerfil('menu');
        }}
        onSearchPress={() => setIsSearching(true)}
        onCartPress={() => setActiveTab('carrinho')}
      />

      <View style={styles.content}>
        {activeTab === 'mapa' && <Mapa />}
        {activeTab === 'ofertas' && <Ofertas />}
        {activeTab === 'inicio' && <Inicio />}
        {activeTab === 'pedidos' && <Pedidos />}
        {activeTab === 'carrinho' && (
          <Carrinho 
            onNavigateToPedidos={() => setActiveTab('pedidos')} 
            onContinueShopping={() => setActiveTab('inicio')}
          />
        )}
        
        {/* 🟢 PERFIL ATUALIZADO: Recebe as novas props de controle */}
        {activeTab === 'perfil' && (
          <Perfil 
            onLogout={() => setActiveTab('login')} 
            telaAtual={subTelaPerfil}
            setTelaAtual={setSubTelaPerfil}
          />
        )}
      </View>

      {/* 🟢 FOOTER ATUALIZADO */}
      <View style={styles.footer}>
        {tabs.map((key) => {
          const isActive = key === activeTab;
          const tabData = tabConfig[key];
          
          const icons = resolvedIcons[key];
          const src = isActive ? icons?.active : icons?.inactive;

          return (
            <TouchableOpacity
              key={key}
              style={styles.tabButton}
              onPress={() => {
                setActiveTab(key);
                // Se mudar de aba, resetamos o Perfil para o menu principal
                if (key !== 'perfil') setSubTelaPerfil('menu');
              }}
              activeOpacity={0.75}
            >
              <SvgUri width={31} height={31} uri={src || ''} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tabData.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="light" />
    </View>
  );
}