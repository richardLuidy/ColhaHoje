import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgUri } from 'react-native-svg';

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
  const resolvedIcons = useMemo(() => {
    const result: Record<TabKey, { active: string; inactive: string }> = {
      mapa: { active: '', inactive: '' },
      ofertas: { active: '', inactive: '' },
      inicio: { active: '', inactive: '' },
      pedidos: { active: '', inactive: '' },
      perfil: { active: '', inactive: '' },
    };

    (Object.keys(tabConfig) as TabKey[]).forEach((key) => {
      result[key] = {
        active: Image.resolveAssetSource(tabConfig[key].iconActive).uri,
        inactive: Image.resolveAssetSource(tabConfig[key].iconInactive).uri,
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
        {(Object.keys(tabConfig) as TabKey[]).map((key) => {
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E4620',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#4F4F4F',
  },
  footer: {
    width,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#707070',
  },
  tabLabelActive: {
    color: '#1E8E40',
    fontWeight: '700',
  },
});
