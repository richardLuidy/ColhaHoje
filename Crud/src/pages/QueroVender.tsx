import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles'; 
import { colors } from '../../colors';

interface QueroVenderProps {
  onVoltar: () => void;
}

export default function QueroVender({ onVoltar }: QueroVenderProps) {
  return (
    <ScrollView contentContainerStyle={styles.containerQueroVender} showsVerticalScrollIndicator={false}>
      
      {/* 🟦 DASHBOARD */}
      <Text style={styles.tituloSessaoItalico}>Dashboard</Text>
      
      <View style={styles.rowCards}>
        <View style={styles.cardPequeno}>
          <Text style={styles.cardLabel}>Vendas do Dia</Text>
          <Text style={styles.cardValor}>R$ 0,00</Text>
          <View style={styles.areaInfoVendas}>
            <View style={styles.areaGreyDots}>
               {[...Array(6)].map((_, i) => <View key={i} style={styles.greyDot} />)}
            </View>
             <View style={styles.badgeVerde}>
                <Text style={styles.badgeTexto}>+0%</Text>
             </View>
          </View>
        </View>

        <View style={styles.cardPequeno}>
          <Text style={styles.cardLabel}>Produtos Ativos</Text>
          <Text style={styles.cardValor}>0</Text>
          <View style={styles.areaPlantIcons}>
            <Ionicons name="nutrition-outline" size={20} color="#999" />
            <Ionicons name="leaf-outline" size={20} color="#999" />
            <Ionicons name="flower-outline" size={20} color="#999" />
          </View>
        </View>
      </View>

      {/* 🟥 ÁREA DE DESTAQUE (ESTRUTURA CORRETA DO FIGMA: 2 CARDS) */}
      
      {/* 1º CARD: O Card Brancão de Fundo */}
      <View style={styles.cardDestaqueBrancao}>
        
        {/* Título e Estrela dentro do Card Branco */}
        <View style={styles.headerDestaque}>
            <Text style={styles.tituloSessao}>Destaque seu Produto!</Text>
            <Ionicons name="star-outline" size={24} color={colors.verdeColheita} />
        </View>

        {/* 2º CARD: O Card Menor Laranjado por dentro */}
        <View style={styles.cardMenorLaranjado}>
            <Text style={styles.tituloOfertaLaranjaItalico}>Oferta Relâmpago Ativar!</Text>
            
            <View style={styles.areaDestaqueConteudo}>
                {/* Imagem Placeholder */}
                <View style={styles.areaDestaqueEsquerda}>
                    <View style={styles.areaImagemPlaceholderGrande}>
                        <Ionicons name="camera-outline" size={50} color="#ccc" />
                    </View>
                </View>

                {/* Preços e Timer */}
                <View style={styles.areaDestaqueDireita}>
                    <Text style={styles.textoPrecoNormalZeradoDetalhe}>De R$ 0,00/kg</Text>
                    <Text style={styles.textoPrecoDestaqueZeradoGrande}>R$ 0,00/kg</Text>
                    <Text style={styles.textoTimerLabelZerado}>Encerrar em:</Text>
                    <Text style={styles.textoTimerZeradoGrande}>00:00:00</Text>
                </View>
            </View>
        </View>

        {/* Descrições e Botão Verde (Ficam no Card Brancão, abaixo do Laranja) */}
        <Text style={styles.tituloProdutoOfertaGeral}>Nenhum produto em oferta</Text>
        <Text style={styles.descProdutoOfertaGeral}>Crie uma oferta agora e venda o que sobrou do dia.</Text>

        <TouchableOpacity style={styles.btnVerPedidosOuter}>
            <Text style={styles.textoBtnBranco}>Ver pedidos</Text>
        </TouchableOpacity>

        {/* Botão Flutuante (Preso no Card Brancão) */}
        <TouchableOpacity style={styles.btnRedondoFlutuante}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.textoIconeFlutuante}>Criar oferta</Text>
        </TouchableOpacity>

      </View>

      {/* 🟩 GERENCIAR ESTOQUE */}
      <Text style={[styles.tituloSessao, { marginTop: 25, marginBottom: 10 }]}>Gerenciar Estoque</Text>
      
      <View style={styles.cardEstoque}>
        <View style={styles.quadradoAdicionarCentral}>
          <Ionicons name="add-circle-outline" size={55} color="#666" />
        </View>

        <View style={styles.infoEstoque}>
          <Text style={styles.tituloEstoque}>Adicionar Produto ao Catálogo</Text>
          <Text style={styles.descEstoque}>Cadastre sua colheita para venda regular sem prazo.</Text>
          <TouchableOpacity style={styles.btnCadastrar}>
            <Text style={styles.textoBtnBranco}>Cadastrar Produto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}