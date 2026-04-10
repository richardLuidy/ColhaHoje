import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../../styles';
import { colors } from '../../colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconLogo = Image.resolveAssetSource(require('../assets/logo.svg')).uri;
const iconEmail = Image.resolveAssetSource(require('../assets/icon-email.svg')).uri;
const iconSenha = Image.resolveAssetSource(require('../assets/icon-senha.svg')).uri;

// ⚠️ ATENÇÃO: Verifique se este é o IP atual do seu computador no Wi-Fi (ipconfig)
const API_URL = 'http://192.168.56.1:3000'; 

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  const temErroNaConfirmacao = modo === 'cadastro' && confirmarSenha.length > 0 && !senha.startsWith(confirmarSenha);

  async function handleAuth() {
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

    try {
      const rota = modo === 'login' ? '/login' : '/usuarios';
      const dados = {
        email: email,
        senha: senha,
        nome: email.split('@')[0],
        tipo_usuario: 'cliente'
      };

      // 🔵 Chamada para o Back-end
      const response = await axios.post(`${API_URL}${rota}`, dados);

      if (response.status === 200 || response.status === 201) {
        
        // 🟢 MUDANÇA 1: Salvando o ID único do usuário (Obrigatório para o Cadastro de Produto!)
        if (response.data && response.data.id) {
          await AsyncStorage.setItem('user_id', String(response.data.id));
          console.log("✅ ID do usuário salvo:", response.data.id);
        }

        // 🟢 MUDANÇA 2: Salvando o Nome Real que veio do Banco
        if (response.data && response.data.nome) {
          await AsyncStorage.setItem('user_name', response.data.nome);
        } else {
          await AsyncStorage.setItem('user_name', email.split('@')[0]);
        }

        // 🟢 MUDANÇA 3: Salvando o Email
        await AsyncStorage.setItem('user_email', email);

        Alert.alert("Sucesso!", modo === 'login' ? "Bem-vindo!" : "Conta criada com sucesso!");
        
        // Finaliza o login e abre a Home
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error("Erro no Auth:", error);
      const mensagemServidor = error.response?.data?.error;
      if (mensagemServidor) {
        Alert.alert("Erro no Servidor", mensagemServidor);
      } else {
        Alert.alert("Erro de Conexão", "Não foi possível falar com o servidor. O IP está correto?");
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.containerLogin}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
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

      {modo === 'cadastro' && (
        <View style={styles.inputContainer}>
          <SvgUri width={24} height={24} uri={iconEmail} />
          <Text style={styles.inputLabel}>Cód. Confirmação:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="1234"
            placeholderTextColor={colors.placeholder}
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <SvgUri width={24} height={24} uri={iconSenha} />
        <Text style={styles.inputLabel}>Senha:</Text>
        <TextInput
          style={styles.inputField}
          placeholder="ex:123456"
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!senhaVisivel}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Ionicons
            name={senhaVisivel ? "eye-off" : "eye"}
            size={22}
            color={colors.cinzaTecnico}
          />
        </TouchableOpacity>
      </View>

      {modo === 'cadastro' && (
        <View style={[
          styles.inputContainer,
          temErroNaConfirmacao 
            ? { borderWidth: 2, borderColor: 'red' } 
            : { borderWidth: 1, borderColor: '#E0E0E0' }
        ]}>
          <SvgUri width={24} height={24} uri={iconSenha} />
          <Text style={styles.inputLabel}>Confirme:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="********"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!confirmarSenhaVisivel}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
          <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
            <Ionicons
              name={confirmarSenhaVisivel ? "eye-off" : "eye"}
              size={22}
              color={colors.cinzaTecnico}
            />
          </TouchableOpacity>
        </View>
      )}

      {temErroNaConfirmacao && (
        <Text style={styles.errorText}>⚠️ As senhas não coincidem!</Text>
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