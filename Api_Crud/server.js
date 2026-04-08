console.log('🚀 Iniciando script...')

import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

console.log('📦 Módulos importados')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

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
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body

        const updatedUser = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: {
                nome: nome,
                email: email,
                senha: senha,
                tipo_usuario: tipo_usuario,
                whatsapp: whatsapp,
                url_foto: url_foto,
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
        const { cep, rua, numero, bairro, usuario_id } = req.body

        const novoEndereco = await prisma.enderecos.create({
            data: {
                cep,
                rua,
                numero,
                bairro,
                usuario_id: parseInt(usuario_id)
            }
        })

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

console.log('📝 Endpoints registrados')

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})

console.log('⏳ Aguardando conexões...')