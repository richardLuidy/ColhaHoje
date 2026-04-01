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

      if (codigo !== '1234') {
        Alert.alert("Código Inválido", "O código enviado ao seu e-mail é 1234 (Simulação).");
        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert("Erro", "As senhas não coincidem!");
        return;
      }
    }

    // --- 🚀 COMUNICAÇÃO COM O SERVIDOR ---
    try {
      const rota = modo === 'login' ? '/login' : '/usuarios';
      
      const dados = {
        email: email,
        senha: senha,
        nome: email.split('@')[0],
        tipo_usuario: 'cliente'
      };

      // DICA: Mantenha o IP 192.168.56.1 se for o que funciona no Senac
      const response = await axios.post(`http://192.168.56.1:3000${rota}`, dados);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso!", modo === 'login' ? "Bem-vindo!" : "Conta criada com sucesso!");
        onLoginSuccess();
      }
    } catch (error: any) {
      // 🕵️‍♂️ CAPTURA O ERRO REAL DO SERVIDOR
      console.error(error);
      
      // Se o servidor enviou uma mensagem de erro (ex: "Email já cadastrado"), mostramos ela
      const mensagemServidor = error.response?.data?.error;
      
      if (mensagemServidor) {
        Alert.alert("Erro no Servidor", mensagemServidor);
      } else {
        Alert.alert("Erro de Conexão", "Não foi possível falar com o servidor. Verifique se o Node está rodando.");
      }
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
            placeholder="example@example.com" 
            placeholderTextColor={colors.placeholder}
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
        />
      </View>

      {/* Input Código (Apenas no Cadastro) */}
      {modo === 'cadastro' && (
        <View style={styles.inputContainer}>
          <SvgUri width={24} height={24} uri={iconEmail} />
          <Text style={styles.inputLabel}>Código de Confirmação:</Text>
          <TextInput 
            style={styles.inputField} 
            placeholder="xxx" 
            placeholderTextColor={colors.placeholder}
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
            placeholder="password#123456" 
            placeholderTextColor={colors.placeholder}
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
        />
      </View>

      {/* Input Confirmar Senha (Apenas no Cadastro) */}
      {modo === 'cadastro' && (
        <View style={styles.inputContainer}>
          <SvgUri width={24} height={24} uri={iconSenha} />
          <Text style={styles.inputLabel}>Confirme a Senha:</Text>
          <TextInput 
            style={styles.inputField} 
            placeholder="********" 
            placeholderTextColor={colors.placeholder}
            secureTextEntry 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
          />
        </View>
      )}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleAuth}>
        <Text style={styles.buttonText}>{modo === 'login' ? 'Login' : 'Cadastrar-se'}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}