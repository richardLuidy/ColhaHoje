import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  produto_id: number;
  nome_produto: string;
  imagem_url: string;
  preco: number;
  quantidade: number;
  nome_produtor: string;
  unidade: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (produto: any, quantidade: number) => void;
  removeFromCart: (produto_id: number) => void;
  updateQuantity: (produto_id: number, quantidade: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calcular total de itens
  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  // Calcular preço total
  const totalPrice = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  // Adicionar ao carrinho
  const addToCart = (produto: any, quantidade: number) => {
    setItems((prevItems) => {
      // Verificar se o produto já existe no carrinho
      const existingItem = prevItems.find((item) => item.produto_id === produto.id);

      if (existingItem) {
        // Se existe, aumentar a quantidade
        return prevItems.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Se não existe, adicionar novo item
        return [
          ...prevItems,
          {
            id: produto.id,
            produto_id: produto.id,
            nome_produto: produto.nome_produto,
            imagem_url: produto.imagem_url,
            preco: parseFloat(produto.preco.toString()),
            quantidade,
            nome_produtor: produto.nome_produtor,
            unidade: produto.unidade,
          },
        ];
      }
    });
  };

  // Remover do carrinho
  const removeFromCart = (produto_id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.produto_id !== produto_id));
  };

  // Atualizar quantidade
  const updateQuantity = (produto_id: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produto_id);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.produto_id === produto_id ? { ...item, quantidade } : item
        )
      );
    }
  };

  // Limpar carrinho
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};
