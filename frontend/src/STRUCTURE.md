# 📁 Estrutura Frontend - Organização Híbrida

Seu frontend agora está organizado de forma **limpa e escalável** (Híbrida: tipo + feature).

## 🎯 Estrutura Atual

```
src/
├── app/                    # Configuração da aplicação
│   └── providers/          # Provedores globais (Context, Redux, etc)
│
├── pages/                  # Páginas por feature
│   ├── auth/               # Páginas de autenticação
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── devices/            # Páginas de dispositivos
│   │   ├── DevicesPage.tsx
│   │   └── DeviceDetailPage.tsx
│   └── user/               # Páginas de usuário
│       ├── ProfilePage.tsx
│       └── SettingsPage.tsx
│
├── components/             # Componentes por feature
│   ├── auth/               # Componentes de auth
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── OAuthButton.tsx
│   ├── devices/            # Componentes de devices
│   │   ├── DeviceCard.tsx
│   │   ├── DeviceList.tsx
│   │   └── DeviceForm.tsx
│   └── user/               # Componentes de user
│       ├── UserProfile.tsx
│       ├── UserAvatar.tsx
│       └── UserMenu.tsx
│
├── hooks/                  # Hooks customizados por feature
│   ├── auth/               # Hooks de auth
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   └── useAuthContext.ts
│   ├── devices/            # Hooks de devices
│   │   ├── useDevices.ts
│   │   └── useDevice.ts
│   └── user/               # Hooks de user
│       ├── useUser.ts
│       ├── useProfile.ts
│       └── useUserSettings.ts
│
├── services/               # Serviços (API calls) por feature
│   ├── auth/               # API de auth
│   │   ├── authService.ts
│   │   └── tokenService.ts
│   ├── devices/            # API de devices
│   │   └── deviceService.ts
│   └── user/               # API de user
│       └── userService.ts
│
├── shared/                 # Reutilizável em todo app
│   ├── components/         # Componentes genéricos
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── Input.tsx
│   ├── hooks/              # Hooks genéricos
│   │   ├── useLocalStorage.ts
│   │   └── useWindowSize.ts
│   ├── constants/          # Constantes globais
│   │   └── apiEndpoints.ts
│   ├── types/              # Tipos TypeScript globais
│   │   ├── auth.types.ts
│   │   ├── device.types.ts
│   │   └── api.types.ts
│   └── utils/              # Funções utilitárias
│       ├── formatters.ts
│       ├── validators.ts
│       └── helpers.ts
│
├── assets/                 # Arquivos estáticos
│   ├── fonts/
│   └── images/
│
├── styles/                 # CSS global
│   ├── globals.css
│   └── variables.css
│
└── App.tsx / main.tsx      # Entrada da aplicação
```

---

## ✅ Vantagens dessa Estrutura

| Aspecto | Benefício |
|--------|-----------|
| **Organização** | Tudo organizado por tipo (pages, components, hooks) |
| **Escalabilidade** | Adicionar nova feature é fácil (auth, devices, user) |
| **Reutilização** | Pasta `shared/` centraliza componentes comuns |
| **Performance** | Separação clara facilita code-splitting |
| **Manutenção** | Encontrar código é rápido e intuitivo |
| **Isolamento** | Mudanças em `auth` não afetam `devices` |

---

## 📝 Como Usar

### Adicionar Nova Feature (ex: `analytics`)

Basta criar as subpastas:
```bash
mkdir components/analytics
mkdir hooks/analytics
mkdir pages/analytics
mkdir services/analytics
```

### Adicionar Novo Componente

```
src/components/auth/LoginForm.tsx
```

### Adicionar Novo Hook

```
src/hooks/auth/useLogin.ts
```

### Componentes Compartilhados

Se um componente é usado por **múltiplas features**, coloque em:
```
src/shared/components/Button.tsx
```

---

## 🚀 Exemplo: Implementar Feature de Autenticação

```
src/
├── pages/auth/
│   └── LoginPage.tsx              ← Página principal
├── components/auth/
│   ├── LoginForm.tsx              ← Formulário
│   └── SocialLoginButtons.tsx     ← Botões
├── hooks/auth/
│   ├── useLogin.ts                ← Lógica de login
│   └── useAuthContext.ts          ← Contexto de auth
├── services/auth/
│   ├── authService.ts             ← API calls
│   └── tokenService.ts            ← Gerenciar tokens
└── shared/
    ├── types/auth.types.ts        ← Tipos TypeScript
    └── components/Button.tsx      ← Botão reutilizável
```

---

## 💡 Dicas

1. **Não crie pastas desnecessárias** - Use `shared/` quando é reutilizável
2. **Agrupe por domínio** - `auth`, `devices`, `user` são domains, não pastas aleatórias
3. **Índice de exportação** - Crie `index.ts` em cada pasta para facilitar imports:
   ```typescript
   // src/components/auth/index.ts
   export { default as LoginForm } from './LoginForm';
   export { default as RegisterForm } from './RegisterForm';
   ```
4. **Use caminho relativo** - Prefira `../services/auth` ou configure `tsconfig` com `paths`

---

## 📌 Configurar Aliases (Opcional)

No `tsconfig.json` ou `vite.config.ts`, você pode adicionar:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

Então usar:
```typescript
import LoginForm from '@components/auth/LoginForm';
import useLogin from '@hooks/auth/useLogin';
import authService from '@services/auth/authService';
```

---

Pronto! Sua estrutura está **clara, escalável e profissional** 🎉
