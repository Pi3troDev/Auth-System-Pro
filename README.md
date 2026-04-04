# AuthSystemPro

Clean Architecture Authentication System built with Node.js, TypeScript, React, and Prisma.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Frontend:** React, Vite, TypeScript
- **Database:** PostgreSQL (configurable via Prisma)
- **Architecture:** Clean Architecture (Uncle Bob's Uncle Bob's Clean Architecture pattern)

## Project Structure

```
packages/
├── backend/          # Express API with Clean Architecture
│   ├── src/
│   │   ├── entities/         # Business logic (domain models)
│   │   ├── usecases/         # Application business rules
│   │   ├── interfaces/       # Controllers, presenters, gateways
│   │   ├── infrastructure/   # Frameworks, drivers, DB access
│   │   ├── common/           # Shared utilities and errors
│   │   ├── di/               # Dependency injection setup
│   │   └── main.ts           # Entry point
│   ├── prisma/               # Database schema and migrations
│   └── package.json
│
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API communication
│   │   ├── types/            # Local TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── shared/           # Shared types and utilities
    ├── src/
    │   ├── types/            # Shared TypeScript types
    │   └── errors/           # Shared error types
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL (or configure Prisma for another database)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd AuthSystemPro
   ```

2. Install dependencies for all workspaces
   ```bash
   npm install
   ```

3. Setup environment variables
   - Backend: `cp packages/backend/.env.example packages/backend/.env`
   - Frontend: `cp packages/frontend/.env.example packages/frontend/.env`

4. Initialize database with Prisma
   ```bash
   npm run prisma:migrate
   ```

## Available Scripts

### Development

```bash
# Run backend server
npm run dev:backend

# Run frontend dev server
npm run dev:frontend

# Run both (parallel)
npm run dev
```

### Build

```bash
# Build all packages
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

### Database

```bash
# Run Prisma migrations
npm run prisma:migrate

# Open Prisma Studio (UI for database)
npm run prisma:studio
```

### Production

```bash
# Start production server
npm run start
```

## Architecture Layers

### 1. **Entities** (Domain Layer)
Pure business logic independent of frameworks. Contains core domain models and business rules.

Example:
```typescript
// src/entities/user/User.ts
export class User {
  private email: string;
  private password: string;

  isValidEmail(): boolean { }
  hashPassword(): string { }
}
```

### 2. **Usecases** (Application Layer)
Application-specific business rules. Orchestrates entities and repositories to fulfill use cases.

Example:
```typescript
// src/usecases/user/CreateUserUsecase.ts
export class CreateUserUsecase {
  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const user = new User(input);
    await this.userRepository.save(user);
    return new UserPresenter(user);
  }
}
```

### 3. **Interfaces** (Adapter Layer)
Converts between different formats. Contains controllers, presenters, and gateway interfaces.

### 4. **Infrastructure** (Framework Layer)
Concrete implementations and external tools. Databases, HTTP frameworks, external services.

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/auth_system_pro
NODE_ENV=development
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## Contributing

Maintain the Clean Architecture principles when adding features.

## License

MIT
