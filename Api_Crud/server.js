console.log('🚀 Iniciando script...')

import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

console.log('📦 Módulos importados')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

// Configuração de Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

console.log('🔄 Configurando servidor...')

// ==========================================
// 👤 ROTAS DE USUÁRIOS
// ==========================================

app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany()
        res.status(200).json(users)
    } catch (error) {
        console.error("❌ Erro GET /usuarios:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" })
    }
})

app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body
        const userExists = await prisma.usuarios.findUnique({ where: { email: email } })
        if (userExists) return res.status(400).json({ error: "Este e-mail já está cadastrado!" })

        const newUser = await prisma.usuarios.create({
            data: {
                nome: nome || email.split('@')[0],
                email: email,
                senha: senha,
                tipo_usuario: tipo_usuario || 'cliente',
                whatsapp: whatsapp || '',
                url_foto: url_foto || ''
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.error("❌ Erro POST /usuarios:", error);
        res.status(500).json({ error: "Erro ao criar usuário" })
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const user = await prisma.usuarios.findUnique({ where: { id: id } })
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
        res.status(200).json(user)
    } catch (error) {
        console.error("❌ Erro GET /usuarios/:id:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" })
    }
})

app.put('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const { nome, email, senha, tipo_usuario, whatsapp, url_foto, cpf_cnpj } = req.body

        const updatedUser = await prisma.usuarios.update({
            where: { id: id },
            data: {
                nome,
                email,
                senha,
                tipo_usuario,
                whatsapp,
                url_foto,
                cpf_cnpj,
                data_atual_izacao: new Date()
            }
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("❌ Erro PUT /usuarios/:id:", error);
        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
})

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        await prisma.usuarios.delete({ where: { id: id } })
        res.status(200).json({ message: "Usuário deletado" })
    } catch (error) {
        console.error("❌ Erro DELETE /usuarios/:id:", error);
        res.status(500).json({ error: "Erro ao deletar usuário" })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body
        const user = await prisma.usuarios.findUnique({ where: { email: email } })
        if (!user || user.senha !== senha) return res.status(401).json({ error: "E-mail ou senha incorretos!" })
        res.status(200).json(user)
    } catch (error) {
        console.error("❌ Erro POST /login:", error);
        res.status(500).json({ error: "Erro interno ao tentar logar" })
    }
})

// ==========================================
// 🏠 ROTAS DE ENDEREÇOS
// ==========================================

app.post('/enderecos', async (req, res) => {
    try {
        const { cep, rua, numero, bairro, cidade, estado, latitude, longitude, usuario_id } = req.body;
        if (!usuario_id) return res.status(400).json({ error: "ID do usuário é obrigatório!" });

        const novoEndereco = await prisma.enderecos.create({
            data: {
                cep,
                rua,
                numero: String(numero),
                bairro,
                cidade,
                estado,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                usuario_id: parseInt(usuario_id)
            }
        })
        res.status(201).json(novoEndereco)
    } catch (error) {
        console.error("❌ Erro POST /enderecos:", error);
        res.status(500).json({ error: "Erro ao salvar endereço" })
    }
})

app.get('/enderecos/usuario/:usuario_id', async (req, res) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id);
        if (isNaN(usuario_id)) return res.status(400).json({ error: "ID inválido" });

        const enderecos = await prisma.enderecos.findMany({ where: { usuario_id: usuario_id } })
        res.status(200).json(enderecos)
    } catch (error) {
        console.error("❌ Erro GET /enderecos/usuario/:usuario_id:", error);
        res.status(500).json({ error: "Erro ao buscar endereços" })
    }
})

app.get('/produtor/dados/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const usuario = await prisma.usuarios.findUnique({
            where: { id: id },
            include: { enderecos: true }
        });
        if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
        res.json({
            nome: usuario.nome,
            localizacao: usuario.enderecos.length > 0 ? usuario.enderecos[0].rua : "Sem endereço cadastrado",
            endereco_id: usuario.enderecos.length > 0 ? usuario.enderecos[0].id : null
        });
    } catch (error) {
        console.error("❌ Erro GET /produtor/dados/:id:", error);
        res.status(500).json({ error: "Erro ao buscar dados na nuvem" });
    }
});

// ==========================================
// 🍏 ROTAS DE PRODUTOS
// ==========================================

// ==========================================
// 🍏 ROTAS DE PRODUTOS
// ==========================================

app.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        const { nome_produto, categoria, preco, unidade, quantidade, produtor_id, endereco_id } = req.body;
        const imagem_url = req.file ? `/uploads/${req.file.filename}` : '';

        const novoProduto = await prisma.produtos.create({
            data: {
                nome_produto,
                categoria,
                preco: parseFloat(preco) || 0,
                unidade,
                quantidade: parseInt(quantidade) || 0,
                produtor_id: parseInt(produtor_id) || 0,
                endereco_id: parseInt(endereco_id) || 0,
                imagem_url,
                status: 'ativo'
            }
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error("❌ Erro POST /produtos:", error);
        res.status(500).json({ error: "Erro ao salvar produto" });
    }
});

// 🟢 ESSA É A ROTA QUE ESTAVA FALTANDO PARA A TELA DE INÍCIO:
app.get('/produtos', async (req, res) => {
    try {
        const listaProdutos = await prisma.produtos.findMany({
            where: { status: 'ativo' }, // Só mostra o que não foi "deletado"
            orderBy: { id: 'desc' },
            include: {
                produtor: { select: { nome: true } },
                endereco: { select: { cidade: true, estado: true } }
            }
        });

        const produtosMapeados = listaProdutos.map(produto => ({
            ...produto,
            nome_produtor: produto.produtor?.nome || "Produtor Local",
            localizacao: produto.endereco ? `${produto.endereco.cidade}, ${produto.endereco.estado}` : null
        }));
        res.status(200).json(produtosMapeados);
    } catch (error) {
        console.error("❌ Erro GET /produtos:", error);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

app.get('/produtos/contar/:produtor_id', async (req, res) => {
    try {
        const produtor_id = parseInt(req.params.produtor_id);
        const total = await prisma.produtos.count({
            where: { 
                produtor_id: produtor_id,
                status: 'ativo' 
            }
        });
        res.status(200).json({ total });
    } catch (error) {
        console.error("❌ Erro ao contar produtos:", error);
        res.status(500).json({ error: "Erro ao contar produtos" });
    }
});



app.put('/produtos/:id', upload.single('imagem'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const { nome_produto, categoria, preco, unidade, quantidade } = req.body;
        const produtoAtual = await prisma.produtos.findUnique({ where: { id: id } });
        if (!produtoAtual) return res.status(404).json({ error: "Produto não encontrado" });

        if (req.file && produtoAtual.imagem_url) {
            const caminhoImagemAntiga = path.join('uploads', path.basename(produtoAtual.imagem_url));
            if (fs.existsSync(caminhoImagemAntiga)) fs.unlinkSync(caminhoImagemAntiga);
        }

        const dadosParaAtualizar = {
            nome_produto,
            categoria,
            preco: parseFloat(preco) || 0,
            unidade,
            quantidade: parseInt(quantidade) || 0,
        };
        if (req.file) dadosParaAtualizar.imagem_url = `/uploads/${req.file.filename}`;

        const produtoAtualizado = await prisma.produtos.update({
            where: { id: id },
            data: dadosParaAtualizar
        });
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        console.error("❌ Erro PUT /produtos/:id:", error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        // 🟢 Em vez de deletar, apenas mudamos o status para 'inativo'
        await prisma.produtos.update({
            where: { id: id },
            data: { status: 'inativo' }
        });

        res.status(200).json({ message: "Produto removido do catálogo (Soft Delete)!" });
    } catch (error) {
        console.error("❌ Erro ao desativar produto:", error);
        res.status(500).json({ error: "Erro ao excluir produto" });
    }
});

// ==========================================
// ⚡ ROTAS DE OFERTA RELÂMPAGO
// ==========================================

app.post('/ofertas', async (req, res) => {
    try {
        const { produto_id, preco_original, preco_promocional, duracao_minutos } = req.body;
        const novaOferta = await prisma.ofertas_relampago.create({
            data: {
                produto_id: parseInt(produto_id) || 0,
                preco_original: parseFloat(preco_original) || 0,
                preco_promocional: parseFloat(preco_promocional) || 0,
                duracao_minutos: parseInt(duracao_minutos) || 0,
                status: 'ativa'
            }
        });
        res.status(201).json(novaOferta);
    } catch (error) {
        console.error("❌ Erro POST /ofertas:", error);
        res.status(500).json({ error: "Erro ao salvar oferta" });
    }
});

app.get('/ofertas', async (req, res) => {
    try {
        const listaOfertas = await prisma.ofertas_relampago.findMany({
            include: {
                produto: true
            },
            orderBy: { criado_em: 'desc' }
        });
        res.status(200).json(listaOfertas);
    } catch (error) {
        console.error("❌ Erro GET /ofertas:", error);
        res.status(500).json({ error: "Erro ao buscar lista de ofertas" });
    }
})

app.delete('/ofertas/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        await prisma.ofertas_relampago.delete({
            where: { id: id }
        });
        res.status(200).json({ message: "Oferta removida com sucesso!" });
    } catch (error) {
        console.error("❌ Erro DELETE /ofertas/:id:", error);
        res.status(500).json({ error: "Erro ao remover oferta" });
    }
})

app.get('/ofertas/destaque', async (req, res) => {
    try {
        // 1. Puxa todas as ofertas que constam como 'ativa' no banco
        const ofertasAtivas = await prisma.ofertas_relampago.findMany({
            where: { status: 'ativa' },
            orderBy: { criado_em: 'desc' },
            include: { produto: true }
        });

        const agora = new Date().getTime();
        let ofertaValida = null;

        // 2. Passa um "pente fino" para achar a primeira que realmente é válida
        for (const oferta of ofertasAtivas) {
            const limite = new Date(oferta.criado_em).getTime() + (oferta.duracao_minutos * 60 * 1000);
            const estoque = oferta.produto.quantidade_estoque || oferta.produto.quantidade;

            if (limite > agora && estoque > 0) {
                // Achou! O tempo não acabou e ainda tem estoque.
                ofertaValida = oferta;
                break; // Para a busca, já achamos o destaque.
            } else {
                // 3. O PULO DO GATO: Se passou do tempo ou zerou, o servidor já "mata" a oferta no banco!
                await prisma.ofertas_relampago.update({
                    where: { id: oferta.id },
                    data: { status: 'inativa' }
                });
            }
        }

        res.status(200).json(ofertaValida);
    } catch (error) {
        console.error("❌ Erro GET /ofertas/destaque:", error);
        res.status(500).json({ error: "Erro ao buscar destaque inteligente" });
    }
});

// =======================================================
// 💳 ROTAS DE MÉTODOS DE PAGAMENTO (CARTÕES)
// =======================================================

app.get('/cartoes/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const cartoes = await prisma.cartoes.findMany({
            where: { usuario_id: parseInt(usuario_id) },
            orderBy: { criado_em: 'desc' }
        });
        res.json(cartoes);
    } catch (error) {
        console.error("Erro ao buscar cartões:", error);
        res.status(500).json({ error: "Erro ao procurar cartões" });
    }
});

app.post('/cartoes', async (req, res) => {
    try {
        const { usuario_id, numero_cartao, bandeira, nome_titular, validade } = req.body;
        if (!usuario_id || !numero_cartao || !bandeira || !nome_titular || !validade) {
            return res.status(400).json({ error: "Dados incompletos" });
        }
        const numero_final = numero_cartao.slice(-4);
        const token_pagamento = `tok_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

        const novoCartao = await prisma.cartoes.create({
            data: {
                usuario_id: parseInt(usuario_id),
                numero_final,
                bandeira,
                nome_titular,
                validade,
                token_pagamento
            }
        });
        res.status(201).json(novoCartao);
    } catch (error) {
        console.error("Erro ao guardar cartão:", error);
        res.status(500).json({ error: "Erro ao guardar o cartão" });
    }
});

app.delete('/cartoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cartoes.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Cartão removido com sucesso" });
    } catch (error) {
        console.error("Erro ao apagar cartão:", error);
        res.status(500).json({ error: "Erro ao remover cartão" });
    }
});

// =======================================================
// 🛒 ROTAS DE PEDIDOS (TOTALMENTE ATUALIZADO)
// =======================================================

app.post('/pedidos', async (req, res) => {
    try {
        // 🟢 MUDANÇA AQUI: Recebendo cliente_id do frontend
        const { cliente_id, total, metodo_pagamento, itens } = req.body;

        if (!cliente_id || !itens || itens.length === 0) {
            return res.status(400).json({ error: "Dados do pedido incompletos" });
        }

        const resultado = await prisma.$transaction(async (tx) => {
            const pedido = await tx.pedidos.create({
                data: {
                    cliente_id: parseInt(cliente_id), // 🟢 MUDANÇA AQUI: usando cliente_id
                    total: parseFloat(total),
                    metodo_pagamento,
                    status: 'pendente',
                    itens: {
                        create: itens.map(item => ({
                            produto_id: parseInt(item.produto_id),
                            quantidade: parseInt(item.quantidade),
                            preco_unit: parseFloat(item.preco_unitario) // 🟢 MUDANÇA AQUI: usando preco_unit
                        }))
                    }
                }
            });

            for (const item of itens) {
                await tx.produtos.update({
                    where: { id: parseInt(item.produto_id) },
                    data: {
                        quantidade: {
                            decrement: parseInt(item.quantidade)
                        }
                    }
                });
            }
            return pedido;
        });

        res.status(201).json(resultado);
    } catch (error) {
        console.error("❌ Erro ao processar pedido:", error);
        res.status(500).json({ error: "Erro interno ao processar pedido" });
    }
});

// 🟢 MUDANÇA AQUI: Rota usando cliente_id
app.get('/pedidos/usuario/:cliente_id', async (req, res) => {
    try {
        const cliente_id = parseInt(req.params.cliente_id);
        const listaPedidos = await prisma.pedidos.findMany({
            where: { cliente_id: cliente_id },
            include: {
                // 🟢 1. Traz os dados do Cliente e o endereço de entrega dele
                cliente: {
                    include: { enderecos: true }
                },
                // 🟢 2. Entra nos itens do pedido para buscar os dados do Produto
                itens: {
                    include: {
                        produto: {
                            include: {
                                produtor: true,
                                endereco: true
                            }
                        }
                    }
                }
            },
            orderBy: { data_pedido: 'desc' }
        });
        res.json(listaPedidos);
    } catch (error) {
        console.error("❌ Erro ao buscar histórico de pedidos:", error);
        res.status(500).json({ error: "Erro ao buscar histórico" });
    }
});


// =======================================================
// 📦 ROTAS EXCLUSIVAS DO PRODUTOR (GERENCIAR VENDAS)
// =======================================================

// 1. Busca todos os pedidos que têm produtos desse produtor
app.get('/pedidos/produtor/:produtor_id', async (req, res) => {
    try {
        const produtor_id = parseInt(req.params.produtor_id);
        const listaVendas = await prisma.pedidos.findMany({
            where: {
                itens: {
                    some: {
                        produto: {
                            produtor_id: produtor_id
                        }
                    }
                }
            },
            include: {
                cliente: { select: { nome: true, whatsapp: true } }, // Traz os dados do cliente
                itens: {
                    include: {
                        produto: { select: { nome_produto: true, preco: true } }
                    }
                }
            },
            orderBy: { data_pedido: 'desc' }
        });
        res.json(listaVendas);
    } catch (error) {
        console.error("❌ Erro ao buscar vendas do produtor:", error);
        res.status(500).json({ error: "Erro ao buscar vendas" });
    }
});

// 2. Atualiza o status do pedido (Pendente -> Preparação -> Entregue)
app.put('/pedidos/:id/status', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        const pedidoAtualizado = await prisma.pedidos.update({
            where: { id: id },
            data: { status: status }
        });

        res.json({ message: "Status atualizado com sucesso", pedido: pedidoAtualizado });
    } catch (error) {
        console.error("❌ Erro ao atualizar status:", error);
        res.status(500).json({ error: "Erro ao atualizar status" });
    }
});
console.log('📝 Endpoints registrados')

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})