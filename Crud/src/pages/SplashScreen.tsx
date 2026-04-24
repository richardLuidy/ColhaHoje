import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../../colors';
import styles from '../../styles';

export default function SplashScreenComponent({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    // Previne que a splash nativa do Expo seja ocultada automaticamente
    SplashScreen.preventAutoHideAsync();

    // Simula um carregamento (ex.: verificar token, carregar dados iniciais)
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync(); // Oculta a splash nativa
      onFinish(); // Chama a função para prosseguir para a próxima tela
    }, 3000); // 3 segundos de splash

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/logo.png')} // Substitua pelo caminho do seu logo
        style={styles.splashLogo}
        resizeMode="contain"
      />
      <Text style={styles.splashText}>ColhaHoje</Text>
      <Text style={styles.splashSubtitle}>Conectando produtores e consumidores</Text>
    </View>
  );
}