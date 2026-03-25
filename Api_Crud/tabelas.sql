-- =======================================================
-- GUIA DE CONFIGURAÇÃO DO BANCO DE DADOS (VIA PRISMA ORM)
-- =======================================================

-- 1. INSTALAÇÃO DAS FERRAMENTAS:
-- No terminal do VS Code/cmd (dentro da pasta api_crud), rode os comandos:
-- npm install prisma dotenv --save-dev
-- npm install @prisma/client

-- 2. CONEXÃO COM O BANCO DE DADOS LOCAL:
-- Na raiz da pasta api_crud, crie ou abra o arquivo ".env".
-- Ele deve conter a URL exata do seu MySQL (ajuste a senha se tiver):
-- DATABASE_URL="mysql://root:1234@localhost:3306/db_colhahoje"

-- 3. ONDE "DESENHAR" AS TABELAS (O NOSSO MAPA):
-- Nós NÃO usamos comandos "CREATE TABLE" manuais. 
-- Toda a estrutura do banco é desenhada no arquivo: prisma/schema.prisma
-- Para criar uma tabela nova, basta escrever um bloco "model NomeDaTabela { ... }" dentro dele.

-- 4. COMO CRIAR AS TABELAS NO BANCO DE VERDADE (MIGRATION):
-- Depois de desenhar a tabela no "schema.prisma", abra o terminal e rode:
-- npx prisma migrate dev --name nome_da_sua_alteracao
-- O Prisma vai ler o arquivo, traduzir para SQL e criar a tabela no HeidiSQL automaticamente.

-- 5. COMO EXCLUIR UMA TABELA:
-- Passo 1: Abra o arquivo "prisma/schema.prisma" e APAGUE o bloco "model" da tabela.
-- Passo 2: Salve o arquivo e rode o comando de migration novamente no terminal:
-- npx prisma migrate dev --name excluiu_tabela_tal}
-- O Prisma vai notar que a tabela sumiu do mapa e vai apagá-la do banco de dados sozinho.

-- 6. ESTRUTURA ATUAL DO NOSSO PROJETO COLHAHOJE:
-- Tabela já criada: usuarios
-- Campos: id, nome, email, senha, tipo_usuario (comprador/produtor), whatsapp, url_foto, data_criacao, data_atualizacao.