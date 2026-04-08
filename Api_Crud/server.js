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
                nome: nome || email.split('@')[0], // Se não vier nome, usa o início do email
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

console.log('📝 Endpoints registrados')

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})

console.log('⏳ Aguardando conexões...')