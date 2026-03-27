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
// ROTA PARA CADASTRAR UM NOVO USUÁRIO
app.post('/usuarios', async (req, res) => {
    try {
        // Pegando todas as informações que a sua tabela pede
        const { nome, email, senha, tipo_usuario, whatsapp, url_foto } = req.body

        const newUser = await prisma.usuarios.create({
            data: {
                nome: nome,
                email: email,
                senha: senha,
                tipo_usuario: tipo_usuario,
                whatsapp: whatsapp,
                url_foto: url_foto
            }
        })

        res.status(201).json(newUser)
    } catch (error) {
        // Agora o servidor vai te contar o erro real no terminal!
        console.error(error) 
        res.status(500).json({ error: "Erro ao criar usuário" })
    }
})

app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta http://localhost:3000')
})