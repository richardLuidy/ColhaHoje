import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors' // DICA: Adicionei isso para o celular conseguir conectar!

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors()) // Permite que o App mobile acesse a API sem bloqueio

// 1. 📋 LISTAR TODOS OS USUÁRIOS (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários no banco" })
    }
})

// 2. 📝 CADASTRAR NOVO USUÁRIO (POST) - Para a tela de Cadastro
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body

        const newUser = await prisma.usuarios.create({
            data: { nome, email, senha, tipo_usuario, whatsapp, url_foto }
        })

        res.status(201).json(newUser)
    } catch (error) {
        console.error(error) 
        res.status(500).json({ error: "Erro ao criar usuário" })
    }
})

// 3. 🔄 ATUALIZAR DADOS (PUT) - Para a tela "Meus Dados Pessoais"
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
        console.error(error)
        res.status(500).json({ error: "Erro ao atualizar usuário" })
    }
})

// 4. 🗑️ DELETAR USUÁRIO (DELETE) - Para excluir conta
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params
        await prisma.usuarios.delete({
            where: { id: parseInt(id) }
        })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao deletar usuário" })
    }
})

// 5. 🔐 ROTA DE LOGIN (POST) - Para a tela de Login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body

        const user = await prisma.usuarios.findUnique({
            where: { email: email }
        })

        if (!user || user.senha !== senha) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" })
        }

        // Retorna o usuário logado para o App saber quem é (ex: Jubinilson)
        res.status(200).json({ message: "Login realizado com sucesso!", user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao realizar login" })
    }
})

app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta http://localhost:3000')
})