import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../colors';

export default function Pesquisa({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const categorias = [
    { id: 1, nome: 'Ofertas Relâmpago', icone: 'flash', cor: '#FFA000' },
    { id: 2, nome: 'Especial Vale', icone: 'leaf', cor: '#EEDB4E' },
    { id: 3, nome: 'Verduras', icone: 'leaf-outline', cor: '#387C59' },
    { id: 4, nome: 'Legumes', icone: 'nutrition-outline', cor: '#E57373' },
    { id: 5, nome: 'Frutas', icone: 'aperture-outline', cor: '#FFB74D' },
    { id: 6, nome: 'Raízes', icone: 'flower-outline', cor: '#D7CCC8' },
    { id: 7, nome: 'Orgânicos', icone: 'leaf', cor: '#A5D6A7' },
    { id: 8, nome: 'Atacado', icone: 'cube-outline', cor: '#8D6E63' },
  ];

  const maisBuscados = ['Banana Nanica', 'Ovo Caipira', 'Alface Americana', 'Tomate Italiano', 'Palmito'];
  const historicoPesquisa = ['Cebola pacote 20Kg', 'Cenoura 25 un', 'Abacaxi', 'Alface americano 200mg', 'Batata saco 200Kg'];

  return (
    <View style={styles.container}>
      {/* 🟢 HEADER CUSTOMIZADO DE PESQUISA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#333" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Morangos"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="bag-outline" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Lado Esquerdo - Categorias */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categorias.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoriaItem}>
                <Ionicons name={cat.icone as any} size={20} color={cat.cor} />
                <Text style={styles.categoriaText}>{cat.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lado Direito - Conteúdo da Pesquisa */}
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Oferta do Dia */}
            <TouchableOpacity style={styles.ofertaDiaCard} activeOpacity={0.8}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1590502593747-422e15fb6f1c?q=80&w=400&auto=format&fit=crop' }} 
                style={styles.ofertaDiaImage}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>Promo</Text>
                </View>
                <View style={styles.ofertaDiaInfo}>
                  <Text style={styles.ofertaDiaLabel}>Oferta Do Dia:</Text>
                  <Text style={styles.ofertaDiaTitle}>Caixa de Limão Taiti</Text>
                  <Text style={styles.ofertaDiaSub}>Sítio Alvorada, R$2,99/Kg</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Mais Buscados */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Mais Buscados do Vale</Text>
            </View>
            <View style={styles.tagsContainer}>
              {maisBuscados.map((item, index) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Histórico */}
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Ionicons name="time-outline" size={18} color="#666" style={{ marginRight: 6 }} />
              <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Histórico De Pesquisa</Text>
            </View>
            <View style={styles.historyContainer}>
              {historicoPesquisa.map((item, index) => (
                <TouchableOpacity key={index} style={styles.historyTag}>
                  <Text style={styles.historyTagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sugestões Orgânicas */}
            <View style={styles.sugestoesContainer}>
              <TouchableOpacity style={styles.sugestaoCard} activeOpacity={0.8}>
                <ImageBackground 
                  source={{ uri: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.sugestaoImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.sugestaoBadge}>
                    <Text style={styles.sugestaoBadgeText}>Orgânico</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sugestaoCard} activeOpacity={0.8}>
                <ImageBackground 
                  source={{ uri: 'https://images.unsplash.com/photo-1622206151226-18ca2c9e6a03?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.sugestaoImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.sugestaoBadge}>
                    <Text style={styles.sugestaoBadgeText}>Orgânico</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    backgroundColor: '#387C59',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: { padding: 4 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    height: 40,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  
  content: { flex: 1, flexDirection: 'row' },
  
  sidebar: {
    width: 130,
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingTop: 10,
  },
  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  categoriaText: { fontSize: 13, color: '#333', marginLeft: 8, fontWeight: '500' },
  
  mainContent: { flex: 1, padding: 12 },
  
  ofertaDiaCard: { width: '100%', height: 120, borderRadius: 12, marginBottom: 20 },
  ofertaDiaImage: { width: '100%', height: '100%', justifyContent: 'space-between' },
  promoBadge: { alignSelf: 'flex-end', backgroundColor: '#FFA000', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 10, borderTopRightRadius: 12 },
  promoBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  ofertaDiaInfo: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  ofertaDiaLabel: { color: '#FFF', fontSize: 11, fontWeight: '500' },
  ofertaDiaTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginVertical: 2 },
  ofertaDiaSub: { color: '#FFF', fontSize: 11 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: '#333', fontSize: 12, fontWeight: '500' },
  
  historyContainer: { alignItems: 'center', gap: 10 },
  historyTag: { backgroundColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'center' },
  historyTagText: { color: '#555', fontSize: 13 },
  
  sugestoesContainer: { flexDirection: 'row', gap: 12, marginTop: 30, paddingBottom: 20 },
  sugestaoCard: { flex: 1, height: 140, borderRadius: 16, overflow: 'hidden' },
  sugestaoImage: { width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-end', padding: 8 },
  sugestaoBadge: { backgroundColor: '#387C59', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sugestaoBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
});
