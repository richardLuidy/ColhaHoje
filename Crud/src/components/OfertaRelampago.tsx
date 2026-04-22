import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, PanResponder, Pressable, ActivityIndicator, Alert } from 'react-native'; 
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

import styles from '../../styles'; 
import { colors } from '../../colors';

interface OfertaRelampagoProps {
  visivel: boolean;
  onClose: () => void;
}

export default function OfertaRelampago({ visivel, onClose }: OfertaRelampagoProps) {
  // Estados para dados do Banco (Aiven)
  const [produtosBD, setProdutosBD] = useState<any[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estados da Oferta
  const [tempoOferta, setTempoOferta] = useState(30);
  const [botaoPressionado, setBotaoPressionado] = useState<string | null>(null);

  const timerEsperaRef = useRef<any>(null);
  const motorAceleracaoRef = useRef<any>(null);

  // 🟢 BUSCAR PRODUTOS REAIS DO SERVER.JS (AIVEN)
  useEffect(() => {
    if (visivel) {
      setCarregando(true);
      fetch('http://10.0.2.2:3000/produtos')
        .then(res => res.json())
        .then(dados => {
          setProdutosBD(dados);
          if (dados.length > 0) setProdutoSelecionado(dados[0]);
          setCarregando(false);
        })
        .catch(err => {
          console.error("Erro Aiven:", err);
          setCarregando(false);
        });
    }
  }, [visivel]);

  // 🟢 AJUSTE DE NOMES: precoOriginal busca a coluna 'preco' do seu prisma
  const precoOriginal = produtoSelecionado ? parseFloat(produtoSelecionado.preco) : 0;
  const precoComDescontoNum = precoOriginal * 0.5;
  const precoOriginalFormatado = precoOriginal.toFixed(2).replace('.', ',');
  const precoDescontoFormatado = precoComDescontoNum.toFixed(2).replace('.', ',');

  // 🟢 SALVAR OFERTA NO BANCO (AIVEN)
  const ativarOferta = async () => {
    if (!produtoSelecionado) return;
    
    setEnviando(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto_id: produtoSelecionado.id,
          preco_original: precoOriginal,
          preco_promocional: precoComDescontoNum,
          duracao_minutos: tempoOferta
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "⚡ Oferta Relâmpago ativada com sucesso!");
        onClose();
      } else {
        Alert.alert("Erro", "Não foi possível ativar a oferta.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  // Lógica de tempo acelerado
  const limiteMaximo = 1440; 
  const aumentarTempo = () => setTempoOferta(prev => Math.min(prev + 10, limiteMaximo));
  const diminuirTempo = () => setTempoOferta(prev => Math.max(prev - 10, 10));

  const iniciarAceleracao = (tipo: 'mais' | 'menos') => {
    setBotaoPressionado(tipo);
    timerEsperaRef.current = setTimeout(() => {
      motorAceleracaoRef.current = setInterval(() => {
        if (tipo === 'mais') {
          setTempoOferta(prev => Math.min(prev + 10, limiteMaximo));
        } else {
          setTempoOferta(prev => Math.max(prev - 10, 10));
        }
      }, 80); 
    }, 500);
  };

  const pararAceleracao = () => {
    setBotaoPressionado(null);
    if (timerEsperaRef.current) clearTimeout(timerEsperaRef.current);
    if (motorAceleracaoRef.current) clearInterval(motorAceleracaoRef.current);
  };

  const horas = Math.floor(tempoOferta / 60);
  const minutos = tempoOferta % 60;
  const tempoDisplay = horas > 0 
    ? `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} h`
    : `00:${minutos.toString().padStart(2, '0')} min`;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, 
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 30) onClose(); 
      },
    })
  ).current;

  return (
    <Modal animationType="slide" transparent={true} visible={visivel} onRequestClose={onClose} statusBarTranslucent={true}>
      <View style={styles.modalFundoEscuro}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalConteudoBranco}>
          
          <View {...panResponder.panHandlers} style={{ paddingTop: 10, paddingBottom: 15 }}>
            <View style={styles.tracinhoModal} />
            <Text style={styles.tituloModalOferta}>Nova Oferta Relâmpago ⚡</Text>
          </View>

          {carregando ? (
            <ActivityIndicator size="large" color={colors.verdeColheita} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <Text style={styles.labelGeralCadastrar}>Selecione o Produto:</Text>
              <View style={styles.pickerBoxCadastrar}>
                <Picker 
                  selectedValue={produtoSelecionado?.id} 
                  onValueChange={(itemValue) => {
                    const p = produtosBD.find(prod => prod.id === itemValue);
                    setProdutoSelecionado(p);
                  }} 
                  style={styles.pickerCadastrar}
                >
                  {produtosBD.map(p => (
                    <Picker.Item 
                      key={p.id} 
                      // 🟢 AJUSTE: Usando p.nome_produto e p.quantidade conforme seu Schema
                      label={`${p.nome_produto} (Estoque: ${p.quantidade}${p.unidade})`} 
                      value={p.id} 
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.labelGeralCadastrar}>Preço Promocional:</Text>
              <View style={styles.boxPrecoAutomatico}>
                <Text style={styles.textoPrecoRiscado}>De R$ {precoOriginalFormatado}/kg por:</Text>
                <Text style={styles.textoPrecoDesconto}>R$ {precoDescontoFormatado}</Text>
              </View>

              <Text style={styles.labelGeralCadastrar}>Duração da Oferta (Max 24h):</Text>
              <View style={styles.containerTempoOferta}>
                <Pressable 
                  style={[styles.btnTempoBase, botaoPressionado === 'menos' && styles.btnTempoAtivo]} 
                  onPress={diminuirTempo}
                  onPressIn={() => iniciarAceleracao('menos')}
                  onPressOut={pararAceleracao}
                >
                  <Ionicons name="remove" size={24} color={botaoPressionado === 'menos' ? '#FFF' : '#000'} />
                </Pressable>
                
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.textoTempoOferta} numberOfLines={1} adjustsFontSizeToFit>{tempoDisplay}</Text>
                </View>
                
                <Pressable 
                  style={[styles.btnTempoBase, botaoPressionado === 'mais' && styles.btnTempoAtivo]} 
                  onPress={aumentarTempo}
                  onPressIn={() => iniciarAceleracao('mais')}
                  onPressOut={pararAceleracao}
                >
                  <Ionicons name="add" size={24} color={botaoPressionado === 'mais' ? '#FFF' : '#000'} />
                </Pressable>
              </View>

              <TouchableOpacity 
                style={[styles.btnAtivarOfertaAgora, enviando && { opacity: 0.7 }]} 
                onPress={ativarOferta}
                disabled={enviando}
              >
                <Text style={styles.textoBtnAtivarOferta}>
                  {enviando ? 'Processando...' : 'Ativar Oferta Agora'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}