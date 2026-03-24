import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from './styles';
import Header from './src/components/Header';

// 🚀 IMPORTAÇÃO DAS TELAS REAIS (Criadas na pasta pages)
import Inicio from './src/pages/Inicio';
import Mapa from './src/pages/Mapa';
import Ofertas from './src/pages/Ofertas';
import Pedidos from './src/pages/Pedidos';
import Perfil from './src/pages/Perfil';

// Tipo das abas do footer
type TabKey = 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'perfil';

// Configuração das abas com label e ícones (cinza/inativo, verde/ativo)
const tabConfig: Record<
  TabKey,
  {
    label: string;
    iconInactive: any; // require local
    iconActive: any; // require local
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
  // Inicialmente a tela "Início" está selecionada
  const [activeTab, setActiveTab] = useState<TabKey>('inicio');

  // Resolve recurso local SVG para URI no motor do React Native.
  const tabs: TabKey[] = ['mapa', 'ofertas', 'inicio', 'pedidos', 'perfil'];

  const resolvedIcons = useMemo(() => {
    const result = {} as Record<TabKey, { active: string; inactive: string }>;

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

  return (
    <View style={styles.container}>
      
      {/* 🚀 O HEADER ENTRA AQUI! Fica no topo da tela */}
      <Header activeTab={activeTab} />

      {/* 🚀 RENDERIZAÇÃO DINÂMICA DAS TELAS REAIS */}
      <View style={styles.content}>
        {activeTab === 'mapa' && <Mapa />}
        {activeTab === 'ofertas' && <Ofertas />}
        {activeTab === 'inicio' && <Inicio />}
        {activeTab === 'pedidos' && <Pedidos />}
        {activeTab === 'perfil' && <Perfil />}
      </View>

      {/* 🚀 O FOOTER */}
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
             {/* Tamanho ideal de 31x31 para equilibrar perfeitamente o peso visual do ícone com o texto da legenda! */}
              <SvgUri width={31} height={31} uri={src} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tabConfig[key].label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}