# Guia Pratico de Execucao do MVP

**Status:** guia operacional para a entrega demonstrativa do OrbitGuard Fire  
**Escopo:** como instalar, iniciar e validar o projeto no estado atual do repositório  
**Referencias:** `README.md`, `docs/mvp-operational-guide.md`, `docs/mvp-foundation.md`, `docs/api-contracts.md`

## 1. O que este guia cobre

Este documento explica o caminho mais curto para:

- preparar o ambiente local;
- iniciar o backend em modo de desenvolvimento;
- abrir o prototipo navegavel;
- rodar as validacoes principais do MVP;
- reconhecer os problemas mais comuns durante a execucao.

O MVP atual ainda usa prototipo HTML e backend demonstrativo em memoria. Nesta fase, nao e necessario configurar PostgreSQL, PostGIS, JWT ou integracoes externas para seguir o fluxo principal.

## 2. Pre-requisitos

Antes de rodar o projeto, verifique se voce tem:

- Node.js instalado;
- `npm` disponivel no terminal;
- acesso de escrita na pasta do repositorio;
- navegador para abrir o prototipo.

## 3. Instalacao

O workspace principal usa scripts na raiz e dependencias do backend em `backend/`.

Execute a instalacao do backend:

```bash
npm install --prefix backend
```

Se voce ja tem as dependencias instaladas e so quer validar o fluxo, pode seguir direto para os comandos de execucao.

## 4. Como subir o backend

Para iniciar o backend em desenvolvimento, use o script da raiz:

```bash
npm run start:backend
```

Esse comando executa o backend com `ts-node` a partir de `backend/src/index.ts`.

Se preferir, voce pode chamar o script do proprio pacote:

```bash
npm --prefix backend run dev
```

## 5. Como abrir o prototipo

O frontend demonstrativo atual e o prototipo navegavel em HTML puro.

### Opcao mais rapida

Abra o arquivo direto no navegador:

```text
prototypes/orbitguard-fire-prototipo-v2.html
```

### Opcao recomendada para teste local

Sirva a pasta com um servidor simples:

```bash
python -m http.server 5500
```

Depois abra:

```text
http://localhost:5500/prototypes/orbitguard-fire-prototipo-v2.html
```

### Opcao automatizada

Para executar a demo de forma automatica, use:

```bash
npm run demo:prototype
```

Esse comando roda o teste E2E do prototipo em Node.js.

## 6. Como validar o MVP

Use os comandos abaixo quando quiser confirmar que a base esta consistente:

```bash
npm run check
npm run check:backend
npm run check:prototype
npm run check:mvp:test
```

### O que cada comando faz

- `npm run check` executa a pipeline minima do MVP;
- `npm run check:backend` valida apenas o backend;
- `npm run check:prototype` verifica a sintaxe e executa a demo do prototipo;
- `npm run check:mvp:test` valida o contrato da pipeline do repositorio.

## 7. Fluxo pratico recomendado

Se voce estiver entrando no projeto pela primeira vez, siga esta ordem:

1. Instale as dependencias do backend.
2. Suba o backend com `npm run start:backend`.
3. Abra o prototipo navegavel ou rode `npm run demo:prototype`.
4. Execute `npm run check` para confirmar a integridade minima.

## 8. Problemas comuns

### `ts-node` ou dependencias ausentes

Se o backend falhar ao iniciar, reinstale as dependencias:

```bash
npm install --prefix backend
```

### Prototipo nao abre corretamente

Se o arquivo HTML for aberto diretamente e os assets nao carregarem como esperado, use o servidor local com `python -m http.server 5500`.

### Porta ocupada

Se a porta `5500` ja estiver em uso, escolha outra porta e ajuste a URL final no navegador.

## 9. Limites atuais do ambiente

O guia cobre apenas a entrega demonstrativa atual. Os seguintes pontos continuam como evolucao futura:

- autenticacao JWT;
- persistencia em PostgreSQL;
- consultas espaciais com PostGIS;
- integracoes reais com fontes externas;
- jobs recorrentes de ingestao.

## 10. Referencias relacionadas

- `README.md`
- `docs/mvp-operational-guide.md`
- `docs/mvp-release-checklist.md`
- `docs/api-contracts.md`
- `tasks/tasks-orbitguard-fire-mvp.md`
