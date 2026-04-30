import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface CartItem {
  id: number;
  nome_produto: string;
  preco: number;
  imagem_url: string;
  quantidade: number;
  estoque: number; // 🟢 Armazena o limite vindo do produtor
}

interface CartContextData {
  items: CartItem[];
  adicionarAoCarrinho: (produto: any) => void;
  removerDoCarrinho: (id: number) => void;
  atualizarQuantidade: (id: number, acao: 'aumentar' | 'diminuir') => void;
  limparCarrinho: () => void;
  quantidadeTotal: number;
  valorTotal: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    async function loadCart() {
      const savedCart = await AsyncStorage.getItem('@ColhaHoje:cart');
      if (savedCart) setItems(JSON.parse(savedCart));
    }
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@ColhaHoje:cart', JSON.stringify(items));
  }, [items]);

  const adicionarAoCarrinho = (produto: any) => {
    setItems(prev => {
      const index = prev.findIndex(item => item.id === produto.id);
      
      // 🟢 Verifica o campo de estoque vindo da sua API (ajuste o nome se necessário)
      const estoqueDisponivel = produto.quantidade_estoque || produto.quantidade || 0;

      if (index >= 0) {
        const newItems = [...prev];
        // Valida se ainda há estoque para adicionar mais um
        if (newItems[index].quantidade < estoqueDisponivel) {
          newItems[index].quantidade += 1;
        } else {
          Alert.alert("Limite atingido", `O produtor possui apenas ${estoqueDisponivel} unidades disponíveis.`);
        }
        return newItems;
      }
      
      return [...prev, { 
        id: produto.id, 
        nome_produto: produto.nome_produto, 
        preco: parseFloat(produto.preco),
        imagem_url: produto.imagem_url,
        quantidade: 1,
        estoque: estoqueDisponivel
      }];
    });
  };

  const atualizarQuantidade = (id: number, acao: 'aumentar' | 'diminuir') => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (acao === 'aumentar') {
          // 🟢 Bloqueia o aumento se atingir o estoque
          if (item.quantidade < item.estoque) {
            return { ...item, quantidade: item.quantidade + 1 };
          } else {
            Alert.alert("Estoque Máximo", `Não é possível adicionar mais de ${item.estoque} unidades.`);
            return item;
          }
        }
        return { ...item, quantidade: Math.max(1, item.quantidade - 1) };
      }
      return item;
    }));
  };

  const removerDoCarrinho = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const limparCarrinho = () => setItems([]);

  const quantidadeTotal = items.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = items.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider value={{ 
      items, adicionarAoCarrinho, removerDoCarrinho, 
      atualizarQuantidade, limparCarrinho, quantidadeTotal, valorTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);