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
        res.status(500).json({ error: "Erro ao criar usuário" })
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        const user = await prisma.usuarios.findUnique({ where: { id: parseInt(req.params.id) } })
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" })
    }
})

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto, cpf_cnpj } = req.body
        const updatedUser = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: { nome, email, senha, tipo_usuario, whatsapp, url_foto, cpf_cnpj, data_atualizacao: new Date() }
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
})

app.delete('/usuarios/:id', async (req, res) => {
    try {
        await prisma.usuarios.delete({ where: { id: parseInt(req.params.id) } })
        res.status(200).json({ message: "Usuário deletado" })
    } catch (error) {
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
            data: { cep, rua, numero, bairro, cidade, estado, usuario_id: parseInt(usuario_id) }
        })
        res.status(201).json(novoEndereco)
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar endereço" })
    }
})

app.get('/enderecos/usuario/:usuario_id', async (req, res) => {
    try {
        const enderecos = await prisma.enderecos.findMany({ where: { usuario_id: parseInt(req.params.usuario_id) } })
        res.status(200).json(enderecos)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar endereços" })
    }
})

app.get('/produtor/dados/:id', async (req, res) => {
    try {
        const usuario = await prisma.usuarios.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { enderecos: true }
        });
        if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
        res.json({
            nome: usuario.nome,
            localizacao: usuario.enderecos.length > 0 ? usuario.enderecos[0].rua : "Sem endereço cadastrado",
            endereco_id: usuario.enderecos.length > 0 ? usuario.enderecos[0].id : null
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar dados na nuvem" });
    }
});

// ==========================================
// 🍏 ROTAS DE PRODUTOS
// ==========================================

app.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        const { nome_produto, nome_produtor, localizacao, categoria, preco, unidade, quantidade, produtor_id, endereco_id } = req.body;
        const imagem_url = req.file ? `http://10.0.2.2:3000/uploads/${req.file.filename}` : '';
        const novoProduto = await prisma.produtos.create({
            data: {
                nome_produto, nome_produtor, localizacao, categoria,
                preco: parseFloat(preco), unidade, quantidade: parseInt(quantidade),
                produtor_id: parseInt(produtor_id), endereco_id: parseInt(endereco_id), imagem_url
            }
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar" });
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const listaProdutos = await prisma.produtos.findMany({ orderBy: { id: 'desc' } });
        res.status(200).json(listaProdutos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

// 🔢 CONTAR PRODUTOS
app.get('/produtos/contar/:produtor_id', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        const total = await prisma.produtos.count({ where: { produtor_id: parseInt(req.params.produtor_id) } });
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ error: "Erro ao contar produtos" });
    }
});

// ✏️ 3. ATUALIZAR PRODUTO (PUT) - 🟢 NOVO!
app.put('/produtos/:id', upload.single('imagem'), async (req, res) => {
    console.log(`🔍 Requisição PUT /produtos/${req.params.id} recebida`);
    try {
        const { id } = req.params;
        const { nome_produto, categoria, preco, unidade, quantidade } = req.body;

        // Se o usuário mandou uma foto nova, usamos ela. Se não, mantemos a antiga (logica no front)
        const dadosParaAtualizar = {
            nome_produto,
            categoria,
            preco: parseFloat(preco),
            unidade,
            quantidade: parseInt(quantidade),
        };

        if (req.file) {
            dadosParaAtualizar.imagem_url = `http://10.0.2.2:3000/uploads/${req.file.filename}`;
        }

        const produtoAtualizado = await prisma.produtos.update({
            where: { id: parseInt(id) },
            data: dadosParaAtualizar
        });

        console.log('✅ Produto atualizado:', nome_produto);
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        console.error("❌ Erro ao atualizar:", error.message);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

// 🗑️ 4. EXCLUIR PRODUTO (DELETE) - 🟢 NOVO!
app.delete('/produtos/:id', async (req, res) => {
    console.log(`🔍 Requisição DELETE /produtos/${req.params.id} recebida`);
    try {
        const { id } = req.params;
        await prisma.produtos.delete({
            where: { id: parseInt(id) }
        });
        console.log('✅ Produto excluído do banco.');
        res.status(200).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao excluir:", error.message);
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
                produto_id: parseInt(produto_id),
                preco_original: parseFloat(preco_original),
                preco_promocional: parseFloat(preco_promocional),
                duracao_minutos: parseInt(duracao_minutos),
                status: 'ativa'
            }
        });
        res.status(201).json(novaOferta);
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar oferta" });
    }
});

app.get('/ofertas/destaque', async (req, res) => {
    try {
        const ofertaDestaque = await prisma.ofertas_relampago.findFirst({
            where: { status: 'ativa' },
            orderBy: { criado_em: 'desc' },
            include: { produto: true }
        });
        res.status(200).json(ofertaDestaque || null);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar destaque" });
    }
});

console.log('📝 Endpoints registrados')

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})