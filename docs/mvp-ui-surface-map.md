# OrbitGuard Fire MVP UI Surface Map

**Status:** Concluido para a task 1.1  
**Data:** 2026-06-07  
**Referencia:** `tasks/tasks-melhoria-frontend-ui-jornada.md`, `tasks/prd-melhoria-frontend-ui-jornada.md`, `prototypes/orbitguard-fire-prototipo-v2.html`, `prototypes/orbitguard-fire-prototipo-v2.js`

## 1. Objetivo

Mapear as superficies existentes no prototipo demonstrativo que participam da jornada principal do OrbitGuard Fire e identificar, de forma objetiva, onde a revisao de copy e hierarquia visual precisara atuar nas subtasks seguintes.

## 2. Superficies da jornada principal

### 2.1 Entrada / login demonstrativo

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html`

**Blocos observados:**

- hero de abertura com proposta do fluxo;
- card de login com formulario, banners de sucesso e erro;
- resumo de contexto demonstrativo com usuario, provider e sessao;
- cards de permissao e acesso restrito;
- switcher de sessao A, B e C;
- barra de navegacao sequencial do fluxo autenticado.

**Texto visivelmente tecnico a revisar:**

- `auth demo + session context`
- `Bearer token + expiry`
- `Provider`
- `Access token`
- `403 demonstrativo`
- `Sessao A/B/C`

### 2.2 Cadastro de area monitorada

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html`

**Blocos observados:**

- card de cadastro de area;
- resumo de area cadastrada;
- resumo de validacao invalida;
- helper de regras do formulario;
- estados de vazio e sucesso.

**Texto visivelmente tecnico a revisar:**

- `contrato`
- `MVP`
- `latitude` e `longitude` com explicacao excessiva;
- chips de regra que repetem formato de validacao;
- mensagens de transicao `Cadastro com ajustes pendentes`.

### 2.3 Mapa de risco

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html` e `prototypes/orbitguard-fire-prototipo-v2.js`

**Blocos observados:**

- estado vazio do mapa;
- loading do mapa;
- superficie visual com centro, anel monitorado, anel operacional e marcadores;
- banner de fallback do mapa;
- contexto espacial;
- legenda;
- resumo de focos relevantes.

**Texto visivelmente tecnico a revisar:**

- `fallback local`
- `mock`
- `MOCK CONTROLADO`
- `LIVE`
- `NASA FIRMS`
- `NASA POWER`
- `/monitored-areas/{id}/fire-events`
- `Fonte: MOCK/FALLBACK`

### 2.4 Experiencia de calculo / risco

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html` e `prototypes/orbitguard-fire-prototipo-v2.js`

**Blocos observados:**

- estado vazio do calculo;
- banner de fallback do calculo;
- loading do risco;
- resultado do score;
- leitura imediata;
- fatores explicaveis;
- focos considerados;
- clima observado;
- sinais que entram no score;
- leitura do calculo.

**Texto visivelmente tecnico a revisar:**

- `fallback local`
- `mock controlado`
- `score`
- `Severidade: INFO`
- `janela demonstrativa de 24h`
- `conforme o contrato`
- referencias tecnicas ao endpoint em `code`.

### 2.5 Detalhe do alerta preventivo

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html` e `prototypes/orbitguard-fire-prototipo-v2.js`

**Blocos observados:**

- estado vazio do alerta;
- painel do alerta ativo;
- chips de status, canal, nivel e severidade;
- mensagem do alerta;
- causas principais;
- recomendacoes acionaveis.

**Texto visivelmente tecnico a revisar:**

- `ACTIVE`
- `IN_APP`
- `CRITICAL`
- `DANGER`
- `Risco preventivo de queimada`
- explicacoes repetidas sobre classificacao do cenario.

### 2.6 Dashboard gerencial

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html` e `prototypes/orbitguard-fire-prototipo-v2.js`

**Blocos observados:**

- estado vazio do dashboard;
- cards metricos;
- distribuicao por nivel;
- areas prioritarias;
- leitura executiva.

**Texto visivelmente tecnico a revisar:**

- `Areas monitoradas`
- `Alertas ativos`
- `Score medio`
- `Focos recentes`
- `Leitura executiva`
- mensagens de apoio que repetem o estado do fluxo.

### 2.7 Notificacao mobile / in-app

**Arquivo base:** `prototypes/orbitguard-fire-prototipo-v2.html` e `prototypes/orbitguard-fire-prototipo-v2.js`

**Blocos observados:**

- estado vazio da notificacao;
- preview mobile ativo;
- cabecalho do telefone;
- headline, subhead, badge e corpo da mensagem;
- acoes do preview;
- contexto do preview.

**Texto visivelmente tecnico a revisar:**

- `IN_APP`
- `DANGER`
- `CRITICAL`
- `Sem notificacao ativa`
- `Demonstracao de notificacao in-app`
- explicacao de que o preview nao envia mensagem real.

## 3. Prioridade de revisao sugerida

### 3.1 Prioridade alta

- Entrada / login demonstrativo.
- Cadastro de area monitorada.

Motivo: sao as primeiras superfícies visiveis e definem a leitura inicial do produto.

### 3.2 Prioridade media

- Mapa de risco.
- Experiencia de calculo / risco.
- Detalhe do alerta preventivo.

Motivo: concentram a maior densidade de explicacao tecnica e orientam o entendimento do risco.

### 3.3 Prioridade complementar

- Dashboard gerencial.
- Notificacao mobile / in-app.

Motivo: consolidam o resultado final da jornada e podem ser refinadas depois que a base narrativa estiver mais limpa.

## 4. Conclusao do levantamento

O prototipo atual cobre toda a jornada demonstrativa em uma unica superficie HTML com apoio de JavaScript local. As telas e blocos acima sao suficientes para cumprir o levantamento da task 1.1 e deixam claro onde a revisao de copy, hierarquia visual e estados de interface deve continuar nas subtasks seguintes.
