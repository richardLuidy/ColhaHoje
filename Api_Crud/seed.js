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
    }
  ];

  for (const prod of produtosNovos) {
    await prisma.produtos.create({ data: prod });
  }

  // 4. Criar comprador
  const comprador1 = await prisma.usuarios.create({
    data: {
      nome: 'Cliente João',
      email: 'cliente@teste.com',
      senha: '123',
      tipo_usuario: 'cliente',
    },
  });

  // 5. Criar pedidos fictícios para o comprador
  const produtoParaPedido1 = await prisma.produtos.findFirst({ where: { nome_produto: 'Banana Prata' } });
  const produtoParaPedido2 = await prisma.produtos.findFirst({ where: { nome_produto: 'Morangos Frescos' } });
  const produtoParaPedido3 = await prisma.produtos.findFirst({ where: { nome_produto: 'Abacate Hass' } });

  if (produtoParaPedido1 && produtoParaPedido2 && produtoParaPedido3) {
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
