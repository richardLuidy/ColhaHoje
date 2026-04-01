import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from './styles';
import Header from './src/components/Header';

// 🚀 IMPORTAÇÃO DAS TELAS REAIS
import Inicio from './src/pages/Inicio';
import Mapa from './src/pages/Mapa';
import Ofertas from './src/pages/Ofertas';
import Pedidos from './src/pages/Pedidos';
import Perfil from './src/pages/Perfil';
import Login from './src/pages/Login'; // 👈 Adicionado o Login

// Tipo das abas do footer (Adicionado 'login' para o TypeScript não reclamar)
type TabKey = 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'perfil' | 'login';

const tabConfig: Record<
  Exclude<TabKey, 'login'>, // Remove o login da configuração do footer
  {
    label: string;
    iconInactive: any;
    iconActive: any;
  }
> = {
  mapa: {
    label: 'Mapa',
    iconInactive: require('./src/assets/mapa_cinza.svg') as any,
    iconActive: require('./src/assets/mapa_verde.svg') as any,
  },
  ofertas: {
    label: 'Ofertas',
    iconInactive: require('./src/assets/ofertas_cinza.svg') as any,
    iconActive: require('./src/assets/ofertas_verde.svg') as any,
  },
  inicio: {
    label: 'Início',
    iconInactive: require('./src/assets/home_cinza.svg') as any,
    iconActive: require('./src/assets/home_verde.svg') as any,
  },
  pedidos: {
    label: 'Pedidos',
    iconInactive: require('./src/assets/pedidos_cinza.svg') as any,
    iconActive: require('./src/assets/pedidos_verde.svg') as any,
  },
  perfil: {
    label: 'Perfil',
    iconInactive: require('./src/assets/perfil_cinza.svg') as any,
    iconActive: require('./src/assets/perfil_verde.svg') as any,
  },
};

export default function App() {
  // 🔑 Começamos na tela de login
  const [activeTab, setActiveTab] = useState<TabKey>('login');

  const tabs: Exclude<TabKey, 'login'>[] = ['mapa', 'ofertas', 'inicio', 'pedidos', 'perfil'];

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

  // 🛡️ LÓGICA DE LOGIN: Se não estiver logado, mostra APENAS a tela de Login
  if (activeTab === 'login') {
    return (
      <View style={styles.container}>
        {/* Quando o login der certo, ele chama essa função e vai para o 'inicio' */}
        <Login onLoginSuccess={() => setActiveTab('inicio')} />
        <StatusBar style="dark" />
      </View>
    );
  }

  // 📱 APP LOGADO: Mostra Header, Conteúdo e Footer
  return (
    <View style={styles.container}>

      {/* Header (se o activeTab for 'login', ele retorna null dentro do componente) */}
      <Header activeTab={activeTab} />

      <View style={styles.content}>
        {activeTab === 'mapa' && <Mapa />}
        {activeTab === 'ofertas' && <Ofertas />}
        {activeTab === 'inicio' && <Inicio />}
        {activeTab === 'pedidos' && <Pedidos />}
        {activeTab === 'perfil' && <Perfil />}
      </View>

      <View style={styles.footer}>
        {tabs.map((key) => {
          const isActive = key === activeTab;
          const src = isActive ? resolvedIcons[key].active : resolvedIcons[key].inactive;

          return (
            <TouchableOpacity
              key={key}
              style={styles.tabButton}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.75}
            >
              <SvgUri width={31} height={31} uri={src} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tabConfig[key].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="light" />
    </View>
  );
}