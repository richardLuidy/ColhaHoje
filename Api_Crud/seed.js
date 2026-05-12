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

  // 0. Criar usuário admin
  const admin = await prisma.usuarios.create({
    data: {
      nome: 'Admin ColhaHoje',
      email: 'admin@colhahoje.com',
      senha: 'admin123',
      tipo_usuario: 'admin',
      whatsapp: '11987654321',
    },
  });

  // Cliente padrão (João)
  const cliente = await prisma.usuarios.create({
    data: {
      nome: 'João Cliente',
      email: 'joao@cliente.com',
      senha: '123',
      tipo_usuario: 'cliente',
      whatsapp: '11988888888',
    },
  });

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
      imagem_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9e6a03?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1590502593747-422e15fb6f1c?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1596365548680-e374526017ad?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1615486511484-9ec49b14f866?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784210?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9e6a03?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1590621239259-5c2c2c3e0f5e?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1583034313398-5a94c41d5a45?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400',
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
      imagem_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
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

  // 6. Criar múltiplas Ofertas Relâmpago
  const produtoOferta1 = await prisma.produtos.findFirst({ where: { nome_produto: 'Banana Prata' } });
  if (produtoOferta1) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta1.id,
        preco_original: produtoOferta1.preco,
        preco_promocional: 2.99,
        duracao_minutos: 60,
        status: 'ativa',
      }
    });
  }

  // Oferta 2 - Tomate Cereja
  const produtoOferta2 = await prisma.produtos.findFirst({ where: { nome_produto: 'Tomate Cereja' } });
  if (produtoOferta2) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta2.id,
        preco_original: produtoOferta2.preco,
        preco_promocional: 5.99,
        duracao_minutos: 90,
        status: 'ativa',
      }
    });
  }

  // Oferta 3 - Morangos Frescos
  const produtoOferta3 = await prisma.produtos.findFirst({ where: { nome_produto: 'Morangos Frescos' } });
  if (produtoOferta3) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta3.id,
        preco_original: produtoOferta3.preco,
        preco_promocional: 9.99,
        duracao_minutos: 120,
        status: 'ativa',
      }
    });
  }

  // Oferta 4 - Abacate Hass
  const produtoOferta4 = await prisma.produtos.findFirst({ where: { nome_produto: 'Abacate Hass' } });
  if (produtoOferta4) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta4.id,
        preco_original: produtoOferta4.preco,
        preco_promocional: 6.99,
        duracao_minutos: 60,
        status: 'ativa',
      }
    });
  }

  // Oferta 5 - Melancia Vermelha
  const produtoOferta5 = await prisma.produtos.findFirst({ where: { nome_produto: 'Melancia Vermelha' } });
  if (produtoOferta5) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta5.id,
        preco_original: produtoOferta5.preco,
        preco_promocional: 12.99,
        duracao_minutos: 180,
        status: 'ativa',
      }
    });
  }

  // Oferta 6 - Maçã Fuji
  const produtoOferta6 = await prisma.produtos.findFirst({ where: { nome_produto: 'Maçã Fuji' } });
  if (produtoOferta6) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta6.id,
        preco_original: produtoOferta6.preco,
        preco_promocional: 6.99,
        duracao_minutos: 90,
        status: 'ativa',
      }
    });
  }

  // Oferta 7 - Uva Niágara
  const produtoOferta7 = await prisma.produtos.findFirst({ where: { nome_produto: 'Uva Niágara' } });
  if (produtoOferta7) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta7.id,
        preco_original: produtoOferta7.preco,
        preco_promocional: 8.99,
        duracao_minutos: 120,
        status: 'ativa',
      }
    });
  }

  // Oferta 8 - Brócolis Orgânico
  const produtoOferta8 = await prisma.produtos.findFirst({ where: { nome_produto: 'Brócolis Orgânico' } });
  if (produtoOferta8) {
    await prisma.ofertas_relampago.create({
      data: {
        produto_id: produtoOferta8.id,
        preco_original: produtoOferta8.preco,
        preco_promocional: 4.99,
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
