# NutriTrack 🥗⏱️

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

Uma aplicação web *Fullstack Serverless* focada em saúde e bem-estar, que combina o rastreamento inteligente de calorias com o monitoramento de jejum intermitente em tempo real.

🔗 **[Clique aqui para acessar o projeto!](https://nutrifasto-agente.vercel.app/)** 

---

## 🎯 Visão Geral

O **NutriTrack** foi desenvolvido para resolver a fragmentação no acompanhamento nutricional. Em vez de usar um app para jejum e outro para calorias, o usuário possui um *Dashboard* unificado com sincronização de dados em tempo real e busca automatizada de alimentos.

### ✨ Funcionalidades Principais (Features)

* **Autenticação e Onboarding:** Fluxo seguro via Firebase Auth. Coleta inicial de dados biométricos para cálculo automático e sugestão de meta calórica diária.
* **Integração de API Externa (Smart Search):** Consumo da API pública *OpenFoodFacts*. Permite busca de alimentos em tempo real com cálculo dinâmico de calorias (Regra de 3) baseado na porção em gramas/ml informada pelo usuário.
* **Planner Semanal e Máquina do Tempo:** Navegação intuitiva em formato de carrossel. O usuário pode filtrar refeições por dias da semana atual ou utilizar o seletor de datas para buscar históricos de meses anteriores.
* **Cronômetro Persistente de Jejum:** Lógica de timer em tempo real (16:8, 18:6, 20:4, 24h) com persistência em banco de dados. O relógio continua operando em background (Server-side) mesmo se a aplicação for fechada.
* **Dashboard Analítico:** *[Em desenvolvimento: Gráficos de performance semanal e histórico detalhado de aderência].*

---

## 🛠️ Stack Tecnológica e Arquitetura

O projeto foi construído focando em performance, tipagem estática e componentização:

* **Frontend:** React.js, Next.js (App Router), Tailwind CSS e Lucide Icons.
* **Linguagem:** TypeScript (Interfaces rígidas para previsibilidade de dados).
* **Backend/BaaS:** Firebase Cloud Firestore (Banco de dados NoSQL com listeners `onSnapshot` para reatividade instantânea).
* **Integrações:** Fetch API nativa consumindo bases globais de nutrição.

---

## 🔒 Segurança (Firestore Rules)

Para garantir a privacidade dos dados em ambiente de produção, foram aplicadas regras de *Row Level Security* (RLS) no banco de dados, garantindo que o usuário manipule estritamente o seu próprio nó de dados:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

Para rodar LOCALMENTE:
Passo 1:git clone [https://github.com/fernandaosribeiro1/agente-nutricao.git](https://github.com/fernandaosribeiro1/agente-nutricao.git)

Passo 2:cd agente-nutricao


Configure as Variáveis de Ambiente:
Crie um arquivo .env.local na raiz do projeto e insira as chaves do seu projeto Firebase:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id_aqui

Inicie o servidor de desenvolvimento:

Bash
npm run dev
Acesse http://localhost:3000 (Ctrl + click) no seu navegador.
