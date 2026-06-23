# 🍹 DrinkMaster - Microsserviços com React, JWT, Redis e SQLite

## 📌 Sobre o Projeto

O DrinkMaster é uma aplicação web desenvolvida como evolução de uma Single Page Application (SPA) em React, aplicando conceitos de Arquitetura de Microsserviços.

O sistema permite que usuários autenticados pesquisem, cadastrem, editem e removam drinks, além de receber notificações em tempo real sobre alterações realizadas na plataforma.

O projeto utiliza autenticação JWT, Redis para mensageria e cache, SQLite como banco de dados e WebSockets para comunicação em tempo real.

---

# 🎯 Objetivos

* Implementar uma arquitetura baseada em microsserviços.
* Aplicar autenticação utilizando JWT.
* Utilizar Redis como mecanismo de comunicação entre serviços.
* Implementar cache para otimização de consultas.
* Utilizar WebSocket para notificações em tempo real.
* Desenvolver uma SPA moderna utilizando React.

---

# 🏗 Arquitetura da Solução

```text
Frontend React
       │
       ▼
Auth Service (JWT)
       │
       ▼
Resource Service (CRUD Drinks)
       │
       ├──────── SQLite
       │
       └──────── Redis Publisher
                     │
                     ▼
             Notification Service
                     │
                     ▼
               WebSocket
                     │
                     ▼
                Frontend
```

---

# 🛠 Tecnologias Utilizadas

## Frontend

* React
* Material UI (MUI)
* Axios
* React Hooks
* Context API

## Backend

* Node.js
* Express.js
* JWT (JSON Web Token)
* SQLite
* Redis
* WebSocket

## Segurança

* Rate Limiting
* Sanitização de entradas
* Validação de dados
* Controle de acesso por usuário
* Blacklist de tokens para logout

---

# 📂 Estrutura do Projeto

```text
drinkmaster-fullstack
│
├── frontend
│
├── auth-service
│
├── resource-service
│
├── notification-service
│
└── README.md
```

---

# 🔐 Auth Service

Responsável por:

* Login de usuários
* Geração de JWT
* Logout
* Blacklist de tokens
* Controle de tentativas de login
* Logs de autenticação

### Porta

```text
3001
```

---

# 🍹 Resource Service

Responsável por:

* Cadastro de drinks
* Listagem de drinks
* Busca por nome
* Atualização de drinks
* Exclusão de drinks
* Cache Redis
* Publicação de eventos

### Porta

```text
3002
```

---

# 🔔 Notification Service

Responsável por:

* Consumir eventos publicados pelo Resource Service
* Receber mensagens do Redis
* Enviar notificações em tempo real para o frontend via WebSocket

### Porta

```text
3003
```

---

# 🗄 Banco de Dados

Banco utilizado:

```text
SQLite
```

Tabela principal:

```text
drinks
```

Campos:

```text
id
nome
categoria
tipo
copo
instrucoes
imagem
usuario_id
criado_em
```

---

# ⚡ Cache Redis

O sistema utiliza Redis para armazenar temporariamente consultas de drinks.

Fluxo:

```text
Primeira consulta
↓
SQLite
↓
Redis salva cache
↓
Retorna dados

Próximas consultas
↓
Redis
↓
Retorna dados rapidamente
```

Benefícios:

* Menor tempo de resposta
* Menor carga no banco SQLite
* Melhor experiência do usuário

---

# 📨 Mensageria Redis

Após operações CRUD:

```text
Drink criado
Drink atualizado
Drink excluído
```

O Resource Service publica eventos no Redis.

O Notification Service consome esses eventos e envia notificações para os clientes conectados.

---

# 🔑 Fluxo de Autenticação

```text
Login
↓
Auth Service valida usuário
↓
JWT gerado
↓
Frontend armazena token
↓
Token enviado nas requisições
↓
Resource Service valida JWT
↓
Acesso autorizado
```

---

# 🚀 Como Executar o Projeto

## 1. Iniciar o Redis

Via Docker:

```bash
docker run -d --name redis-drinkmaster -p 6379:6379 redis
```

Verificar:

```bash
docker ps
```

---

## 2. Executar Auth Service

```bash
cd auth-service
npm install
npm run dev
```

Servidor:

```text
http://localhost:3001
```

---

## 3. Executar Resource Service

```bash
cd resource-service
npm install
npm run dev
```

Servidor:

```text
http://localhost:3002
```

---

## 4. Executar Notification Service

```bash
cd notification-service
npm install
npm run dev
```

Servidor:

```text
http://localhost:3003
```

---

## 5. Executar Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação:

```text
http://localhost:5173
```

---

# 👤 Usuário de Teste

```text
Email:
jose@email.com

Senha:
123456
```

---

# 📊 Funcionalidades Implementadas

## Autenticação

* Login
* Logout
* JWT
* Blacklist de tokens
* Rate Limiting

## Drinks

* Criar drink
* Listar drinks
* Buscar drink por nome
* Editar drink
* Excluir drink

## Notificações

* Eventos em tempo real
* Integração Redis + WebSocket

## Cache

* Cache Redis para consultas

## Dashboard

* Total de drinks
* Drinks alcoólicos
* Drinks não alcoólicos

---

# 📝 Logs

O sistema registra:

```text
Login realizado
Tentativas inválidas
Logout
Busca de drinks
Criação de drinks
Atualização de drinks
Exclusão de drinks
```

---

# 📚 Conceitos Aplicados

* SPA (Single Page Application)
* Microsserviços
* REST API
* JWT
* Redis Pub/Sub
* Cache Redis
* WebSocket
* SQLite
* Middleware
* Validação de Dados
* Segurança de Aplicações Web

---

# 👨‍💻 Autor

José Victor Garcia

Projeto desenvolvido para a disciplina de Programação Web Full Stack.
