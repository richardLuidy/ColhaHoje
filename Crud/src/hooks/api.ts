import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../api';

// Hook para buscar produtos
export const useProdutos = () => {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      return response.json();
    },
  });
};

// Hook para buscar ofertas relâmpago
export const useOfertasRelampago = () => {
  return useQuery({
    queryKey: ['ofertas-relampago'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/ofertas-relampago`);
      if (!response.ok) throw new Error('Erro ao buscar ofertas relâmpago');
      return response.json();
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });
};

// Hook para buscar produtores com endereços
export const useProdutores = () => {
  return useQuery({
    queryKey: ['produtores'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/produtores`);
      if (!response.ok) throw new Error('Erro ao buscar produtores');
      return response.json();
    },
  });
};

// Hook para buscar endereços do usuário
export const useEnderecos = (usuarioId?: number) => {
  return useQuery({
    queryKey: ['enderecos', usuarioId],
    queryFn: async () => {
      if (!usuarioId) return [];
      const response = await fetch(`${API_URL}/enderecos?usuarioId=${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao buscar endereços');
      return response.json();
    },
    enabled: !!usuarioId,
  });
};

// Hook para criar produto
export const useCreateProduto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (produtoData: FormData) => {
      const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        body: produtoData,
      });
      if (!response.ok) throw new Error('Erro ao criar produto');
      return response.json();
    },
    onSuccess: () => {
      // Invalida e refetch produtos após criação
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
};

// Hook para criar endereço
export const useCreateEndereco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enderecoData: any) => {
      const response = await fetch(`${API_URL}/enderecos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enderecoData),
      });
      if (!response.ok) throw new Error('Erro ao criar endereço');
      return response.json();
    },
    onSuccess: () => {
      // Invalida endereços após criação
      queryClient.invalidateQueries({ queryKey: ['enderecos'] });
    },
  });
};