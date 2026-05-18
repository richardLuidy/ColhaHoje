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
                // 🟢 CORRIGIDO: Mudado de data_atualizacao para data_atual_izacao conforme o seu schema mapeado
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
        const { cep, rua, numero, bairro, cidade, estado, usuario_id } = req.body;
        if (!usuario_id) return res.status(400).json({ error: "ID do usuário é obrigatório!" });

        const novoEndereco = await prisma.enderecos.create({
            data: {
                cep, rua, numero: String(numero), bairro, cidade, estado,
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
// 🍏 ROTAS DE PRODUTOS (CORRIGIDA)
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
                imagem_url
                // 🟢 REMOVIDO: nome_produtor foi tirado daqui pois não existe essa coluna no seu schema.prisma!
            }
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error("❌ Erro POST /produtos:", error);
        res.status(500).json({ error: "Erro ao salvar produto" });
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const listaProdutos = await prisma.produtos.findMany({
            orderBy: { id: 'desc' },
            include: {
                // 🟢 CORREÇÃO: Mudado de 'usuario' para 'produtor' conforme seu schema
                produtor: { select: { nome: true } }, 
                endereco: { select: { cidade: true, estado: true } }
            }
        });

        const produtosMapeados = listaProdutos.map(produto => ({
            ...produto,
            // 🟢 CORREÇÃO: Puxando o nome do produtor do relacionamento correto
            nome_produtor: produto.produtor?.nome || produto.nome_produtor || "Produtor Local",
            localizacao: produto.endereco ? `${produto.endereco.cidade}, ${produto.endereco.estado}` : produto.localizacao
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
            where: { produtor_id: produtor_id }
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
            // 🟢 REMOVIDO: nome_produtor tirado daqui para manter a consistência do banco
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

        await prisma.produtos.delete({ where: { id: id } });
        res.status(200).json({ message: "Produto removido do catálogo com sucesso!" });
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
            include: { produto: true },
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

        await prisma.ofertas_relampago.delete({ where: { id: id } });
        res.status(200).json({ message: "Oferta removida com sucesso!" });
    } catch (error) {
        console.error("❌ Erro DELETE /ofertas/:id:", error);
        res.status(500).json({ error: "Erro ao remover oferta" });
    }
})

app.get('/ofertas/destaque', async (req, res) => {
    try {
        const ofertasAtivas = await prisma.ofertas_relampago.findMany({
            where: { status: 'ativa' },
            orderBy: { criado_em: 'desc' },
            include: { produto: true }
        });

        const agora = new Date().getTime();
        let ofertaValida = null;

        for (const oferta of ofertasAtivas) {
            const limite = new Date(oferta.criado_em).getTime() + (oferta.duracao_minutos * 60 * 1000);
            const estoque = oferta.produto?.quantidade || 0;

            if (limite > agora && estoque > 0) {
                ofertaValida = oferta;
                break; 
            } else {
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
// 💳 ROTAS DE MÉTODOS DE PAGAMENTO (CARTÕES) - CORRIGIDA
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
        console.log("💳 Dados recebidos para criar cartão:", req.body);
        const { usuario_id, numero_cartao, bandeira, nome_titular, validade } = req.body;
        
        if (!usuario_id || !numero_cartao || !bandeira || !nome_titular || !validade) {
            return res.status(400).json({ error: "Dados incompletos do cartão" });
        }

        // 🛡️ Verifica se o usuário realmente existe antes de salvar (Integridade P2003)
        const usuarioExiste = await prisma.usuarios.findUnique({ where: { id: parseInt(usuario_id) } });
        if (!usuarioExiste) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const numero_final = String(numero_cartao).slice(-4);
        const token_gerado = `tok_${Math.random().toString(36).substr(2, 9)}`;

        const novoCartao = await prisma.cartoes.create({
            data: {
                usuario_id: parseInt(usuario_id),
                numero_final: numero_final,
                bandeira,
                nome_titular,
                validade,
                token_pagamento: token_gerado
            }
        });

        console.log("✅ Cartão salvo com sucesso!");
        res.status(201).json(novoCartao);
    } catch (error) {
        console.error("❌ Erro ao guardar cartão:", error);
        res.status(500).json({ error: "Erro interno ao salvar cartão" });
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
// 🛒 ROTAS DE PEDIDOS - BLINDADO CONTRA P2003
// =======================================================

app.post('/pedidos', async (req, res) => {
    try {
        const comprador_id = req.body.comprador_id || req.body.cliente_id;
        const itens = req.body.itens || [{
            produto_id: req.body.produto_id,
            quantidade: req.body.quantidade,
            preco_unitario: req.body.preco_total || req.body.total
        }];

        if (!comprador_id) {
            return res.status(400).json({ error: "ID do comprador não enviado." });
        }

        const compradorExiste = await prisma.usuarios.findUnique({ where: { id: parseInt(comprador_id) } });
        if (!compradorExiste) {
            return res.status(404).json({ error: "Usuário comprador não encontrado." });
        }

        const resultados = [];
        
        for (const item of itens) {
            if (!item.produto_id) continue;

            const produtoExiste = await prisma.produtos.findUnique({ where: { id: parseInt(item.produto_id) } });
            if (!produtoExiste) continue;

            const pedido = await prisma.pedidos.create({
                data: {
                    comprador_id: parseInt(comprador_id),
                    produto_id: parseInt(item.produto_id),
                    quantidade: parseInt(item.quantidade) || 1,
                    preco_total: parseFloat(item.preco_unitario || req.body.total || 0),
                    status: 'andamento'
                }
            });
            resultados.push(pedido);

            try {
                await prisma.produtos.update({
                    where: { id: parseInt(item.produto_id) },
                    data: { quantidade: { decrement: parseInt(item.quantidade) || 1 } }
                });
            } catch (e) {}
        }

        res.status(201).json(resultados.length === 1 ? resultados[0] : resultados);
    } catch (error) {
        console.error("❌ Erro ao processar pedido:", error);
        res.status(500).json({ error: "Erro interno ao processar pedido" });
    }
});

app.get('/pedidos/usuario/:cliente_id', async (req, res) => {
    try {
        const comprador_id = parseInt(req.params.cliente_id);
        const listaPedidos = await prisma.pedidos.findMany({
            where: { comprador_id: comprador_id },
            include: {
                comprador: { include: { enderecos: true } },
                produto: {
                    include: {
                        produtor: true, // 🟢 CORREÇÃO: Mudado de 'usuario' para 'produtor'
                        endereco: true
                    }
                }
            },
            orderBy: { data_pedido: 'desc' }
        });
        res.json(listaPedidos);
    } catch (error) {
        console.error("❌ Erro ao buscar pedidos:", error);
        res.status(500).json({ error: "Erro ao buscar histórico" });
    }
});


// =======================================================
// 📦 ROTAS EXCLUSIVAS DO PRODUTOR (GERENCIAR VENDAS)
// =======================================================

app.get('/pedidos/produtor/:produtor_id', async (req, res) => {
    try {
        const produtor_id = parseInt(req.params.produtor_id);
        const listaVendas = await prisma.pedidos.findMany({
            where: {
                produto: { produtor_id: produtor_id }
            },
            include: {
                comprador: { select: { nome: true, whatsapp: true } }, 
                produto: { select: { nome_produto: true, preco: true } }
            },
            orderBy: { data_pedido: 'desc' }
        });
        res.json(listaVendas);
    } catch (error) {
        console.error("❌ Erro ao buscar vendas do produtor:", error);
        res.status(500).json({ error: "Erro ao buscar vendas" });
    }
});

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

// ==========================================
// 👑 ROTA DO PAINEL ADMIN (CORRIGIDA)
// ==========================================
app.get('/admin/dashboard', async (req, res) => {
    try {
        const totalUsuarios = await prisma.usuarios.count(); 
        const totalProdutos = await prisma.produtos.count();
        const totalPedidos = await prisma.pedidos.count();

        const ultimosUsuarios = await prisma.usuarios.findMany({
            take: 5, orderBy: { id: 'desc' },
            select: { id: true, nome: true, email: true, tipo_usuario: true }
        });

        const ultimosProdutos = await prisma.produtos.findMany({
            take: 5, orderBy: { id: 'desc' },
            // 🟢 CORREÇÃO: Mudado de 'usuario' para 'produtor'
            include: { produtor: { select: { nome: true } } }
        });

        const ofertasAtivas = await prisma.ofertas_relampago.findMany({
            take: 5, orderBy: { id: 'desc' },
            include: {
                // 🟢 CORREÇÃO: Mudado de 'usuario' para 'produtor'
                produto: { include: { produtor: { select: { nome: true } } } }
            }
        });

        const ultimosPedidos = await prisma.pedidos.findMany({
            take: 5, orderBy: { id: 'desc' },
            include: {
                comprador: { select: { nome: true } },
                // 🟢 CORREÇÃO: Mudado de 'usuario' para 'produtor'
                produto: { include: { produtor: { select: { nome: true } } } }
            }
        });

        res.json({
            totais: { usuarios: totalUsuarios, produtos: totalProdutos, pedidos: totalPedidos },
            ultimosUsuarios, ultimosProdutos, ofertasAtivas, ultimosPedidos 
        });

    } catch (error) {
        console.error("❌ ERRO NO BACKEND ADMIN:", error);
        res.status(500).json({ error: "Erro ao carregar dados", detalhe: error.message });
    }
});

console.log('📝 Endpoints registrados')

app.listen(3000, '0.0.0.0', () => {
    console.log('🚀 Servidor pronto e aceitando conexões na porta 3000!')
})