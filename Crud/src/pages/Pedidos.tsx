import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';

export default function Pedidos() {
  const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'historico'>('andamento');

  return (
    <View style={styles.container}>
      {/* Sistema de Abas (Tabs) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, abaAtiva === 'andamento' && styles.tabActive]}
          onPress={() => setAbaAtiva('andamento')}
        >
          <Text style={[styles.tabText, abaAtiva === 'andamento' && styles.tabTextActive]}>
            PEDIDOS EM ANDAMENTO
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, abaAtiva === 'historico' && styles.tabActive]}
          onPress={() => setAbaAtiva('historico')}
        >
          <Text style={[styles.tabText, abaAtiva === 'historico' && styles.tabTextActive]}>
            HISTÓRICO
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {abaAtiva === 'andamento' && (
          <View style={styles.cardAndamento}>
            <View style={styles.cardAndamentoHeader}>
              <Text style={styles.pedidoIdAndamento}>Pedido #0616</Text>
              <View style={styles.badgeEmRota}>
                <Ionicons name="bus-outline" size={14} color="#387C59" style={{marginRight: 4}} />
                <Text style={styles.badgeEmRotaText}>Em Rota de Entrega</Text>
              </View>
            </View>

            <View style={styles.progressTracker}>
              <View style={styles.progressStep}>
                <View style={styles.progressCircleActive}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
                <Text style={styles.progressTextActive}>Confirmado</Text>
              </View>
              <View style={styles.progressLineActive} />

              <View style={styles.progressStep}>
                <View style={styles.progressCircleActive}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
                <Text style={styles.progressTextActive}>Preparação</Text>
              </View>
              <View style={styles.progressLineActive} />

              <View style={styles.progressStep}>
                <View style={styles.progressCircleActive}>
                  <Ionicons name="bus-outline" size={14} color="#FFF" />
                </View>
                <Text style={styles.progressTextActive}>Em Rota</Text>
              </View>
              <View style={styles.progressLineInactive} />

              <View style={styles.progressStep}>
                <View style={styles.progressCircleInactive} />
                <Text style={styles.progressTextInactive}>Entregue</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=200&auto=format&fit=crop' }} 
                style={styles.produtoImagem} 
              />
              <View style={styles.produtoInfoAndamento}>
                <Text style={styles.produtoNome}>Banana Nanica</Text>
                <Text style={styles.fornecedor}>Fornecedor: Sítio X (Registro, SP)</Text>
              </View>
            </View>

            <Text style={styles.previsaoText}>
              Previsão de Entrega:{'\n'}
              <Text style={styles.previsaoDate}>Hoje(02/05/26), até 17:03</Text>
            </Text>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.btnFilled}>
                <Ionicons name="location-outline" size={16} color="#FFF" style={{ marginRight: 5 }} />
                <Text style={styles.btnFilledText}>Rastrear no Mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutlineAndamento}>
                <Ionicons name="logo-whatsapp" size={16} color="#333" style={{ marginRight: 5 }} />
                <Text style={styles.btnOutlineAndamentoText}>Falar com o Produtor</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {abaAtiva === 'historico' && (
          <>
            {/* Card 1 - Pedido Concluído (Verde) */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dataPedido}>4 de Janeiro de 2027 - Pedido #0616</Text>
                <View style={styles.iconCircleSuccess}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.cardBody}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=200&auto=format&fit=crop' }} 
                  style={styles.produtoImagem} 
                />
                <View style={styles.produtoInfo}>
                  <Text style={styles.produtoNome}>20Kg Banana Nanica</Text>
                  <Text style={styles.fornecedor}>Fornecedor: Sítio X (Registro, SP)</Text>
                  <Text style={styles.totalTexto}>Total: <Text style={styles.totalValor}>R$ 1.231,91</Text></Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.btnOutline}>
                  <Text style={styles.btnOutlineText}>Ver Detalhes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnFilled}>
                  <Ionicons name="refresh-outline" size={16} color="#FFF" style={{ marginRight: 5 }} />
                  <Text style={styles.btnFilledText}>Refazer Pedido</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2 - Pedido Cancelado (Vermelho/Cinza) */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dataPedidoCancelado}>4 de Janeiro de 2027 - Pedido #1231</Text>
                <View style={styles.iconCircleError}>
                  <Ionicons name="close" size={16} color="#FFF" />
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.cardBody}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=200&auto=format&fit=crop&sat=-100' }} 
                  style={[styles.produtoImagem, { opacity: 0.7 }]} 
                />
                <View style={styles.produtoInfo}>
                  <Text style={styles.produtoNome}>500Kg Banana Nanica</Text>
                  <Text style={styles.fornecedor}>Fornecedor: Sítio X (Registro, SP)</Text>
                  <Text style={styles.totalTexto}>Total: <Text style={styles.totalValor}>R$ 9123,21</Text></Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.btnDisabled} disabled>
                  <Text style={styles.btnDisabledText}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderBottomWidth: 1, borderBottomColor: '#CCC' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2E7D32' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#999', letterSpacing: 0.5 },
  tabTextActive: { color: '#2E7D32' },
  scrollContent: { padding: 16 },
  
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#E0E0E0' },
  cardAndamento: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 2, borderColor: '#387C59' },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardAndamentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  
  pedidoIdAndamento: { fontSize: 16, fontWeight: '600', color: '#333' },
  badgeEmRota: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeEmRotaText: { color: '#387C59', fontSize: 12, fontWeight: '600' },
  
  progressTracker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 },
  progressStep: { alignItems: 'center', flex: 1 },
  progressCircleActive: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#387C59', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  progressCircleInactive: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E0E0E0', zIndex: 2 },
  progressTextActive: { fontSize: 10, color: '#387C59', marginTop: 4, fontWeight: '500' },
  progressTextInactive: { fontSize: 10, color: '#999', marginTop: 4 },
  progressLineActive: { flex: 1, height: 2, backgroundColor: '#387C59', marginTop: -15, zIndex: 1 },
  progressLineInactive: { flex: 1, height: 2, backgroundColor: '#E0E0E0', marginTop: -15, zIndex: 1 },
  
  dataPedido: { fontSize: 14, color: '#999', fontWeight: '500' },
  dataPedidoCancelado: { fontSize: 14, color: '#B0B0B0', fontWeight: '500' },
  iconCircleSuccess: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#387C59', justifyContent: 'center', alignItems: 'center' },
  iconCircleError: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#7C3838', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 12 },
  
  cardBody: { flexDirection: 'row', marginBottom: 16 },
  produtoImagem: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  produtoInfo: { flex: 1, justifyContent: 'center' },
  produtoInfoAndamento: { flex: 1, justifyContent: 'flex-start', paddingTop: 5 },
  produtoNome: { fontSize: 16, fontWeight: '500', color: '#000', marginBottom: 2 },
  fornecedor: { fontSize: 12, color: '#999', marginBottom: 6 },
  totalTexto: { fontSize: 14, color: '#333', fontWeight: '600' },
  totalValor: { color: '#666', fontWeight: '400' },
  
  previsaoText: { fontSize: 14, color: '#FFA000', marginBottom: 16, fontWeight: '500' },
  previsaoDate: { fontSize: 15, fontWeight: '600' },

  cardActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#387C59', borderRadius: 20, paddingVertical: 10, alignItems: 'center' },
  btnOutlineText: { color: '#387C59', fontSize: 13, fontWeight: '500' },
  btnOutlineAndamento: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9', borderRadius: 20, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnOutlineAndamentoText: { color: '#333', fontSize: 12, fontWeight: '500' },
  btnFilled: { flex: 1, backgroundColor: '#387C59', borderRadius: 20, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnFilledText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  btnDisabled: { flex: 1, backgroundColor: '#F8F8F8', borderRadius: 20, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EBEBEB' },
  btnDisabledText: { color: '#CCC', fontSize: 13, fontWeight: '500' },
});
