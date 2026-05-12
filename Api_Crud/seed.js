import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.pedidos.deleteMany({});
  await prisma.ofertas_relampago.deleteMany({});
  await prisma.produtos.deleteMany({});
  await prisma.enderecos.deleteMany({});
  await prisma.usuarios.deleteMany({});

  console.log('Iniciando inserção de dados fictícios...');

  // 1. Criar produtor 1
  const produtor1 = await prisma.usuarios.create({
    data: {
      nome: 'João Fazendeiro',
      email: 'joao@fazenda.com',
      senha: '123',
      tipo_usuario: 'vendedor',
      whatsapp: '11999999999',
    },
  });

  // Endereço Produtor 1
  const end1 = await prisma.enderecos.create({
    data: {
      cep: '11900000',
      rua: 'Estrada do Campo',
      numero: 'S/N',
      bairro: 'Zona Rural',
      cidade: 'Registro',
      estado: 'SP',
      usuario_id: produtor1.id,
    },
  });

  // 2. Criar produtor 2
  const produtor2 = await prisma.usuarios.create({
    data: {
      nome: 'Maria das Frutas',
      email: 'maria@frutas.com',
      senha: '123',
      tipo_usuario: 'vendedor',
      whatsapp: '11988888888',
    },
  });

  // Endereço Produtor 2
  const end2 = await prisma.enderecos.create({
    data: {
      cep: '11900000',
      rua: 'Sítio das Bananeiras',
      numero: '120',
      bairro: 'Rural',
      cidade: 'Registro',
      estado: 'SP',
      usuario_id: produtor2.id,
    },
  });

  // 3. Criar produtos fictícios
  const produtos = [
    {
      nome_produto: 'Tomate Cereja',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 8.50,
      unidade: 'Caixa 500g',
      quantidade: 20,
      imagem_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Alface Crespa',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Convencional',
      preco: 3.00,
      unidade: 'Unidade',
      quantidade: 50,
      imagem_url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9e6a03?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Banana Prata',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 5.00,
      unidade: 'Dúzia',
      quantidade: 30,
      imagem_url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Maçã Fuji',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Fruta',
      preco: 9.90,
      unidade: 'Kg',
      quantidade: 15,
      imagem_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Milho Verde',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 12.00,
      unidade: 'Bandeja',
      quantidade: 10,
      imagem_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Cenoura Orgânica',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 6.50,
      unidade: 'Maço',
      quantidade: 25,
      imagem_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Morangos Frescos',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Fruta',
      preco: 15.00,
      unidade: 'Bandeja 250g',
      quantidade: 40,
      imagem_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Laranja Pera',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Fruta',
      preco: 4.50,
      unidade: 'Kg',
      quantidade: 60,
      imagem_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Abóbora Cabotiá',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legume',
      preco: 3.50,
      unidade: 'Kg',
      quantidade: 15,
      imagem_url: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Pimentão Vermelho',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legume',
      preco: 7.00,
      unidade: 'Bandeja 300g',
      quantidade: 20,
      imagem_url: 'https://images.unsplash.com/photo-1582281267438-e6b761005a8b?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Limão Taiti',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Fruta',
      preco: 2.99,
      unidade: 'Kg',
      quantidade: 100,
      imagem_url: 'https://images.unsplash.com/photo-1590502593747-422e15fb6f1c?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Ovo Caipira',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 18.00,
      unidade: 'Dúzia',
      quantidade: 50,
      imagem_url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Cebola Roxa',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legume',
      preco: 5.50,
      unidade: 'Kg',
      quantidade: 40,
      imagem_url: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Batata Inglesa',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Raízes',
      preco: 4.80,
      unidade: 'Kg',
      quantidade: 80,
      imagem_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Palmito Pupunha',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Especial Vale',
      preco: 25.00,
      unidade: 'Pote 300g',
      quantidade: 30,
      imagem_url: 'https://images.unsplash.com/photo-1628205461947-fde0f2694cd7?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    }
  ];

  for (const prod of produtos) {
    await prisma.produtos.create({ data: prod });
  }

  // Novos Produtos Fictícios com Fotos
  const produtosNovos = [
    {
      nome_produto: 'Abacate Hass',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Orgânico',
      preco: 10.00,
      unidade: 'Kg',
      quantidade: 15,
      imagem_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Uva Niágara',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 12.50,
      unidade: 'Caixa 500g',
      quantidade: 40,
      imagem_url: 'https://images.unsplash.com/photo-1596365548680-e374526017ad?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Beringela',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legumes',
      preco: 4.00,
      unidade: 'Kg',
      quantidade: 20,
      imagem_url: 'https://images.unsplash.com/photo-1615486511484-9ec49b14f866?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Mandioca',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Raízes',
      preco: 3.50,
      unidade: 'Kg',
      quantidade: 50,
      imagem_url: 'https://images.unsplash.com/photo-1593006232230-07e3a3528b8a?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Couve Manteiga',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Verduras',
      preco: 2.50,
      unidade: 'Maço',
      quantidade: 30,
      imagem_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Melancia Vermelha',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 20.00,
      unidade: 'Unidade',
      quantidade: 10,
      imagem_url: 'https://images.unsplash.com/photo-1585518419759-1b95cc6670e8?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Alho Francês',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legumes',
      preco: 4.50,
      unidade: 'Maço',
      quantidade: 35,
      imagem_url: 'https://images.unsplash.com/photo-1585647322838-edd77d17f4ee?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Brócolis Orgânico',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Verduras',
      preco: 7.00,
      unidade: 'Unidade',
      quantidade: 25,
      imagem_url: 'https://images.unsplash.com/photo-1601618528167-23ace3c24733?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Maracujá Amarelo',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 8.00,
      unidade: 'Kg',
      quantidade: 20,
      imagem_url: 'https://images.unsplash.com/photo-1473093295203-786d92d87868?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Acerola Vermelha',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 16.00,
      unidade: 'Caixa 500g',
      quantidade: 15,
      imagem_url: 'https://images.unsplash.com/photo-1596195694636-e1aa1a8a46f9?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Rúcula Fresca',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Verduras',
      preco: 3.50,
      unidade: 'Maço',
      quantidade: 40,
      imagem_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Beterraba Roxa',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Raízes',
      preco: 5.00,
      unidade: 'Kg',
      quantidade: 50,
      imagem_url: 'https://images.unsplash.com/photo-1585518419759-64dddb0e7b0f?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Repolho Verde',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Verduras',
      preco: 4.50,
      unidade: 'Unidade',
      quantidade: 30,
      imagem_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Goiaba Branca',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 9.00,
      unidade: 'Kg',
      quantidade: 18,
      imagem_url: 'https://images.unsplash.com/photo-1585620674026-3742bae4f049?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Pimenta Malagueta',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legumes',
      preco: 6.00,
      unidade: 'Maço',
      quantidade: 25,
      imagem_url: 'https://images.unsplash.com/photo-1583034313398-5a94c41d5a45?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Abobrinha Verde',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legumes',
      preco: 4.00,
      unidade: 'Kg',
      quantidade: 40,
      imagem_url: 'https://images.unsplash.com/photo-1609681865557-0c7e07a4ea5d?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Tomate Italiano',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Legumes',
      preco: 7.50,
      unidade: 'Kg',
      quantidade: 35,
      imagem_url: 'https://images.unsplash.com/photo-1592841657335-f3f122fa7f0f?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    },
    {
      nome_produto: 'Melão Cantaloupe',
      nome_produtor: produtor2.nome,
      localizacao: 'Registro, SP',
      categoria: 'Frutas',
      preco: 18.00,
      unidade: 'Unidade',
      quantidade: 12,
      imagem_url: 'https://images.unsplash.com/photo-1599599810694-d3a6b53aab20?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor2.id,
      endereco_id: end2.id,
    },
    {
      nome_produto: 'Espinafre Orgânico',
      nome_produtor: produtor1.nome,
      localizacao: 'Registro, SP',
      categoria: 'Verduras',
      preco: 5.50,
      unidade: 'Maço',
      quantidade: 30,
      imagem_url: 'https://images.unsplash.com/photo-1599904490221-9c0f7f13126c?q=80&w=400&auto=format&fit=crop',
      produtor_id: produtor1.id,
      endereco_id: end1.id,
    }
  ];

  for (const prod of produtosNovos) {
    await prisma.produtos.create({ data: prod });
  }

  // 5. Criar comprador
  const comprador1 = await prisma.usuarios.create({
    data: {
      nome: 'Cliente João',
      email: 'cliente@teste.com',
      senha: '123',
      tipo_usuario: 'cliente',
    },
  });

  // 5. Criar pedidos fictícios para o comprador com múltiplos status
  const produtoParaPedido1 = await prisma.produtos.findFirst({ where: { nome_produto: 'Banana Prata' } });
  const produtoParaPedido2 = await prisma.produtos.findFirst({ where: { nome_produto: 'Morangos Frescos' } });
  const produtoParaPedido3 = await prisma.produtos.findFirst({ where: { nome_produto: 'Abacate Hass' } });
  const produtoParaPedido4 = await prisma.produtos.findFirst({ where: { nome_produto: 'Melancia Vermelha' } });
  const produtoParaPedido5 = await prisma.produtos.findFirst({ where: { nome_produto: 'Brócolis Orgânico' } });
  const produtoParaPedido6 = await prisma.produtos.findFirst({ where: { nome_produto: 'Maracujá Amarelo' } });
  const produtoParaPedido7 = await prisma.produtos.findFirst({ where: { nome_produto: 'Acerola Vermelha' } });
  const produtoParaPedido8 = await prisma.produtos.findFirst({ where: { nome_produto: 'Tomate Cereja' } });

  if (produtoParaPedido1 && produtoParaPedido2 && produtoParaPedido3 && produtoParaPedido4) {
    // Pedido 1 - Em andamento
    await prisma.pedidos.create({
      data: {
        comprador_id: comprador1.id,
        produto_id: produtoParaPedido1.id,
        quantidade: 2,
        preco_total: produtoParaPedido1.preco * 2,
        status: 'andamento',
        data_pedido: new Date(),
      }
    });

    // Pedido 2 - Concluído/Entregue
    await prisma.pedidos.create({
      data: {
        comprador_id: comprador1.id,
        produto_id: produtoParaPedido2.id,
        quantidade: 1,
        preco_total: produtoParaPedido2.preco * 1,
        status: 'concluido',
        data_pedido: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 dias atrás
      }
    });

    // Pedido 3 - Cancelado
    await prisma.pedidos.create({
      data: {
        comprador_id: comprador1.id,
        produto_id: produtoParaPedido3.id,
        quantidade: 3,
        preco_total: produtoParaPedido3.preco * 3,
        status: 'cancelado',
        data_pedido: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 dias atrás
      }
    });

    // Pedido 4 - Em andamento
    await prisma.pedidos.create({
      data: {
        comprador_id: comprador1.id,
        produto_id: produtoParaPedido4.id,
        quantidade: 1,
        preco_total: produtoParaPedido4.preco,
        status: 'andamento',
        data_pedido: new Date(new Date().setHours(new Date().getHours() - 2)),
      }
    });

    // Pedido 5 - Concluído/Entregue
    if (produtoParaPedido5) {
      await prisma.pedidos.create({
        data: {
          comprador_id: comprador1.id,
          produto_id: produtoParaPedido5.id,
          quantidade: 2,
          preco_total: produtoParaPedido5.preco * 2,
          status: 'concluido',
          data_pedido: new Date(new Date().setDate(new Date().getDate() - 15)), // 15 dias atrás
        }
      });
    }

    // Pedido 6 - Entregue
    if (produtoParaPedido6) {
      await prisma.pedidos.create({
        data: {
          comprador_id: comprador1.id,
          produto_id: produtoParaPedido6.id,
          quantidade: 4,
          preco_total: produtoParaPedido6.preco * 4,
          status: 'concluido',
          data_pedido: new Date(new Date().setDate(new Date().getDate() - 20)), // 20 dias atrás
        }
      });
    }

    // Pedido 7 - Cancelado
    if (produtoParaPedido7) {
      await prisma.pedidos.create({
        data: {
          comprador_id: comprador1.id,
          produto_id: produtoParaPedido7.id,
          quantidade: 2,
          preco_total: produtoParaPedido7.preco * 2,
          status: 'cancelado',
          data_pedido: new Date(new Date().setDate(new Date().getDate() - 25)), // 25 dias atrás
        }
      });
    }

    // Pedido 8 - Em andamento/Recente
    if (produtoParaPedido8) {
      await prisma.pedidos.create({
        data: {
          comprador_id: comprador1.id,
          produto_id: produtoParaPedido8.id,
          quantidade: 5,
          preco_total: produtoParaPedido8.preco * 5,
          status: 'andamento',
          data_pedido: new Date(),
        }
      });
    }
  }

  // 6. Criar uma Oferta Relâmpago
  const produtoOferta = await prisma.produtos.findFirst({ where: { nome_produto: 'Banana Prata' } });
  if (produtoOferta) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta.id,
        preco_original: produtoOferta.preco,
        preco_promocional: 2.99,
        duracao_minutos: 60,
        status: 'ativa',
      }
    });
  }

  console.log('Dados inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
