import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'
import express from 'express'
import cors from 'cors'

const connection = await mysql.createConnection(process.env.DATABASE_URL)
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

// 1. 📋 LISTAR TODOS OS USUÁRIOS (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários no banco" })
    }
})

// 2. 📝 CADASTRAR NOVO USUÁRIO (POST)
app.post('/usuarios', async (req, res) => {
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
        console.error("❌ Erro ao Criar:", error)
        res.status(500).json({ error: "Erro interno ao criar usuário" })
    }
})

// 3. 🔄 ATUALIZAR DADOS (PUT)
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body

        const updatedUser = await prisma.usuarios.update({
            where: { id: parseInt(id) },
            data: { nome, email, senha, tipo_usuario, whatsapp, url_foto }
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("❌ Erro ao Atualizar:", error)
        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
})

// 4. 🗑️ DELETAR USUÁRIO (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.usuarios.delete({
            where: { id: parseInt(id) }
        })
        res.status(204).send()
    } catch (error) {
        console.error("❌ Erro ao Deletar:", error)
        res.status(500).json({ error: "Erro ao deletar usuário" })
    }
})

// 5. 🔐 ROTA DE LOGIN (POST)
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body

        const user = await prisma.usuarios.findUnique({
            where: { email: email }
        })

        if (!user || user.senha !== senha) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" })
        }

        res.status(200).json({ message: "Login realizado com sucesso!", user })
    } catch (error) {
    // MUDE ESSA LINHA PARA APARECER BEM GRANDE:
    console.log("-----------------------------------------");
    console.log("❌ ERRO DETALHADO:", error.message);
    console.log("-----------------------------------------");
    res.status(500).json({ error: error.message }); // Isso vai mostrar o erro no alerta do celular!
}
})

app.listen(3000, () => {
    console.log('🚀 Servidor pronto em http://localhost:3000')
})