import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../colors';
import { useCart } from '../contexts/CartContext';

export default function Pesquisa({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelected, setCategoriaSelected] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://192.168.0.116:3000/produtos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProdutos(data);
          setFilteredProdutos(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let resultado = produtos;
    if (searchQuery.trim()) {
      resultado = resultado.filter(p => 
        p.nome_produto.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoriaSelected) {
      resultado = resultado.filter(p => p.categoria === categoriaSelected);
    }
    setFilteredProdutos(resultado);
  }, [searchQuery, categoriaSelected, produtos]);

  const handleAddToCart = (item: any) => {
    addToCart({
      produto_id: item.id,
      nome_produto: item.nome_produto,
      nome_produtor: item.nome_produtor,
      preco: item.preco,
      imagem_url: item.imagem_url,
      quantidade: 1
    });
    Alert.alert('Sucesso!', `${item.nome_produto} adicionado ao carrinho`);
  };

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

  const renderProdutoCard = ({ item }: { item: any }) => (
    <View style={{ flex: 1 }}>
      <View style={styles.produtoCard}>
        <Image source={{ uri: item.imagem_url }} style={styles.produtoImage} />
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome} numberOfLines={2}>{item.nome_produto}</Text>
          <Text style={styles.produtoProdutor} numberOfLines={1}>{item.nome_produtor}</Text>
          <View style={styles.precoContainer}>
            <Text style={styles.preco}>R$ {parseFloat(item.preco || 0).toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.unidade}>{item.unidade || 'Un'}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartBtn} onPress={() => handleAddToCart(item)}>
            <Ionicons name="add-circle" size={16} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.addToCartText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.categoriaItem, !categoriaSelected && styles.categoriaItemActive]}
              onPress={() => setCategoriaSelected(null)}
            >
              <Ionicons name="grid-outline" size={20} color={!categoriaSelected ? '#387C59' : '#999'} />
              <Text style={[styles.categoriaText, !categoriaSelected && styles.categoriaTextActive]}>Tudo</Text>
            </TouchableOpacity>
            {categorias.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoriaItem, categoriaSelected === cat.nome && styles.categoriaItemActive]}
                onPress={() => setCategoriaSelected(categoriaSelected === cat.nome ? null : cat.nome)}
              >
                <Ionicons name={cat.icone as any} size={20} color={categoriaSelected === cat.nome ? cat.cor : '#999'} />
                <Text style={[styles.categoriaText, categoriaSelected === cat.nome && styles.categoriaTextActive]}>{cat.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.mainContent}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#387C59" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {searchQuery.trim() && filteredProdutos.length > 0 && (
                <View>
                  <Text style={styles.searchResultTitle}>Resultados para "{searchQuery}"</Text>
                  <FlatList
                    data={filteredProdutos}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={{ gap: 10 }}
                    renderItem={renderProdutoCard}
                  />
                </View>
              )}

              {!searchQuery.trim() && !categoriaSelected && produtos.length > 0 && (
                <>
                  <TouchableOpacity style={styles.ofertaDiaCard} activeOpacity={0.8}>
                    <ImageBackground 
                      source={{ uri: produtos[0]?.imagem_url }} 
                      style={styles.ofertaDiaImage}
                      imageStyle={{ borderRadius: 12 }}
                    >
                      <View style={styles.promoBadge}>
                        <Text style={styles.promoBadgeText}>Promo</Text>
                      </View>
                      <View style={styles.ofertaDiaInfo}>
                        <Text style={styles.ofertaDiaLabel}>Oferta Do Dia:</Text>
                        <Text style={styles.ofertaDiaTitle}>{produtos[0]?.nome_produto}</Text>
                        <Text style={styles.ofertaDiaSub}>{produtos[0]?.nome_produtor}, R${parseFloat(produtos[0]?.preco || 0).toFixed(2).replace('.', ',')}/{produtos[0]?.unidade}</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Mais Buscados do Vale</Text>
                  </View>
                  <View style={styles.tagsContainer}>
                    {maisBuscados.map((item, index) => (
                      <TouchableOpacity key={index} style={styles.tag} onPress={() => setSearchQuery(item)}>
                        <Text style={styles.tagText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.searchResultTitle}>Produtos Disponíveis</Text>
                  <FlatList
                    data={produtos.slice(0, 10)}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={{ gap: 10 }}
                    renderItem={renderProdutoCard}
                  />
                </>
              )}

              {searchQuery.trim() && filteredProdutos.length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                  <Ionicons name="search-outline" size={48} color="#CCC" />
                  <Text style={{ color: '#999', marginTop: 16, fontSize: 16 }}>Nenhum produto encontrado</Text>
                </View>
              )}

              {categoriaSelected && filteredProdutos.length > 0 && (
                <>
                  <Text style={styles.searchResultTitle}>Produtos em {categoriaSelected}</Text>
                  <FlatList
                    data={filteredProdutos}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={{ gap: 10 }}
                    renderItem={renderProdutoCard}
                  />
                </>
              )}
            </ScrollView>
          )}
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
  categoriaItemActive: {
    backgroundColor: '#F0F8F4',
    borderLeftWidth: 3,
    borderLeftColor: '#387C59',
    paddingHorizontal: 7,
  },
  categoriaText: { fontSize: 13, color: '#333', marginLeft: 8, fontWeight: '500' },
  categoriaTextActive: { color: '#387C59', fontWeight: '600' },
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
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: '#333', fontSize: 12, fontWeight: '500' },
  searchResultTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginVertical: 16, marginHorizontal: 6 },
  produtoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  produtoImage: { width: '100%', height: 130, resizeMode: 'cover' },
  produtoInfo: { padding: 10 },
  produtoNome: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  produtoProdutor: { fontSize: 11, color: '#999', marginBottom: 8 },
  precoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  preco: { fontSize: 14, fontWeight: '700', color: '#387C59' },
  unidade: { fontSize: 10, color: '#999', fontWeight: '500' },
  addToCartBtn: {
    backgroundColor: '#387C59',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});
