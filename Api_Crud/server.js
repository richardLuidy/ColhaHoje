import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

// ROTA PARA LISTAR USUÁRIOS (A que você já fez e deu certo!)
app.get('/usuarios', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários no banco" })
    }
})

// ROTA PARA CADASTRAR UM NOVO USUÁRIO (A novidade!)
app.post('/usuarios', async (req, res) => {
    try {
        // Pegando as informações que chegam na requisição
        const { nome, email, senha } = req.body

        // Mandando o Prisma criar no banco de dados
        const newUser = await prisma.usuarios.create({
            data: {
                nome: nome,
                email: email,
                senha: senha
            }
        })

        // Respondendo que deu certo (Status 201 = Criado)
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" })
    }
})

app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta http://localhost:3000')
})