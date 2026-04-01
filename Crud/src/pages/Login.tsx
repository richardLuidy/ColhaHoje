import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from '../../styles';
import { colors } from '../../colors';
import axios from 'axios';

const iconLogo = Image.resolveAssetSource(require('../assets/logo.svg')).uri;
const iconEmail = Image.resolveAssetSource(require('../assets/icon-email.svg')).uri;
const iconSenha = Image.resolveAssetSource(require('../assets/icon-senha.svg')).uri;

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState(''); 
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  async function handleAuth() {
    // --- 🛡️ LÓGICA EXCLUSIVA DE CADASTRO ---
    if (modo === 'cadastro') {
      if (!email || !codigo || !senha || !confirmarSenha) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      // Simulação do código de confirmação (O "Pulo do Gato")
      if (codigo !== '1234') {
        Alert.alert("Código Inválido", "O código enviado ao seu e-mail é 1234 (Simulação).");
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem!");
        return;
      }
    }

    // --- 🚀 COMUNICAÇÃO COM O SERVIDOR (NODE + AIVEN) ---
    try {
      const rota = modo === 'login' ? '/login' : '/usuarios';
      
      // Montando os dados para enviar ao backend
      const dados = {
        email: email,
        senha: senha,
        nome: email.split('@')[0], // Pega o nome antes do @ como nome de usuário
        tipo_usuario: 'cliente'
      };

      const response = await axios.post(`http://192.168.56.1:3000${rota}`, dados);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso!", modo === 'login' ? "Bem-vindo!" : "Conta criada com sucesso!");
        onLoginSuccess(); // Libera para a tela de Início
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "E-mail ou senha incorretos / Servidor offline.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.containerLogin} showsVerticalScrollIndicator={false}>
      <SvgUri width={187} height={51} uri={iconLogo} />

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => setModo('login')}>
          <Text style={modo === 'login' ? styles.navTextActive : styles.navTextInactive}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.navTextSeparator}> / </Text>
        <TouchableOpacity onPress={() => setModo('cadastro')}>
          <Text style={modo === 'cadastro' ? styles.navTextActive : styles.navTextInactive}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconEmail} />
        <Text style={styles.inputLabel}>Email:</Text>
        <TextInput 
            style={styles.inputField} 
            placeholder="exemplo@email.com" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
        />
      </View>

      {/* Input Código (Apenas no Cadastro) */}
      {modo === 'cadastro' && (
        <View style={styles.inputContainer}>
          <SvgUri width={24} height={24} uri={iconEmail} />
          <Text style={styles.inputLabel}>Código de Confirmação:</Text>
          <TextInput 
            style={styles.inputField} 
            placeholder="Dica: 1234" 
            value={codigo} 
            onChangeText={setCodigo} 
            keyboardType="numeric" 
          />
        </View>
      )}

      {/* Input Senha */}
      <View style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconSenha} />
        <Text style={styles.inputLabel}>Senha:</Text>
        <TextInput 
            style={styles.inputField} 
            placeholder="********" 
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
        />
      </View>

      {/* Input Confirmar Senha (Apenas no Cadastro) */}
      {modo === 'cadastro' && (
        <View style={styles.inputContainer}>
          <SvgUri width={24} height={24} uri={iconSenha} />
          <Text style={styles.inputLabel}>Confirmar a Senha:</Text>
          <TextInput 
            style={styles.inputField} 
            placeholder="********" 
            secureTextEntry 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
          />
        </View>
      )}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleAuth}>
        <Text style={styles.buttonText}>{modo === 'login' ? 'Login' : 'Cadastrar-se'}</Text>
      </TouchableOpacity>

      {modo === 'login' && (
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}