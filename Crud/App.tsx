import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from './styles';

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
  // Inicialmente a tela "Início" está selecionada, como o seu requisito
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

  // Conteúdo simulando cada tela
  const renderScreen = () => {
    switch (activeTab) {
      case 'mapa':
        return <Text style={styles.screenTitle}>Tela Mapa</Text>;
      case 'ofertas':
        return <Text style={styles.screenTitle}>Tela Ofertas</Text>;
      case 'inicio':
        return <Text style={styles.screenTitle}>Tela Início</Text>;
      case 'pedidos':
        return <Text style={styles.screenTitle}>Tela Pedidos</Text>;
      case 'perfil':
        return <Text style={styles.screenTitle}>Tela Perfil</Text>;
      default:
        return <Text style={styles.screenTitle}>Tela Início</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
        <Text style={styles.subtitle}>A aba ativa é: {tabConfig[activeTab].label}</Text>
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
              <SvgUri width={24} height={24} uri={src} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tabConfig[key].label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}