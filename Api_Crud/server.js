const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o HeidiSQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuário padrão do Heidi
    password: '1234',      // Sua senha do Heidi (se tiver)
    database: 'db_colhahoje' 
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('✅ Conectado ao banco de dados HeidiSQL!');
});

app.get('/', (req, res) => {
    res.send('API ColhaHoje Rodando! 🚀');
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});