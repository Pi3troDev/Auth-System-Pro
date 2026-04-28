# 🎓 Entendendo: Components, Hooks, Pages e Features

## 1️⃣ **PAGES** (Páginas)

### O que é?
Uma **página** é a tela inteira que o usuário vê quando acessa uma URL no navegador.

### Exemplos do seu app:
```
/login                   → pages/auth/LoginPage.tsx
/register                → pages/auth/RegisterPage.tsx
/meus-dispositivos       → pages/devices/DevicesPage.tsx
/dispositivos/:id        → pages/devices/DeviceDetailPage.tsx
/perfil                  → pages/user/ProfilePage.tsx
```

### O que colocar em uma página?
- Layout da tela inteira
- Importar componentes menores para montar a página
- Lógica de roteamento/navegação
- Chamar hooks customizados para buscar dados

### Exemplo: `pages/auth/LoginPage.tsx`
```tsx
import { useLogin } from '@hooks/auth/useLogin';
import LoginForm from '@components/auth/LoginForm';
import Layout from '@shared/components/Layout';

export default function LoginPage() {
  const { login, loading } = useLogin();

  return (
    <Layout>
      <div className="login-container">
        <h1>Fazer Login</h1>
        <LoginForm onSubmit={login} loading={loading} />
      </div>
    </Layout>
  );
}
```

---

## 2️⃣ **COMPONENTS** (Componentes)

### O que é?
Um **componente** é um pedaço **reutilizável** de interface. É como blocos de LEGO que você monta para criar a página.

### Exemplos do seu app:

**Componentes de AUTH:**
```
components/auth/
├── LoginForm.tsx          ← Formulário de login
├── RegisterForm.tsx       ← Formulário de cadastro
├── OAuthButton.tsx        ← Botão "Login com Google"
└── TwoFactorModal.tsx     ← Modal de 2FA
```

**Componentes de DEVICES:**
```
components/devices/
├── DeviceCard.tsx         ← Card mostrando 1 dispositivo
├── DeviceList.tsx         ← Lista de múltiplos cards
├── DeviceForm.tsx         ← Formulário para criar/editar
└── DeviceActionsMenu.tsx  ← Menu de ações (deletar, editar)
```

**Componentes de USER:**
```
components/user/
├── UserProfile.tsx        ← Mostra dados do perfil
├── UserAvatar.tsx         ← Foto de perfil
├── UserMenu.tsx           ← Menu do usuário
└── EditProfileForm.tsx    ← Editar informações
```

**Componentes COMPARTILHADOS (shared):**
```
shared/components/
├── Button.tsx             ← Botão genérico
├── Input.tsx              ← Campo de input
├── Modal.tsx              ← Modal genérico
├── Spinner.tsx            ← Loading spinner
├── Card.tsx               ← Card genérico
└── Layout.tsx             ← Layout principal
```

### O que colocar em um componente?
- Interface visual (JSX/HTML)
- Receber props (dados de entrada)
- Emitir eventos (callbacks)
- Lógica **mínima** de UI (abrir/fechar modal, etc)
- Usar hooks se necessário

### Exemplo: `components/auth/LoginForm.tsx`
```tsx
import { useState } from 'react';
import Input from '@shared/components/Input';
import Button from '@shared/components/Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
}

export default function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
      />
      <Input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

## 3️⃣ **HOOKS** (Ganchos/Funções Customizadas)

### O que é?
Um **hook** é uma **função reutilizável** que encapsula lógica (buscar dados, gerenciar estado, etc).

### Exemplos do seu app:

**Hooks de AUTH:**
```
hooks/auth/
├── useLogin.ts            ← Lógica de fazer login
├── useRegister.ts         ← Lógica de cadastro
├── useLogout.ts           ← Lógica de logout
├── useTwoFactor.ts        ← Lógica de 2FA
└── useAuthContext.ts      ← Acessar contexto de auth
```

**Hooks de DEVICES:**
```
hooks/devices/
├── useDevices.ts          ← Buscar lista de dispositivos
├── useDevice.ts           ← Buscar 1 dispositivo
├── useCreateDevice.ts     ← Criar novo dispositivo
├── useDeleteDevice.ts     ← Deletar dispositivo
└── useDeviceFilter.ts     ← Filtrar dispositivos
```

**Hooks de USER:**
```
hooks/user/
├── useUser.ts             ← Pegar dados do usuário
├── useUpdateProfile.ts    ← Atualizar perfil
├── useUserSettings.ts     ← Gerenciar configurações
└── useChangePassword.ts   ← Mudar senha
```

**Hooks COMPARTILHADOS (shared):**
```
shared/hooks/
├── useLocalStorage.ts     ← Salvar dados no navegador
├── useWindowSize.ts       ← Pegar tamanho da janela
├── useFetch.ts            ← Fazer requisições HTTP
└── useForm.ts             ← Gerenciar formulários
```

### O que colocar em um hook?
- Lógica de negócio (buscar dados, validações)
- Gerenciar estado (useState, useReducer)
- Efeitos colaterais (useEffect)
- Não retorna JSX!

### Exemplo: `hooks/auth/useLogin.ts`
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@services/auth/authService';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      
      // Salvar token no localStorage
      localStorage.setItem('token', response.token);
      
      // Redirecionar para dashboard
      navigate('/dispositivos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
```

---

## 4️⃣ **SERVICES** (Serviços - API Calls)

### O que é?
Um **service** é a camada que se comunica com o **backend** (fazer requisições HTTP).

### Exemplos:

**Services de AUTH:**
```
services/auth/
├── authService.ts         ← login(), register(), logout()
└── tokenService.ts        ← refresh token, validar token
```

**Services de DEVICES:**
```
services/devices/
└── deviceService.ts       ← getDevices(), createDevice(), deleteDevice()
```

**Services de USER:**
```
services/user/
└── userService.ts         ← getProfile(), updateProfile()
```

### Exemplo: `services/auth/authService.ts`
```ts
import api from '@shared/utils/api'; // axios ou fetch wrapper

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

export default authService;
```

---

## 🎯 FLUXO COMPLETO: Fazer Login

Vamos ver como tudo se conecta:

```
1️⃣ PÁGINA (LoginPage.tsx)
   └─ Renderiza o componente LoginForm
   └─ Importa o hook useLogin

2️⃣ COMPONENTE (LoginForm.tsx)
   └─ Mostra os campos de email e senha
   └─ Recebe a função onSubmit do hook
   └─ Quando o usuário clica "Login", chama onSubmit

3️⃣ HOOK (useLogin.ts)
   └─ Lógica de fazer login
   └─ Chama o service authService.login()
   └─ Salva o token
   └─ Redireciona

4️⃣ SERVICE (authService.ts)
   └─ Faz requisição POST /auth/login
   └─ Backend valida e retorna o token

```

### Diagrama Visual:

```
┌─────────────────────────────────────┐
│   pages/auth/LoginPage.tsx          │  ← PÁGINA INTEIRA
│  (Tela de login do usuário)        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ components/auth/LoginForm   │   │  ← COMPONENTE
│  │ (Formulário visual)         │   │  (inputs + botão)
│  └──────────┬──────────────────┘   │
│             │                      │
│  hooks/auth/useLogin()             │  ← HOOK (lógica)
│  - Gerencia estado                 │
│  - Chama authService.login()       │
│  │                                 │
│  └────────────────────┐            │
└─────────────────────────────────────┘
                        │
        ┌───────────────▼──────────────┐
        │ services/auth/authService.ts │  ← SERVICE
        │ - Faz POST /auth/login       │  (comunica com backend)
        │ - Retorna token              │
        └──────────────────────────────┘
```

---

## 🎪 POR QUE TER `auth`, `devices`, `user` EM CADA PASTA?

Porque seu app tem **3 domínios/features diferentes**:

### **1. AUTH (Autenticação)**
Tudo relacionado a login, cadastro, 2FA, tokens, etc.

```
components/auth/
├── LoginForm.tsx          ← Componente de LOGIN
├── RegisterForm.tsx       ← Componente de CADASTRO
├── TwoFactorModal.tsx     ← Componente de 2FA

hooks/auth/
├── useLogin.ts            ← Hook para fazer LOGIN
├── useRegister.ts         ← Hook para CADASTRO

pages/auth/
├── LoginPage.tsx          ← Página de LOGIN
├── RegisterPage.tsx       ← Página de CADASTRO

services/auth/
└── authService.ts         ← API calls de autenticação
```

---

### **2. DEVICES (Gerenciar Dispositivos)**
Tudo relacionado a dispositivos conectados, monitoramento, etc.

```
components/devices/
├── DeviceCard.tsx         ← Card do dispositivo
├── DeviceList.tsx         ← Lista de dispositivos

hooks/devices/
├── useDevices.ts          ← Hook para buscar dispositivos
├── useDeleteDevice.ts     ← Hook para deletar

pages/devices/
├── DevicesPage.tsx        ← Página listando todos
├── DeviceDetailPage.tsx   ← Página de 1 dispositivo

services/devices/
└── deviceService.ts       ← API calls de dispositivos
```

---

### **3. USER (Gerenciar Usuário)**
Tudo relacionado ao perfil, configurações, preferências, etc.

```
components/user/
├── UserProfile.tsx        ← Componente do perfil
├── EditProfileForm.tsx    ← Form de editar

hooks/user/
├── useUser.ts             ← Hook para pegar dados
├── useUpdateProfile.ts    ← Hook para atualizar

pages/user/
├── ProfilePage.tsx        ← Página do perfil
├── SettingsPage.tsx       ← Página de configurações

services/user/
└── userService.ts         ← API calls do usuário
```

---

## ✅ RESUMO VISUAL

| Pasta | O que é | Exemplo |
|-------|---------|---------|
| **pages/auth** | Telas inteiras | LoginPage, RegisterPage |
| **components/auth** | Pedaços reutilizáveis | LoginForm, OAuthButton |
| **hooks/auth** | Funções com lógica | useLogin, useRegister |
| **services/auth** | Chamadas de API | authService.login() |
|  |  |  |
| **pages/devices** | Telas de dispositivos | DevicesPage, DeviceDetail |
| **components/devices** | Componentes | DeviceCard, DeviceList |
| **hooks/devices** | Funções | useDevices, useDeleteDevice |
| **services/devices** | Chamadas de API | deviceService.getDevices() |
|  |  |  |
| **pages/user** | Telas do usuário | ProfilePage, SettingsPage |
| **components/user** | Componentes | UserProfile, UserMenu |
| **hooks/user** | Funções | useUser, useUpdateProfile |
| **services/user** | Chamadas de API | userService.getProfile() |
|  |  |  |
| **shared/** | Reutilizável | Button, Input, Modal |

---

## 🚀 Exemplo Prático Completo: Deletar Dispositivo

### 1. Criar o hook (`hooks/devices/useDeleteDevice.ts`)
```tsx
import { useState } from 'react';
import deviceService from '@services/devices/deviceService';

export function useDeleteDevice() {
  const [loading, setLoading] = useState(false);

  const deleteDevice = async (deviceId: string) => {
    setLoading(true);
    try {
      await deviceService.deleteDevice(deviceId);
      // Recarregar lista de dispositivos
      return true;
    } catch (error) {
      console.error('Erro ao deletar:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDevice, loading };
}
```

### 2. Criar o componente (`components/devices/DeviceCard.tsx`)
```tsx
import { useDeleteDevice } from '@hooks/devices/useDeleteDevice';
import Button from '@shared/components/Button';

interface DeviceCardProps {
  device: any;
  onDeleted: () => void;
}

export default function DeviceCard({ device, onDeleted }: DeviceCardProps) {
  const { deleteDevice, loading } = useDeleteDevice();

  const handleDelete = async () => {
    const success = await deleteDevice(device.id);
    if (success) {
      onDeleted(); // Avisa a página que foi deletado
    }
  };

  return (
    <div className="device-card">
      <h3>{device.name}</h3>
      <p>{device.model}</p>
      <Button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deletando...' : 'Deletar'}
      </Button>
    </div>
  );
}
```

### 3. Usar na página (`pages/devices/DevicesPage.tsx`)
```tsx
import { useState, useEffect } from 'react';
import { useDevices } from '@hooks/devices/useDevices';
import DeviceCard from '@components/devices/DeviceCard';

export default function DevicesPage() {
  const { devices, loading, refetch } = useDevices();

  return (
    <div>
      <h1>Meus Dispositivos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="device-list">
          {devices.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device}
              onDeleted={refetch}  // Recarrega quando deletar
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 4. Service faz a requisição (`services/devices/deviceService.ts`)
```ts
import api from '@shared/utils/api';

const deviceService = {
  deleteDevice: async (deviceId: string) => {
    await api.delete(`/devices/${deviceId}`);
  },
};

export default deviceService;
```

---

## 💡 Resumão Final

**PAGES**: Telas inteiras (LoginPage, DevicesPage)
**COMPONENTS**: Pedaços de interface (LoginForm, DeviceCard)
**HOOKS**: Funções com lógica (useLogin, useDevices)
**SERVICES**: Requisições HTTP (authService, deviceService)

**auth**, **devices**, **user**: São as **features/domínios** do seu app

Cada feature tem seus próprios:
- Páginas
- Componentes
- Hooks
- Services

Assim, tudo de login fica junto, tudo de dispositivos fica junto, etc. 🎯

Faz sentido agora? 😄
