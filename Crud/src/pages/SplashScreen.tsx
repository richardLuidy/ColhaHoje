import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../../colors';
import styles from '../../styles';

import Logo from '../assets/logo.svg';

export default function SplashScreenComponent({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // 🟢 1. Esconde a splash nativa do Expo imediatamente
    SplashScreen.hideAsync();

    // 🟢 2. Simula um carregamento, mantendo a sua tela verde por 3 segundos
    const timer = setTimeout(() => {
      onFinish(); // 🟢 3. Chama a função para ir pro Login
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    // 🟢 Forçamos o verdeColheita (escuro) aqui para dar o melhor contraste
    <View style={[styles.splashContainer, { backgroundColor: colors.verdeColheita }]}>

{/* <Logo width={220} height={220} style={{ marginBottom: 20 }} /> */}
      <Text style={[styles.splashText, { textAlign: 'center' }]}>
        ColhaHoje
      </Text>
      
      <Text style={[styles.splashSubtitle, { textAlign: 'center', marginTop: 5, paddingHorizontal: 20 }]}>
        Conectando produtores e consumidores
      </Text>
      
    </View>
  );
}