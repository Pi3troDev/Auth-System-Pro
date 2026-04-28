# 🎯 Backend - Resumo Visual Simplificado

## Estrutura em Camadas (Clean Architecture)

```
┌─────────────────────────────────────────────────┐
│          PRESENTATION (Entrada/Saída)           │  ← HTTP
│  Controllers, Routes, Middlewares, Validators   │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────┐
│       APPLICATION (Orquestração)                │  ← Use Cases, DTOs
│  Conecta Presentation com Domain                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────┐
│    DOMAIN (Regras de Negócio)                   │  ← Entities, Repositories
│  Lógica pura, sem banco de dados                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────┐
│   INFRASTRUCTURE (Implementação)                │  ← Database, Cache, Email
│  Banco dados, APIs, Serviços externos           │
└─────────────────────────────────────────────────┘
```

---

## 📝 O que vai em cada pasta?

### **1. DOMAIN** (Regras de Negócio - O quê fazer?)
```
domain/
├── entities/
│   └── User.ts              "Um usuário TEM um email, senha, nome"
│   └── Device.ts            "Um dispositivo TEM um nome, modelo, status"
│
├── repositories/
│   └── IUserRepository.ts   "Como BUSCAR/SALVAR usuários"
│   └── IDeviceRepository.ts "Como BUSCAR/SALVAR dispositivos"
│
└── value-objects/
    └── Email.ts             "Email PRECISA ser válido"
    └── Password.ts          "Senha PRECISA ter 8+ caracteres"
```

**Em resumo:** Define o **O QUÊ** - as entidades e regras

---

### **2. APPLICATION** (Casos de Uso - COMO fazer?)
```
application/
├── usecases/
│   ├── auth/
│   │   ├── LoginUseCase.ts          "1. Buscar usuário"
│   │   │                            "2. Validar senha"
│   │   │                            "3. Gerar token"
│   │   ├── RegisterUseCase.ts       "1. Validar dados"
│   │   │                            "2. Criar usuário"
│   │   │                            "3. Enviar email"
│   │
│   └── device/
│       ├── CreateDeviceUseCase.ts
│       └── ListDevicesUseCase.ts
│
└── dto/
    ├── auth/
    │   ├── LoginRequestDTO.ts       { email, password }
    │   └── LoginResponseDTO.ts      { token, user }
    │
    └── device/
        ├── CreateDeviceRequestDTO.ts
        └── DeviceResponseDTO.ts
```

**Em resumo:** Define o **COMO FAZER** - a orquestração, o fluxo

---

### **3. INFRASTRUCTURE** (Implementação Técnica - ONDE/COM O QUÊ?)
```
infrastructure/
├── database/
│   ├── prisma/               ← Configuração do Prisma
│   └── repositories/
│       ├── PrismaUserRepository.ts    "Implementação: salvar em PostgreSQL"
│       └── PrismaDeviceRepository.ts
│
├── crypto/
│   └── CryptoService.ts      "Hash senha, gerar JWT"
│
├── cache/
│   └── RedisCache.ts         "Cache de sessões"
│
└── email/
    └── EmailService.ts       "Enviar emails com Nodemailer"
```

**Em resumo:** Define **ONDE GUARDAR** e **FERRAMENTAS TÉCNICAS**

---

### **4. PRESENTATION** (Interface HTTP - RECEBER/RETORNAR)
```
presentation/http/
├── controllers/
│   ├── auth/
│   │   ├── LoginController.ts        "Recebe POST /auth/login"
│   │   │                             "Chama LoginUseCase"
│   │   │                             "Retorna JSON"
│   │
│   └── device/
│       ├── CreateDeviceController.ts
│       └── ListDevicesController.ts
│
├── routes/
│   ├── auth.routes.ts               "POST /auth/login"
│   └── device.routes.ts             "GET /devices, POST /devices"
│
├── middlewares/
│   ├── authMiddleware.ts            "Verifica JWT"
│   └── errorHandler.ts              "Trata erros"
│
└── validators/
    ├── loginValidator.ts            "Email válido? Senha forte?"
    └── deviceValidator.ts
```

**Em resumo:** Define **ENTRADA/SAÍDA HTTP**

---

### **5. SHARED** (Reutilizável)
```
shared/
├── errors/
│   └── AppError.ts                  "Erro customizado"
│
└── utils/
    ├── logger.ts                    "Log de mensagens"
    ├── formatters.ts                "Formatar datas, valores"
    └── validators.ts                "Funções comuns de validação"
```

---

## 🧠 ANALOGIA: Restaurante

Imagina um **restaurante**:

### **DOMAIN** = Manual do Restaurante
```
"Um cliente é uma pessoa com nome, email, telefone"
"Um prato deve ter ingredientes válidos"
"Um pedido precisa ter itens válidos"
"Um cliente só pode cancelar seu próprio pedido"
```

### **APPLICATION** = Receita
```
"Para FAZER PEDIDO:
  1. Verificar se cliente existe
  2. Validar itens do pedido
  3. Calcular preço
  4. Registrar no sistema
  5. Enviar para cozinha"
```

### **INFRASTRUCTURE** = Ferramentas
```
"Cozinha (Database) - onde armazenar pedidos"
"Freezer (Cache) - guardar itens populares"
"Telefone (Email) - ligar/avisar cliente"
"Livro de receitas (Services) - como preparar"
```

### **PRESENTATION** = Atendente
```
"Cliente chega: POST /pedidos"
"Atendente (Controller):
  1. Recebe pedido
  2. Valida dados
  3. Chama cozinha (UseCase)
  4. Retorna confirmação"
```

---

## 🔄 FLUXO REAL: Fazer Login

```
Cliente Browser
    │
    └─→ POST /auth/login
            └─→ 🎯 PRESENTATION (Atendente)
                 LoginController recebe requisição
                 │
                 └─→ Validar email/senha (validators)
                     └─→ ✅ OK
                         │
                         └─→ 🔄 APPLICATION (Receita)
                              LoginUseCase executa:
                              - Buscar usuário
                              - Validar senha
                              - Gerar token
                              │
                              └─→ 🏛️ DOMAIN (Regra)
                                  User.isPasswordValid()
                                  │
                                  └─→ 🔧 INFRASTRUCTURE (Ferramenta)
                                       PrismaUserRepository
                                       └─→ Busca em PostgreSQL
                                           │
                                           └─→ CryptoService
                                               compara senha com bcrypt
                                               │
                                               └─→ gera token JWT
                                                   │
                                                   └─→ Retorna token
                                                       │
                     Response JSON ←────────────────────┘
            {
              "token": "eyJhbGc...",
              "user": { "id", "email", "name" }
            }
    ←─────────────────────────
    
Cliente recebe JSON ✅
```

---

## 📊 Mapa Rápido: Onde colocar cada coisa?

| Preciso... | Vou em... | Exemplo |
|-----------|----------|---------|
| Definir que **User tem email** | `domain/entities/User.ts` | class User { email: string } |
| Definir **email deve ser válido** | `domain/value-objects/Email.ts` | class Email { if !valid throw error } |
| Definir **como buscar usuário** | `domain/repositories/IUserRepository.ts` | interface findById() |
| Orquestrar **fluxo de login** | `application/usecases/auth/LoginUseCase.ts` | class LoginUseCase { execute() } |
| Definir **estrutura de dados** | `application/dto/auth/LoginRequestDTO.ts` | interface LoginRequestDTO {} |
| Implementar **busca no banco** | `infrastructure/database/repositories/PrismaUserRepository.ts` | class PrismaUserRepository implements IUserRepository |
| Fazer **requisição HTTP** | `presentation/http/controllers/auth/LoginController.ts` | class LoginController { handle() } |
| Validar **dados do formulário** | `presentation/http/validators/loginValidator.ts` | const schema = z.object() |
| Verificar **JWT** | `presentation/http/middlewares/authMiddleware.ts` | jwt.verify(token) |
| Definir **rota POST /auth/login** | `presentation/http/routes/auth.routes.ts` | router.post('/login', controller.handle) |

---

## ✨ A Regra de Ouro

```
┌─────────────────────────────────────┐
│  EXTERNAL (Frontend, Cliente HTTP)  │
└────────────────┬────────────────────┘
                 │
                 ↓ (conhece)
┌─────────────────────────────────────┐
│  PRESENTATION (Controllers/Routes)  │
└────────────────┬────────────────────┘
                 │
                 ↓ (conhece)
┌─────────────────────────────────────┐
│  APPLICATION (UseCases/DTOs)        │
└────────────────┬────────────────────┘
                 │
                 ↓ (conhece)
┌─────────────────────────────────────┐
│  DOMAIN (Entities/Repositories)     │
└────────────────┬────────────────────┘
                 │
                 ↓ (conhece)
┌─────────────────────────────────────┐
│  INFRASTRUCTURE (DB/Cache/Email)    │
└─────────────────────────────────────┘

❌ NUNCA o DOMAIN conhece INFRASTRUCTURE
❌ NUNCA o APPLICATION conhece PRESENTATION
❌ NUNCA é de baixo para cima!
✅ SEMPRE é de cima para baixo
```

---

## 💡 Dica: Como Adicionar Uma Rota Nova

Siga os passos DE CIMA PARA BAIXO:

```
1️⃣ DOMAIN
   └─ Definir Entity se não existe
   └─ Definir Repository Interface

2️⃣ APPLICATION
   └─ Criar UseCase com lógica
   └─ Criar DTOs (Request/Response)

3️⃣ INFRASTRUCTURE
   └─ Implementar Repository (PrismaXRepository)

4️⃣ PRESENTATION
   └─ Criar Controller
   └─ Criar Validator
   └─ Adicionar rota

5️⃣ PRONTO!
```

---

## 🎓 Arquivos para Estudar

1. **`ARCHITECTURE.md`** - Explicação detalhada (você está lendo)
2. **Começar explorando:** 
   - `src/domain/entities/` - Ver as entidades
   - `src/application/usecases/` - Ver como funciona um use case
   - `src/infrastructure/database/repositories/` - Ver implementação

---

Seu backend está **MUITO BEM estruturado**! 🚀

A estrutura que você tem é exatamente Clean Architecture, que é o padrão mais usado em projetos profissionais.

Perfeito! 🎉
