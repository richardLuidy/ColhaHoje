console.log('🚀 Iniciando script...')

import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
// 🟢 ADICIONADO: Importando ferramentas para lidar com arquivos (Fotos)
import multer from 'multer'
import path from 'path'
import fs from 'fs'

console.log('📦 Módulos importados')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

// 🟢 ADICIONADO: Configuração do local onde as fotos serão salvas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Cria a pasta uploads se não existir
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Cria um nome único para a foto usando a data atual
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 🟢 ADICIONADO: Libera o acesso para o aplicativo conseguir ver as fotos da pasta uploads
app.use('/uploads', express.static('uploads'));

console.log('🔄 Configurando servidor...')

// ==========================================
// 👤 ROTAS DE USUÁRIOS
// ==========================================

// 1. 📋 LISTAR TODOS OS USUÁRIOS (GET)
app.get('/usuarios', async (req, res) => {
    console.log('🔍 Recebida requisição GET /usuarios')
    try {
        const users = await prisma.usuarios.findMany()
        console.log('✅ Usuários encontrados:', users.length)
        res.status(200).json(users)
    } catch (error) {
        console.error("❌ Erro ao buscar usuários:", error.message)
        res.status(500).json({ error: "Erro ao buscar usuários no banco", details: error.message })
    }
})

// 2. 📝 CADASTRAR NOVO USUÁRIO (POST)
app.post('/usuarios', async (req, res) => {
    console.log('🔍 Recebida requisição POST /usuarios')
    try {
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body

        // --- 🛡️ VERIFICAÇÃO DE E-MAIL DUPLICADO ---
        const userExists = await prisma.usuarios.findUnique({
            where: { email: email }
        })

        if (userExists) {
            return res.status(400).json({ error: "Este e-mail já está cadastrado!" })
        }

        // --- 🚀 CRIAÇÃO COM VALORES PADRÃO (Evita Erro 500) ---
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
        console.error("❌ Erro ao criar usuário:", error.message)
        res.status(500).json({ error: "Erro interno ao criar usuário", details: error.message })
    }
})

// 3. 🔍 BUSCAR USUÁRIO POR ID (GET)
app.get('/usuarios/:id', async (req, res) => {
    console.log('🔍 Recebida requisição GET /usuarios/:id')
    try {
        const { id } = req.params
        const user = await prisma.usuarios.findUnique({
            where: { id: parseInt(id) }
        })

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error("❌ Erro ao buscar usuário:", error.message)
        res.status(500).json({ error: "Erro ao buscar usuário", details: error.message })
    }
})

// 4. ✏️ ATUALIZAR USUÁRIO (PUT)
app.put('/usuarios/:id', async (req, res) => {
    console.log('🔍 Recebida requisição PUT /usuarios/:id')
    try {
        const { id } = req.params

        // 🟢 1. Adicionado o cpf_cnpj aqui para receber do aplicativo
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto, cpf_cnpj } = req.body

        const updatedUser = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: {
                nome: nome,
                email: email,
                senha: senha,
                tipo_usuario: tipo_usuario,
                whatsapp: whatsapp,
                url_foto: url_foto,
                cpf_cnpj: cpf_cnpj,
                data_atualizacao: new Date()
            }
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("❌ Erro ao atualizar usuário:", error.message)
        res.status(500).json({ error: "Erro ao atualizar usuário", details: error.message })
    }
})

// 5. 🗑️ DELETAR USUÁRIO (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
    console.log('🔍 Recebida requisição DELETE /usuarios/:id')
    try {
        const { id } = req.params

        await prisma.usuarios.delete({
            where: { id: parseInt(id) }
        })

        res.status(200).json({ message: "Usuário deletado com sucesso" })
    } catch (error) {
        console.error("❌ Erro ao deletar usuário:", error.message)
        res.status(500).json({ error: "Erro ao deletar usuário", details: error.message })
    }
})

// ==========================================
// 🟢 NOVO: ROTA DE LOGIN
// ==========================================
app.post('/login', async (req, res) => {
    console.log('🔍 Recebida requisição POST /login')
    try {
        const { email, senha } = req.body

        // 1. Procura o usuário pelo email
        const user = await prisma.usuarios.findUnique({
            where: { email: email }
        })

        // 2. Verifica se o usuário não existe ou se a senha está errada
        if (!user || user.senha !== senha) {
            console.log('❌ Login bloqueado: e-mail ou senha incorretos')
            return res.status(401).json({ error: "E-mail ou senha incorretos!" })
        }

        // 3. Se deu tudo certo, libera o acesso e devolve os dados do usuário
        console.log('✅ Login aprovado para:', user.nome)
        res.status(200).json(user)

    } catch (error) {
        console.error("❌ Erro ao fazer login:", error.message)
        res.status(500).json({ error: "Erro interno ao tentar logar" })
    }
})

// ==========================================
// 🟢 NOVO: ROTAS DE ENDEREÇOS
// ==========================================

// 📝 CADASTRAR NOVO ENDEREÇO (POST)
app.post('/enderecos', async (req, res) => {
    console.log('🔍 Recebida requisição POST /enderecos')
    try {
        const { cep, rua, numero, bairro, cidade, estado, usuario_id } = req.body;

        // 🛡️ MELHORIA DE SEGURANÇA: Verifica se o ID do usuário chegou
        if (!usuario_id) {
            console.log('⚠️ Tentativa de cadastro de endereço sem usuario_id');
            return res.status(400).json({ error: "ID do usuário é obrigatório para cadastrar um endereço!" });
        }

        const novoEndereco = await prisma.enderecos.create({
            data: {
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado,
                usuario_id: parseInt(usuario_id)
            }
        })

        console.log('✅ Endereço salvo com sucesso para o usuário:', usuario_id)
        res.status(201).json(novoEndereco)

    } catch (error) {
        console.error("❌ Erro ao salvar endereço:", error.message)
        res.status(500).json({ error: "Erro interno ao salvar endereço", details: error.message })
    }
})

// 🔍 BUSCAR ENDEREÇO DE UM USUÁRIO (GET)
app.get('/enderecos/usuario/:usuario_id', async (req, res) => {
    console.log('🔍 Recebida requisição GET /enderecos/usuario/:usuario_id')
    try {
        const { usuario_id } = req.params

        const enderecos = await prisma.enderecos.findMany({
            where: { usuario_id: parseInt(usuario_id) }
        })

        res.status(200).json(enderecos)
    } catch (error) {
        console.error("❌ Erro ao buscar endereços:", error.message)
        res.status(500).json({ error: "Erro ao buscar endereços", details: error.message })
    }
})


// 🔍 BUSCAR DADOS DO PRODUTOR PARA O CADASTRO
app.get('/produtor/dados/:id', async (req, res) => {
    try {
        const idProdutor = parseInt(req.params.id);

        // Busca o usuário e já traz o endereço dele junto
        const usuario = await prisma.usuarios.findUnique({
            where: { id: idProdutor },
            include: { enderecos: true } // Puxa a tabela de endereço conectada a ele
        });

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Monta a resposta pegando o nome, o bairro e o ID do endereço
        res.json({
            nome: usuario.nome,
            localizacao: usuario.enderecos.length > 0 ? usuario.enderecos[0].rua : "Sem endereço cadastrado",
            // 🟢 NOVO: Enviando o ID do endereço para o aplicativo usar no cadastro do produto!
            endereco_id: usuario.enderecos.length > 0 ? usuario.enderecos[0].id : null
        });

    } catch (error) {
        console.error("Erro na rota /produtor/dados:", error);
        res.status(500).json({ error: "Erro ao buscar dados na nuvem" });
    }
});


// ==========================================
// 🟢 ROTAS DE PRODUTOS (ATUALIZADO)
// ==========================================

// 📝 1. CADASTRAR NOVO PRODUTO (POST)
app.post('/produtos', upload.single('imagem'), async (req, res) => {
    // Logs rápidos para você conferir no terminal do Senac
    console.log('🔍 Requisição POST /produtos recebida');
    console.log('📸 Arquivo:', req.file ? req.file.filename : 'Sem foto');

    try {
        const {
            nome_produto, nome_produtor, localizacao, categoria,
            preco, unidade, quantidade, produtor_id, endereco_id
        } = req.body;

        const imagem_url = req.file ? `http://10.0.2.2:3000/uploads/${req.file.filename}` : '';

        if (!nome_produto || !produtor_id || !endereco_id) {
            return res.status(400).json({ error: "Faltam dados obrigatórios!" });
        }

        const novoProduto = await prisma.produtos.create({
            data: {
                nome_produto,
                nome_produtor,
                localizacao,
                categoria,
                preco: parseFloat(preco),
                unidade,
                quantidade: parseInt(quantidade),
                produtor_id: parseInt(produtor_id),
                endereco_id: parseInt(endereco_id),
                imagem_url: imagem_url 
            }
        });

        console.log('✅ Salvo na Nuvem:', nome_produto);
        res.status(201).json(novoProduto);

    } catch (error) {
        console.error("❌ Erro:", error.message);
        res.status(500).json({ error: "Erro ao salvar", details: error.message });
    }
});

// 📋 2. LISTAR PRODUTOS (GET) - NOVO!
// Essa rota permite que o App busque todos os produtos da nuvem
app.get('/produtos', async (req, res) => {
    console.log('🔍 Buscando lista de produtos na nuvem...');
    try {
        const listaProdutos = await prisma.produtos.findMany({
            orderBy: { id: 'desc' } // Os mais novos aparecem primeiro
        });
        res.status(200).json(listaProdutos);
    } catch (error) {
        console.error("❌ Erro ao buscar lista:", error.message);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

// ==========================================
// ⚡ ROTAS DE OFERTA RELÂMPAGO
// ==========================================

// 📝 1. ATIVAR NOVA OFERTA (POST)
app.post('/ofertas', async (req, res) => {
    console.log('🔍 Requisição POST /ofertas recebida');
    try {
        const { produto_id, preco_original, preco_promocional, duracao_minutos } = req.body;

        // 🛡️ Validação simples
        if (!produto_id || !preco_promocional || !duracao_minutos) {
            return res.status(400).json({ error: "Dados da oferta incompletos!" });
        }

        const novaOferta = await prisma.ofertas_relampago.create({
            data: {
                produto_id: parseInt(produto_id),
                preco_original: parseFloat(preco_original),
                preco_promocional: parseFloat(preco_promocional),
                duracao_minutos: parseInt(duracao_minutos),
                status: 'ativa'
            }
        });

        console.log('✅ Oferta Relâmpago Ativada para o produto ID:', produto_id);
        res.status(201).json(novaOferta);

    } catch (error) {
        console.error("❌ Erro ao ativar oferta:", error.message);
        res.status(500).json({ error: "Erro ao salvar oferta na nuvem", details: error.message });
    }
});

// 📋 2. LISTAR OFERTAS ATIVAS (GET) - Útil para a tela de 'Ofertas' do App
app.get('/ofertas', async (req, res) => {
    try {
        const ofertas = await prisma.ofertas_relampago.findMany({
            where: { status: 'ativa' },
            include: { produto: true }, // Traz os dados do produto junto (nome, imagem, etc)
            orderBy: { criado_em: 'desc' }
        });
        res.status(200).json(ofertas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar ofertas" });
    }
});

console.log('📝 Endpoints registrados')

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})

console.log('⏳ Aguardando conexões...')