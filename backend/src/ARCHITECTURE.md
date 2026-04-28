# 🏗️ Entendendo a Estrutura Backend - Clean Architecture

## O que é Clean Architecture?

**Clean Architecture** é um padrão que organiza o código em **camadas independentes**, onde cada camada tem uma responsabilidade bem definida.

A regra de ouro: **As camadas internas não sabem da existência das externas!**

```
┌─────────────────────────────────────┐
│   PRESENTATION (Entrada/Saída)      │  ← HTTP, Controllers, Routes
├─────────────────────────────────────┤
│   APPLICATION (Orquestração)        │  ← Use Cases, DTOs
├─────────────────────────────────────┤
│   DOMAIN (Regras de Negócio)        │  ← Entities, Repositories
├─────────────────────────────────────┤
│   INFRASTRUCTURE (Implementação)    │  ← Database, Cache, Email
└─────────────────────────────────────┘
```

---

## 1️⃣ DOMAIN (Camada de Regras de Negócio)

### O que é?
É o **coração** do seu app. Contém as regras de negócio puras, sem dependências externas (sem banco, API, etc).

### Pastas:

#### **entities/**
Representam as **entidades do negócio** (User, Device, Token, etc).

```typescript
// domain/entities/User.ts
export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;

  // Métodos de regra de negócio
  isPasswordValid(password: string): boolean {
    // Lógica de validação
  }

  canDeleteDevice(): boolean {
    // Pode deletar apenas se for owner
  }
}
```

#### **repositories/**
**Interfaces** que definem como salvar/buscar dados (não implementação!).

```typescript
// domain/repositories/IUserRepository.ts
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

#### **value-objects/**
Objetos que representam **valores** (Email, Password, CPF, etc).

```typescript
// domain/value-objects/Email.ts
export class Email {
  readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Email inválido');
    }
    this.value = value;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### ✅ Domain é:
- Puro (sem dependências externas)
- Testável (fácil fazer testes)
- Reutilizável (pode ser usado em CLI, API, etc)

### ❌ Domain NÃO é:
- Não deve conhecer banco de dados
- Não deve fazer requisições HTTP
- Não deve acessar arquivo externo

---

## 2️⃣ APPLICATION (Camada de Orquestração)

### O que é?
É o **maestro** que orquestra as regras de negócio. Conecta Domain com o resto do sistema.

### Pastas:

#### **usecases/**
**Casos de uso** = uma ação específica do sistema (fazer login, criar dispositivo, etc).

```
usecases/
├── auth/
│   ├── LoginUseCase.ts          ← Fazer login
│   ├── RegisterUseCase.ts       ← Cadastro
│   ├── LogoutUseCase.ts         ← Logout
│   └── RefreshTokenUseCase.ts   ← Renovar token
├── user/
│   ├── GetUserUseCase.ts        ← Buscar usuário
│   ├── UpdateProfileUseCase.ts  ← Atualizar perfil
│   └── ChangePasswordUseCase.ts ← Mudar senha
└── device/
    ├── CreateDeviceUseCase.ts   ← Criar dispositivo
    ├── ListDevicesUseCase.ts    ← Listar dispositivos
    └── DeleteDeviceUseCase.ts   ← Deletar dispositivo
```

**Exemplo: LoginUseCase.ts**
```typescript
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { cryptoService } from '@infrastructure/crypto';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    // 1. Buscar usuário
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    // 2. Validar senha (regra de negócio)
    const isPasswordValid = await cryptoService.comparePasswords(
      password,
      user.password
    );
    if (!isPasswordValid) throw new Error('Senha inválida');

    // 3. Gerar token (regra de negócio)
    const token = await cryptoService.generateToken(user.id);

    // 4. Retornar resultado
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
```

#### **dto/**
**DTO = Data Transfer Object** = Estrutura de dados para transferência entre camadas.

```
dto/
├── auth/
│   ├── LoginRequestDTO.ts       ← Dados que vem do cliente
│   ├── LoginResponseDTO.ts      ← Dados que retorna
│   ├── RegisterRequestDTO.ts
│   └── RegisterResponseDTO.ts
├── user/
│   ├── UpdateProfileRequestDTO.ts
│   └── UserResponseDTO.ts
└── device/
    ├── CreateDeviceRequestDTO.ts
    └── DeviceResponseDTO.ts
```

**Exemplo: LoginRequestDTO.ts**
```typescript
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

### ✅ Application é:
- Orquestra casos de uso
- Conecta Domain com Infrastructure
- Contém a lógica de fluxo

---

## 3️⃣ INFRASTRUCTURE (Camada de Implementação)

### O que é?
É a **implementação técnica** - banco de dados, cache, email, criptografia, etc.

### Pastas:

#### **database/**
Implementação do banco de dados (Prisma, TypeORM, etc).

```
database/
├── prisma/
│   └── (migrations vão aqui)
└── repositories/
    ├── PrismaUserRepository.ts      ← Implementação do IUserRepository
    ├── PrismaDeviceRepository.ts
    └── PrismaTokenRepository.ts
```

**Exemplo: PrismaUserRepository.ts**
```typescript
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';
import { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
    });
    return data ? new User(data) : null;
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });
    return data ? new User(data) : null;
  }

  // ... outros métodos
}
```

#### **cache/**
Redis, memória, etc.

```typescript
// infrastructure/cache/RedisCache.ts
export class RedisCache {
  async get(key: string): Promise<any> {
    // GET do Redis
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    // SET do Redis
  }

  async delete(key: string): Promise<void> {
    // DELETE do Redis
  }
}
```

#### **crypto/**
Criptografia, hash de senha, JWT, etc.

```typescript
// infrastructure/crypto/CryptoService.ts
export class CryptoService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
```

#### **email/**
Nodemailer, SendGrid, etc.

```typescript
// infrastructure/email/EmailService.ts
export class EmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // Enviar email com Nodemailer
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    // Enviar email de reset
  }
}
```

### ✅ Infrastructure é:
- Implementação técnica
- Não contém lógica de negócio
- Pode ser trocada (ex: trocar Prisma por TypeORM)

---

## 4️⃣ PRESENTATION (Camada de Apresentação)

### O que é?
É a **interface com o mundo externo** - controllers, rotas, validadores, middlewares.

### Pastas:

#### **controllers/**
Recebem requisições HTTP e retornam respostas.

```
controllers/
├── auth/
│   ├── LoginController.ts       ← Handles POST /auth/login
│   ├── RegisterController.ts    ← Handles POST /auth/register
│   └── LogoutController.ts      ← Handles POST /auth/logout
├── user/
│   ├── GetUserController.ts     ← Handles GET /user/:id
│   └── UpdateProfileController.ts ← Handles PUT /user/:id
└── device/
    ├── ListDevicesController.ts ← Handles GET /devices
    └── CreateDeviceController.ts ← Handles POST /devices
```

**Exemplo: LoginController.ts**
```typescript
import { Request, Response } from 'express';
import { LoginUseCase } from '@application/usecases/auth/LoginUseCase';
import { LoginRequestDTO } from '@application/dto/auth/LoginRequestDTO';

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Executar use case
      const result = await this.loginUseCase.execute(email, password);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}
```

#### **routes/**
Definem as rotas HTTP.

```
routes/
├── auth.routes.ts      ← POST /auth/login, POST /auth/register
├── user.routes.ts      ← GET /user/:id, PUT /user/:id
└── device.routes.ts    ← GET /devices, POST /devices
```

**Exemplo: auth.routes.ts**
```typescript
import { Router } from 'express';
import { LoginController } from '@presentation/http/controllers/auth/LoginController';

const router = Router();
const loginController = new LoginController(loginUseCase);

router.post('/login', (req, res) => loginController.handle(req, res));

export default router;
```

#### **middlewares/**
Validação, autenticação, autorização, erro handling.

```
middlewares/
├── authMiddleware.ts     ← Verificar token JWT
├── validationMiddleware.ts ← Validar dados
└── errorHandler.ts       ← Tratar erros globalmente
```

**Exemplo: authMiddleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { cryptoService } from '@infrastructure/crypto';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('Token não fornecido');

    const decoded = cryptoService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Não autorizado' });
  }
}
```

#### **validators/**
Validação de dados com Zod, Joi, etc.

```typescript
// presentation/http/validators/loginValidator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export function validateLogin(data: any) {
  return loginSchema.parse(data);
}
```

### ✅ Presentation é:
- Interface com cliente (HTTP)
- Não contém lógica de negócio
- Apenas recebe dados e chama use cases

---

## 5️⃣ SHARED (Utilitários Comuns)

### **errors/**
Classes de erro customizadas.

```typescript
// shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### **utils/**
Funções reutilizáveis.

```typescript
// shared/utils/logger.ts
export function logger(message: string, level: 'info' | 'error' = 'info') {
  console.log(`[${level}] ${message}`);
}

// shared/utils/formatters.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}
```

---

## 🎯 FLUXO COMPLETO: Fazer Login

```
1. Cliente envia: POST /auth/login
   {
     "email": "user@example.com",
     "password": "12345678"
   }
   
   └─ vai para: presentation/http/routes/auth.routes.ts

2. Route chama: presentation/http/controllers/auth/LoginController
   └─ Controller valida com validators/loginValidator
   └─ Controller chama: application/usecases/auth/LoginUseCase

3. LoginUseCase (Application):
   ├─ Busca usuário: IUserRepository.findByEmail()
   ├─ Valida senha com: cryptoService.comparePasswords()
   ├─ Gera token com: cryptoService.generateToken()
   └─ Retorna resultado

4. IUserRepository é implementado por: infrastructure/database/repositories/PrismaUserRepository
   └─ Que faz query no Prisma (PostgreSQL)

5. cryptoService é implementado por: infrastructure/crypto/CryptoService
   └─ Que usa bcrypt e JWT

6. LoginController retorna ao cliente:
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "123",
       "email": "user@example.com",
       "name": "João"
     }
   }
```

```
┌─────────────────────────────────────┐
│  PRESENTATION                       │
│  - LoginController                  │
│  - routes/auth.routes.ts            │
│  - validators/loginValidator        │
├─────────────────────────────────────┤
│  APPLICATION                        │
│  - LoginUseCase                     │
│  - DTOs                             │
├─────────────────────────────────────┤
│  DOMAIN                             │
│  - User Entity                      │
│  - IUserRepository Interface        │
├─────────────────────────────────────┤
│  INFRASTRUCTURE                     │
│  - PrismaUserRepository (implmts)   │
│  - CryptoService                    │
│  - Database (Prisma)                │
└─────────────────────────────────────┘
```

---

## 📊 COMPARAÇÃO: O que vai em cada camada?

| Pergunta | Resposta | Camada |
|----------|----------|--------|
| Onde defino que **usuário tem email**? | Entity User | DOMAIN |
| Onde defino que **email deve ser válido**? | Value Object Email ou Entity | DOMAIN |
| Onde defino **como salvar usuário no banco**? | Interface IUserRepository | DOMAIN |
| Onde implemento a **salvação no Prisma**? | PrismaUserRepository | INFRASTRUCTURE |
| Onde orquesto **o fluxo de login**? | LoginUseCase | APPLICATION |
| Onde defino a **estrutura de dados do Login**? | DTOs | APPLICATION |
| Onde recebo a **requisição HTTP**? | LoginController | PRESENTATION |
| Onde valido o **email do formulário**? | validators/loginValidator | PRESENTATION |
| Onde defino a **rota POST /auth/login**? | routes/auth.routes.ts | PRESENTATION |
| Onde trato **erros globalmente**? | errorHandler middleware | PRESENTATION / SHARED |

---

## ✨ BENEFÍCIOS DESSA ESTRUTURA

### 1. **Independência**
Cada camada é independente. Pode trocar Prisma por TypeORM sem afetar Application/Domain.

### 2. **Testabilidade**
- Domain é 100% testável (sem dependências externas)
- Application é testável com mocks
- Infrastructure é testável com stubs

### 3. **Reusabilidade**
Domain e Application podem ser usados em CLI, API, gRPC, etc.

### 4. **Manutenção**
Mudanças isoladas. Bug em Prisma não afeta lógica de negócio.

### 5. **Escalabilidade**
Fácil adicionar novas features sem quebrar o existente.

---

## 📝 EXEMPLO: Adicionar Nova Feature (Dispositivos)

```
1. DOMAIN
   └─ domain/entities/Device.ts
   └─ domain/repositories/IDeviceRepository.ts
   └─ domain/value-objects/DeviceName.ts

2. APPLICATION
   └─ application/usecases/device/CreateDeviceUseCase.ts
   └─ application/usecases/device/ListDevicesUseCase.ts
   └─ application/dto/device/CreateDeviceRequestDTO.ts
   └─ application/dto/device/DeviceResponseDTO.ts

3. INFRASTRUCTURE
   └─ infrastructure/database/repositories/PrismaDeviceRepository.ts

4. PRESENTATION
   └─ presentation/http/controllers/device/CreateDeviceController.ts
   └─ presentation/http/controllers/device/ListDevicesController.ts
   └─ presentation/http/routes/device.routes.ts
   └─ presentation/http/validators/deviceValidator.ts
   └─ presentation/http/middlewares/deviceAuthorization.ts
```

---

## 🎓 RESUMO FINAL

| Camada | O quê | Exemplo |
|--------|-------|---------|
| **DOMAIN** | Regras de negócio puras | User, Email, Repositories (interfaces) |
| **APPLICATION** | Orquestra use cases | LoginUseCase, DTOs |
| **INFRASTRUCTURE** | Implementação técnica | PrismaUserRepository, CryptoService |
| **PRESENTATION** | Interface HTTP | Controllers, Routes, Validators |
| **SHARED** | Utilitários | Errors, Logger, Formatters |

**Fluxo de dados (de fora para dentro):**
```
HTTP Request → Controller → UseCase → Domain Logic → Repository → Database
                                        ↑
                                    Infrastructure
```

**O que cada camada conhece:**
```
PRESENTATION → APPLICATION → DOMAIN
                 ↓
            INFRASTRUCTURE
                 ↓
            (acessa Database/Cache/etc)

Regra: Cada camada só conhece as internas, nunca as externas!
```

---

Perfeito! Seu backend já está bem estruturado em Clean Architecture! 🎉
