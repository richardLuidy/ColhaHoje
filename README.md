# 🚀 GUIA DE CONFIGURAÇÃO: BACKEND COLHAHOJE NA NUVEM

Aqui está o passo a passo completo para configurar e rodar o backend do projeto na máquina, conectar ao banco de dados na nuvem e gerenciar as tabelas.

### Passo 1: Preparar o VS Code (Extensão do Prisma)
Abra o VS Code, vá na aba de Extensões, pesquise por **Prisma** e instale a primeira opção da lista (com selo azul de verificado da prisma.io).

**💡 Por que instalar essa extensão?**
O arquivo `schema.prisma` é onde desenhamos nossas tabelas. Sem a extensão, o VS Code trata como um arquivo de texto normal. Com a extensão instalada, ela funciona como um "corretor ortográfico" inteligente:
* Deixa o código colorido para facilitar a identificação de tabelas e colunas.
* Arruma a formatação e os espaços automaticamente ao salvar.
* Sublinha de vermelho caso haja erro na digitação de algum tipo de dado.

### Passo 2: Instalar as Ferramentas (Via Terminal)
Como o projeto já possui o arquivo `package.json`, não é necessário instalar as ferramentas uma por uma.
1. Abra a pasta do backend (`Api_Crud`) no VS Code.
2. Abra o terminal do VS Code (`Ctrl` + `'`) e rode este comando:
```bash
npm install
```
### Passo 3: O Cabo de Força (Arquivo .env)

O projeto utiliza o Aiven, que é um banco de dados hospedado na nuvem.

1. Crie um arquivo chamado `.env` na raiz da pasta `Api_Crud`.
2. Cole exatamente a linha abaixo lá dentro (ela já contém as credenciais de acesso à nuvem):

```text
DATABASE_URL="mysql://avnadmin:AVNS_lvd6YRnV5wqxzuzoj3y@mysql-2c20f33f-colhahoje.a.aivencloud.com:14406/defaultdb?ssl-mode=REQUIRED"
```
#(Nota: No Aiven, o banco de dados já vem criado com o nome defaultdb. Não é necessário rodar "CREATE DATABASE" na nuvem!)


### Passo 4: Sincronizar o Prisma (Gerar o Cliente)
Sempre que mudar de computador ou alterar o banco, você PRECISA rodar este comando para o código entender as tabelas:
```bash
npx prisma generate
```

### Passo 5: O Mapa das Tabelas (schema.prisma)

Toda a estrutura do banco fica desenhada dentro do arquivo `prisma/schema.prisma`. A criação e modificação de tabelas **não** é feita manualmente em softwares gerenciadores (como HeidiSQL). O modelo deve ser escrito diretamente neste arquivo.

### Passo 6: Como Criar e Excluir Tabelas

A sincronização com a nuvem é feita através de comandos do Prisma.

🟢 **PARA CRIAR UMA TABELA NOVA:**

1. Escreva o modelo da tabela no `schema.prisma` (ex: `model Produtos { ... }`).
2. Salve o arquivo.
3. No terminal (CMD) do VS Code, rode:

```bash
npx prisma db push
#(O que acontece? O Prisma acessa a nuvem (Aiven) e cria a tabela automaticamente.)
```
🔴 **PARA EXCLUIR UMA TABELA:**

1. Vá no arquivo `schema.prisma` (ex: `model Produtos { ... }`).
2. Salve o arquivo.
3. No terminal (CMD) do VS Code, rode:
```bash
npx prisma db push
#O que acontece? O Prisma detecta que a tabela sumiu do arquivo e fará a exclusão dela (e dos dados) no banco.
```
#O que acontece? O Prisma detecta que a tabela sumiu do arquivo e fará a exclusão dela (e dos dados) no banco.

🔍 **PARA VER OS DADOS (PRISMA STUDIO):**
#Quer ver as tabelas e os dados cadastrados em uma interface visual no navegador? Rode:
```bash
npx prisma studio
```
### Passo 7: Rodar o Servidor
Com tudo configurado e sincronizado, ligue a API:
```bash
npx prisma studio
```