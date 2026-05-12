import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { colors } from '../../colors';

interface CarrinhoProps {
  onNavigateToPedidos?: () => void;
  onContinueShopping?: () => void;
}

export default function Carrinho({ onNavigateToPedidos, onContinueShopping }: CarrinhoProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(3); // Cliente João (do seed)

  const handleFinalizarCompra = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione produtos ao carrinho antes de finalizar a compra');
      return;
    }

    setLoading(true);
    try {
      // Criar um pedido para cada item do carrinho
      for (const item of items) {
        const response = await fetch('http://192.168.0.116:3000/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comprador_id: userId,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_total: item.preco * item.quantidade,
            status: 'andamento',
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar pedido');
        }
      }

      Alert.alert('Sucesso!', 'Pedido realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            if (onNavigateToPedidos) {
              onNavigateToPedidos();
            }
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao finalizar compra. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        // CARRINHO VAZIO
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Carrinho Vazio</Text>
          <Text style={styles.emptyText}>Adicione produtos para começar suas compras</Text>
        </View>
      ) : (
        // CARRINHO COM ITENS
        <>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.scrollContent}>
            {items.map((item) => (
              <View key={item.produto_id} style={styles.cartItem}>
                <Image source={{ uri: item.imagem_url }} style={styles.itemImage} />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.nome_produto}</Text>
                  <Text style={styles.itemProducer}>{item.nome_produtor}</Text>
                  <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
                </View>

                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                  >
                    <Text style={styles.quantityBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{item.quantidade}</Text>

                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item.produto_id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#E57373" />
                </TouchableOpacity>
              </View>
            ))}

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* RESUMO */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
                <Text style={styles.summaryValue}>R$ 5,00</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R$ {(totalPrice + 5).toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>
            </View>
          </ScrollView>

          {/* BOTÕES AÇÃO */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.btnContinueShopping}
              onPress={() => onContinueShopping && onContinueShopping()}
            >
              <Text style={styles.btnContinueShoppingText}>Continuar Comprando</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnCheckout, loading && { opacity: 0.6 }]}
              onPress={handleFinalizarCompra}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnCheckoutText}>Finalizar Compra</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemProducer: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#387C59',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 8,
  },
  quantityBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#387C59',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 6,
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
    marginVertical: 0,
  },
  summary: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#387C59',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  btnContinueShopping: {
    borderWidth: 2,
    borderColor: '#387C59',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnContinueShoppingText: {
    color: '#387C59',
    fontSize: 14,
    fontWeight: '600',
  },
  btnCheckout: {
    backgroundColor: '#387C59',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnCheckoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
