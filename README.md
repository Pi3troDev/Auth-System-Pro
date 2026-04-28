# 🔐 AuthSystemPro

Sistema completo de autenticação com backend Node.js + TypeScript + Prisma e frontend React + Vite.

## 🚀 Início Rápido

### Opção 1: Rodar Backend e Frontend em Terminais Separados

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Opção 2: Rodar Ambos com um Script (Windows)

```bash
dev.bat
```

### Opção 3: Rodar Ambos com um Script (Linux/Mac)

```bash
bash dev.sh
```

## 📍 URLs

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Health Check**: http://localhost:3000/health
- **Prisma Studio**: `cd backend && npm run prisma:studio`

## 📦 Dependências

### Backend
- Express.js 5.2.1
- Prisma 5.22.0
- JWT, Bcrypt, Redis, Nodemailer
- TypeScript, TSX (watch mode)

### Frontend
- React 19.2.4
- Vite 8.0.3
- React Router 7.14.0
- TailwindCSS 4.2.2
- React Hook Form + Zod

## 🛠️ Comandos Disponíveis

### Backend
```bash
npm run dev                # Inicia servidor com hot-reload
npm run build              # Build TypeScript
npm run start              # Inicia servidor em produção
npm run prisma:migrate     # Executar migrações do Prisma
npm run prisma:studio      # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev                # Inicia Vite dev server
npm run build              # Build para produção
npm run lint               # Executar ESLint
npm run preview            # Preview da build
```

## 🗄️ Banco de Dados

Atualize o `.env` no backend com sua connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_system_pro"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
```

## 📝 Estrutura do Projeto

```
AuthSystemPro/
├── backend/
│   ├── src/
│   │   ├── application/    # DTOs e Use Cases
│   │   ├── domain/         # Entities e Repositories
│   │   ├── infrastructure/ # DB, Cache, Email
│   │   ├── presentation/   # Controllers, Routes
│   │   └── shared/         # Errors, Utils
│   └── prisma/             # Schema e Migrations
│
├── frontend/
│   ├── src/
│   │   ├── features/       # Auth, Devices, User
│   │   ├── shared/         # Components, Hooks, Utils
│   │   ├── styles/         # CSS
│   │   └── assets/         # Fonts, Images
│   └── public/
│
└── dev.bat / dev.sh        # Scripts para rodar ambos
```

## 🔐 Arquitetura

O projeto segue **Clean Architecture**:
- **Domain**: Entidades e regras de negócio
- **Application**: Use Cases e DTOs
- **Infrastructure**: Implementações técnicas
- **Presentation**: Controllers e rotas

## ⚙️ Configuração Recomendada

1. Instalar PostgreSQL e Redis localmente
2. Criar banco de dados: `auth_system_pro`
3. Atualizar `.env` do backend
4. Rodar `npm run prisma:migrate` no backend
5. Iniciar com `npm run dev` em ambos os diretórios

---

Desenvolvido com ❤️
