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

