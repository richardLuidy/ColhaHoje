-- =======================================================
-- 🟢 GUIA MASTER: CONFIGURAÇÃO COLHAHOJE (PRISMA + MYSQL)
-- =======================================================

-- 1. 🛠️ INSTALAÇÃO DAS FERRAMENTAS (SÓ UMA VEZ):
-- No terminal do VS Code (dentro da pasta Api_Crud), rode:
-- 🟦 npm install prisma @prisma/client dotenv

-- 2. 🔌 CONEXÃO COM O BANCO (ARQUIVO .env):
-- No VS Code, abra o arquivo ".env" e escolha qual banco quer usar:

-- OPÇÃO A: BANCO LOCAL (XAMPP - Computador da Escola)
-- DATABASE_URL="mysql://root:@localhost:3306/db_colhahoje"
-- (Nota: Geralmente no XAMPP a senha é vazia após o "root:")

-- ☁️ OPÇÃO B: BANCO NA NUVEM (AIVEN - Para o App funcionar na Rua)
-- Copie e cole a linha abaixo exatamente como está:
-- DATABASE_URL="mysql://avnadmin:SUA_SENHA_AQUI@mysql..."

-- 3. 🗺️ O MAPA DO TESOURO (schema.prisma):
-- Toda a estrutura das tabelas fica no arquivo: 📄 prisma/schema.prisma
-- Se mudar algo lá, o banco precisa ser avisado (veja o item 4).

-- 4. 🚀 COMO SINCRONIZAR O BANCO (MIGRATION / PUSH):
-- 🟦{ npx prisma db push}
-- (Sempre que você mudar de Banco Local para Nuvem no .env, rode esse comando!)

-- 5. 🗑️ COMO EXCLUIR OU ALTERAR UMA TABELA:
-- Passo 1: Apague o bloco "model" no "schema.prisma".
-- Passo 2: Salve e rode no terminal:  npx prisma db push
-- O Prisma limpa o banco sozinho, seja no PC ou no Aiven.

-- 6. 📊 ESTRUTURA ATUAL DO PROJETO COLHAHOJE (TABELA USUARIOS):
-- id (Autoincrement), nome, email (Único), senha, tipo_usuario, whatsapp, url_foto, data_criacao, data_atualizacao.

-- 7. 🧪 COMO TESTAR SE O BACKEND ESTÁ VIVO:
-- 1º Ligue o servidor: 🟦 node server.js (Mantenha o terminal aberto!)
-- 2º Em outro terminal: 🟦 node teste.js
-- Resposta esperada: Um JSON com o ID gerado pelo banco!
-- =======================================================