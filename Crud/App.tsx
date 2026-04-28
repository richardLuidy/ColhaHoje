import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from './styles';
import Header from './src/components/Header';

// 🚀 TELAS
import Inicio from './src/pages/Inicio';
import Mapa from './src/pages/Mapa';
import Ofertas from './src/pages/Ofertas';
import Pedidos from './src/pages/Pedidos';
import Perfil from './src/pages/Perfil';
import Login from './src/pages/Login';
import SplashScreen from './src/pages/SplashScreen';

// Importar SVGs diretamente
import MapaCinza from './src/assets/mapa_cinza.svg';
import MapaVerde from './src/assets/mapa_verde.svg';
import OfertasCinza from './src/assets/ofertas_cinza.svg';
import OfertasVerde from './src/assets/ofertas_verde.svg';
import HomeCinza from './src/assets/home_cinza.svg';
import HomeVerde from './src/assets/home_verde.svg';
import PedidosCinza from './src/assets/pedidos_cinza.svg';
import PedidosVerde from './src/assets/pedidos_verde.svg';
import PerfilCinza from './src/assets/perfil_cinza.svg';
import PerfilVerde from './src/assets/perfil_verde.svg';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

type TabKey = 'splash' | 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'perfil' | 'login';

const tabConfig: Record<Exclude<TabKey, 'login' | 'splash'>, { label: string; iconInactive: any; iconActive: any }> = {
  mapa: { label: 'Mapa', iconInactive: MapaCinza, iconActive: MapaVerde },
  ofertas: { label: 'Ofertas', iconInactive: OfertasCinza, iconActive: OfertasVerde },
  inicio: { label: 'Início', iconInactive: HomeCinza, iconActive: HomeVerde },
  pedidos: { label: 'Pedidos', iconInactive: PedidosCinza, iconActive: PedidosVerde },
  perfil: { label: 'Perfil', iconInactive: PerfilCinza, iconActive: PerfilVerde },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('splash');
  const tabs = Object.keys(tabConfig) as Exclude<TabKey, 'login' | 'splash'>[];

  // 🟢 ESTADO ATUALIZADO: Inclui 'vender'
  const [subTelaPerfil, setSubTelaPerfil] = useState<'menu' | 'dados' | 'enderecos' | 'vender'>('menu');

  if (activeTab === 'splash') {
    return <SplashScreen onFinish={() => setActiveTab('login')} />;
  }

  if (activeTab === 'login') {
    return (
      <View style={styles.container}>
        <Login onLoginSuccess={() => setActiveTab('inicio')} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        
        {/* 🟢 HEADER SINCRONIZADO: 
            Agora ele esconde a seta verde se você estiver na tela de vender (onde estão o cadastro e ofertas)
        */}
        <Header 
          activeTab={activeTab} 
          forceShowBack={activeTab === 'perfil' && subTelaPerfil !== 'menu' && subTelaPerfil !== 'vender'} 
          esconderSetaForçado={activeTab === 'perfil' && subTelaPerfil === 'vender'}
          onBackPress={() => {
            if (activeTab === 'perfil') setSubTelaPerfil('menu');
          }}
        />

        <View style={styles.content}>
          {activeTab === 'mapa' && <Mapa />}
          {activeTab === 'ofertas' && <Ofertas />}
          {activeTab === 'inicio' && <Inicio />}
          {activeTab === 'pedidos' && <Pedidos />}
          
          {activeTab === 'perfil' && (
            <Perfil 
              onLogout={() => setActiveTab('login')} 
              telaAtual={subTelaPerfil}
              setTelaAtual={setSubTelaPerfil}
            />
          )}
        </View>

        <View style={styles.footer}>
          {tabs.map((key) => {
            const isActive = key === activeTab;
            const tabData = tabConfig[key];
            const IconComponent = isActive ? tabData.iconActive : tabData.iconInactive;

            return (
              <TouchableOpacity
                key={key}
                style={styles.tabButton}
                onPress={() => {
                  setActiveTab(key);
                  if (key !== 'perfil') setSubTelaPerfil('menu');
                }}
                activeOpacity={0.75}
              >
                <IconComponent width={31} height={31} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tabData.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}