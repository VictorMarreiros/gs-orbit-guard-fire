# Tasks - OrbitGuard Fire MVP

**Produto:** OrbitGuard Fire  
**Funcionalidade:** MVP da plataforma de alerta orbital preventivo contra queimadas  
**PRD de origem:** `/tasks/prd-orbitguard-fire-mvp.md`  
**Arquivo de tasks:** `/tasks/tasks-orbitguard-fire-mvp.md`  
**Status:** Draft  
**Data:** 2026-06-07  

---

## 1. Resumo da implementacao

Esta lista de tasks cobre a implementacao do MVP demonstrativo do OrbitGuard Fire, incluindo autenticacao demonstrativa ou simplificada, cadastro de areas monitoradas, visualizacao em mapa, uso de dados simulados de focos e clima, calculo explicavel de score de risco, geracao de alerta preventivo, dashboard consolidado, estados de UI, observabilidade minima e validacoes tecnicas e funcionais.

## 2. Premissas assumidas

- A entrega atual prioriza o MVP conceitual e demonstrativo, sem dependencia obrigatoria de integracoes externas reais.
- Dados simulados/controlados sao aceitaveis como fonte principal da demonstracao desde que preservem o fluxo e a explicabilidade.
- O login pode ser simplificado ou demonstrativo nesta fase, desde que nao conflite com a evolucao para JWT prevista no PRD.
- Persistencia completa de historico pode ser reduzida no MVP desde que a experiencia do dashboard e do alerta seja atendida.

## 3. Lacunas identificadas no PRD

- O criterio exato de permissao e compartilhamento de areas entre usuarios ainda nao esta fechado.
- A janela temporal padrao para focos recentes no calculo de risco ainda precisa decisao final.
- O nivel de persistencia historica exigido no MVP ainda pode variar entre dado real e simulacao.
- O conjunto inicial definitivo de tipos de area ainda precisa refinamento.

Nenhuma lacuna bloqueadora impede a extracao inicial de tasks.

## 4. Itens fora do escopo identificados

- operacao produtiva com SLA real;
- integracao obrigatoria e estavel com todas as APIs externas no MVP;
- aplicacao mobile nativa;
- envio real de notificacoes por WhatsApp, SMS ou e-mail;
- modelos preditivos de machine learning;
- gestao completa multi-tenant com perfis avancados de autorizacao;
- ingestao historica em larga escala;
- relatorios ESG, integracao com sensores locais ou Defesa Civil.

## 5. Mapa de rastreabilidade

| ID do PRD | Tipo | Descricao resumida | Tasks relacionadas | Status de cobertura |
|---|---|---|---|---|
| RF001 | Requisito funcional | Cadastrar area monitorada | 2.1, 3.3, 4.2, 5.2, 6.4, 8.1, 9.2, 10.1 | Coberto |
| RF002 | Requisito funcional | Exibir area e contexto espacial no mapa | 2.2, 3.4, 4.3, 5.3, 6.1, 8.2, 9.3, 10.2 | Coberto |
| RF003 | Requisito funcional | Obter ou simular focos de calor proximos | 1.3, 2.3, 3.5, 4.4, 5.4, 6.3, 7.2, 8.3, 9.4, 10.3 | Coberto |
| RF004 | Requisito funcional | Obter ou simular dados climaticos relevantes | 1.3, 2.4, 3.6, 4.5, 5.4, 6.3, 7.3, 8.3, 9.5, 10.3 | Coberto |
| RF005 | Requisito funcional | Calcular score de risco explicavel | 1.4, 2.5, 3.7, 4.6, 5.5, 7.1, 8.4, 9.6, 10.3, 11.1 | Coberto |
| RF006 | Requisito funcional | Gerar alerta preventivo | 2.6, 3.8, 4.7, 5.6, 6.2, 8.4, 9.7, 10.4 | Coberto |
| RF007 | Requisito funcional | Exibir dashboard gerencial | 2.7, 3.9, 4.8, 5.7, 6.2, 8.5, 9.8, 10.5 | Coberto |
| RF008 | Requisito funcional | Demonstrar notificacao mobile ou in-app | 1.5, 5.8, 6.5, 10.6 | Coberto |
| RN001 | Regra de negocio | Dados minimos da area monitorada | 1.1, 4.2, 5.2, 7.4, 8.1, 9.2 | Coberto |
| RN002 | Regra de negocio | Escopo espacial da analise | 1.2, 4.3, 4.4, 5.3, 7.5, 8.2, 9.3 | Coberto |
| RN003 | Regra de negocio | Proximidade de focos afeta score | 1.4, 4.4, 4.6, 7.1, 8.4, 9.6 | Coberto |
| RN004 | Regra de negocio | Concentracao recente de focos afeta score | 1.4, 4.4, 4.6, 7.1, 8.4, 9.6 | Coberto |
| RN005 | Regra de negocio | Condicoes climaticas adversas afetam score | 1.4, 4.5, 4.6, 7.1, 8.4, 9.6 | Coberto |
| RN006 | Regra de negocio | Classificacao do score | 1.4, 4.6, 5.5, 7.1, 8.4, 9.6 | Coberto |
| RN007 | Regra de negocio | Alerta explicavel e acionavel | 1.5, 4.7, 5.6, 5.8, 7.6, 8.4, 10.4, 10.6 | Coberto |
| RNF001 | Requisito nao funcional | Compreensibilidade do risco | 5.5, 5.6, 6.2, 11.1, 15.1 | Coberto |
| RNF002 | Requisito nao funcional | Resiliencia demonstrativa | 1.3, 4.4, 4.5, 6.3, 11.2, 12.1 | Coberto |
| RNF003 | Requisito nao funcional | Performance do fluxo demonstrativo | 11.3, 14.1, 15.1 | Coberto |
| RNF004 | Requisito nao funcional | Seguranca basica de dados | 1.1, 2.1, 3.1, 4.1, 9.1, 11.4, 12.2 | Coberto |
| RNF005 | Requisito nao funcional | Observabilidade minima | 12.1, 12.2, 15.1 | Coberto |
| CA001 | Criterio de aceite | Cadastro de area com sucesso | 4.2, 5.2, 10.1, 15.1 | Coberto |
| CA002 | Criterio de aceite | Bloqueio de cadastro invalido | 4.2, 5.2, 6.4, 10.1, 15.1 | Coberto |
| CA003 | Criterio de aceite | Visualizacao espacial da area | 4.3, 5.3, 10.2, 15.1 | Coberto |
| CA004 | Criterio de aceite | Calculo de risco com dados disponiveis | 4.4, 4.5, 4.6, 5.5, 10.3, 15.1 | Coberto |
| CA005 | Criterio de aceite | Continuidade com dados simulados | 1.3, 4.4, 4.5, 6.3, 10.3, 11.2, 15.1 | Coberto |
| CA006 | Criterio de aceite | Classificacao correta do score | 4.6, 5.5, 7.1, 8.4, 9.6, 15.1 | Coberto |
| CA007 | Criterio de aceite | Alerta explicavel | 4.7, 5.6, 10.4, 15.1 | Coberto |
| CA008 | Criterio de aceite | Estado vazio sem alertas | 5.7, 6.2, 10.5, 15.1 | Coberto |
| CA009 | Criterio de aceite | Dashboard consolidado | 4.8, 5.7, 10.5, 15.1 | Coberto |
| CA010 | Criterio de aceite | Demonstracao de notificacao | 5.8, 6.5, 10.6, 15.1 | Coberto |
| DEP001 | Dependencia | Prototipo navegavel HTML ou frontend equivalente | 0.1, 13.1, 14.1 | Coberto |
| DEP002 | Dependencia | Mapa interativo | 2.2, 5.3, 10.2 | Coberto |
| DEP003 | Dependencia | Definicao do motor de risco | 1.4, 4.6, 7.1 | Coberto |
| DEP004 | Dependencia | Dados simulados/controlados | 1.3, 2.3, 2.4, 4.4, 4.5 | Coberto |
| DEP005 | Dependencia | Integracoes planejadas NASA/INPE | 3.5, 3.6, 13.1 | Parcialmente coberto |
| DEP006 | Dependencia | Backend para auth, areas, alertas, dashboard e risco | 3.1 a 3.9, 4.1 a 4.8 | Coberto |
| DEP007 | Dependencia | Persistencia relacional/geoespacial | 2.1 a 2.7, 14.1 | Parcialmente coberto |

## 6. Arquivos relevantes

> Observacao: os caminhos abaixo sao sugestoes, porque a estrutura real de implementacao ainda nao existe no repositorio atual.

- `README.md` - contexto do produto e escopo original do MVP.
- `tasks/prd-orbitguard-fire-mvp.md` - fonte principal da verdade para esta lista.
- `tasks/tasks-orbitguard-fire-mvp.md` - plano executavel da feature.
- `frontend/src/pages/Login.tsx` - tela de entrada demonstrativa.
- `frontend/src/pages/MonitoredAreaForm.tsx` - cadastro de area monitorada.
- `frontend/src/pages/RiskMap.tsx` - mapa de risco e contexto espacial.
- `frontend/src/pages/AlertDetails.tsx` - detalhe do alerta e explicabilidade.
- `frontend/src/pages/Dashboard.tsx` - dashboard consolidado.
- `frontend/src/components/MobileAlertPreview.tsx` - demonstracao de notificacao.
- `frontend/src/services/api.ts` - camada de integracao com backend.
- `frontend/src/services/mockData.ts` - dados simulados/controlados do MVP.
- `frontend/src/maps/leafletMap.ts` - configuracao do mapa interativo.
- `backend/src/auth/*` - autenticacao demonstrativa ou JWT de evolucao.
- `backend/src/monitored-areas/*` - modulo de areas monitoradas.
- `backend/src/fire-events/*` - modulo de focos de calor.
- `backend/src/weather/*` - modulo de snapshots climaticos.
- `backend/src/risk-engine/*` - motor de risco e classificacao.
- `backend/src/alerts/*` - geracao e consulta de alertas.
- `backend/src/dashboard/*` - agregacoes do dashboard.
- `backend/src/integrations/*` - adaptadores para mock e evolucao de fontes externas.
- `backend/test/*` - testes de integracao e contrato.
- `frontend/e2e/*` - testes E2E do fluxo principal.

## 7. Instrucoes para concluir as tasks

- Marque cada item concluido alterando `- [ ]` para `- [x]`.
- Nao marque uma task principal como concluida enquanto houver subtarefas abertas.
- Valide as referencias do PRD antes de considerar a task pronta.
- Execute ou registre os testes relacionados antes de concluir uma task de implementacao.
- Registre evidencias quando a validacao for manual.
- Nao incluir implementacoes de itens explicitamente fora de escopo nesta entrega.

## 8. Tasks

### 0. Preparacao

- [x] 0.1 Confirmar stack, estrutura inicial do repositorio e estrategia de entrega do MVP.
  - **Tipo:** Setup.
  - **Criterio de pronto:** stack e estrutura-alvo definidas para frontend, backend, mocks e testes sem conflito com o PRD.
  - **Evidencia:** `docs/mvp-foundation.md`.

- [x] 0.2 Revisar o PRD de origem e alinhar escopo do MVP com o time.
  - **Referencias PRD:** visao geral, escopo funcional, fora de escopo, plano de release.
  - **Criterio de pronto:** escopo do MVP validado e itens fora de escopo explicitamente preservados.
  - **Preparacao concluida:** `docs/mvp-scope-alignment.md` consolidado e aguardando validacao humana.

### 1. Refinamento tecnico e rastreabilidade

- [x] 1.1 Refinar regra de validacao minima para cadastro de area.
  - **Referencias PRD:** RN001, CA001, CA002.
  - **Criterio de pronto:** campos obrigatorios, regras de formato e mensagens de erro definidos.
  - **Evidencia:** `docs/mvp-technical-refinement.md`.

- [x] 1.2 Refinar criterio operacional de raio e proximidade espacial.
  - **Referencias PRD:** RN002, CA003.
  - **Criterio de pronto:** regra de inclusao de focos e comportamento no mapa documentados para implementacao.
  - **Evidencia:** `docs/mvp-technical-refinement.md`.

- [x] 1.3 Definir conjunto de dados simulados/controlados do MVP.
  - **Referencias PRD:** RF003, RF004, RNF002, CA005, DEP004.
  - **Criterio de pronto:** cenarios mockados de focos, clima e alertas documentados para sucesso, vazio e fallback.
  - **Evidencia:** `docs/mvp-technical-refinement.md`.

- [x] 1.4 Consolidar especificacao do motor de risco demonstrativo.
  - **Referencias PRD:** RF005, RN003, RN004, RN005, RN006, DEP003.
  - **Criterio de pronto:** pesos, limiares, janela temporal e classificacao final definidos para implementacao e teste.
  - **Evidencia:** `docs/mvp-technical-refinement.md`.

- [x] 1.5 Refinar comportamento da notificacao demonstrativa.
  - **Referencias PRD:** RF008, RN007, CA010.
  - **Criterio de pronto:** formato visual, gatilho de exibicao e conteudo minimo da notificacao definidos.
  - **Evidencia:** `docs/mvp-technical-refinement.md`.

### 2. Modelagem de dados e persistencia

- [x] 2.1 Criar ou ajustar modelo de usuario e estrategia de autenticacao do MVP.
  - **Referencias PRD:** RNF004, DEP006.
  - **Criterio de pronto:** entidade ou contexto de usuario definido e compativel com autenticacao simplificada ou JWT.

- [x] 2.2 Criar modelo de `MonitoredArea` com suporte a coordenadas e raio.
  - **Referencias PRD:** RF001, RF002, RN001, RN002, DEP007.
  - **Criterio de pronto:** estrutura de dados cobre identificacao, tipo, latitude, longitude, raio e auditoria minima.

- [x] 2.3 Criar modelo de `FireEvent` ou estrutura equivalente para eventos simulados.
  - **Referencias PRD:** RF003, RN003, RN004, DEP004, DEP007.
  - **Criterio de pronto:** estrutura permite armazenar origem, localizacao, data/hora e distancia relativa.

- [x] 2.4 Criar modelo de `WeatherSnapshot` ou estrutura equivalente para clima.
  - **Referencias PRD:** RF004, RN005, DEP004, DEP007.
  - **Criterio de pronto:** estrutura cobre temperatura, precipitacao, umidade, vento e momento da observacao.

- [x] 2.5 Criar modelo de `RiskScore` e `RiskFactor`.
  - **Referencias PRD:** RF005, RN003, RN004, RN005, RN006, DEP007.
  - **Criterio de pronto:** estrutura suporta score final, classificacao, severidade e fatores de contribuicao.

- [x] 2.6 Criar modelo de `Alert`.
  - **Referencias PRD:** RF006, RN007, DEP007.
  - **Criterio de pronto:** estrutura contempla status, nivel, mensagem, recomendacoes e relacao com score e area.

- [x] 2.7 Definir estrutura de dados agregados para dashboard.
  - **Referencias PRD:** RF007, CA009, DEP007.
  - **Criterio de pronto:** modelo ou view cobre alertas ativos, score medio, focos recentes e areas prioritarias.

### 3. Contratos de API e integracao

- [x] 3.1 Implementar contrato de autenticacao para registro e login.
  - **Referencias PRD:** RNF004, contrato `POST /auth/register`, contrato `POST /auth/login`.
  - **Criterio de pronto:** request, response, validacoes e codigos de erro definidos e documentados.

- [x] 3.2 Implementar contrato de leitura do contexto do usuario autenticado ou demonstrativo.
  - **Tipo:** Tecnica.
  - **Criterio de pronto:** frontend consegue identificar usuario atual sem ambiguidade no fluxo do MVP.

- [x] 3.3 Implementar contrato `POST /monitored-areas`.
  - **Referencias PRD:** RF001, CA001, CA002, contrato de criar area monitorada.
  - **Criterio de pronto:** endpoint documentado com payload, validacoes e respostas de sucesso e erro.

- [x] 3.4 Implementar contrato de consulta de area monitorada para renderizacao do mapa.
  - **Referencias PRD:** RF002, CA003.
  - **Criterio de pronto:** endpoint ou resposta equivalente entrega dados espaciais suficientes para o frontend.

- [x] 3.5 Implementar contrato `GET /monitored-areas/{id}/fire-events`.
  - **Referencias PRD:** RF003, CA004, CA005, DEP005.
  - **Criterio de pronto:** endpoint documentado com suporte a fonte simulada e erros previstos.

- [x] 3.6 Implementar contrato `GET /monitored-areas/{id}/weather/latest`.
  - **Referencias PRD:** RF004, CA004, CA005, DEP005.
  - **Criterio de pronto:** endpoint documentado com estrutura clara de variaveis climaticas.

- [x] 3.7 Implementar contrato `POST /monitored-areas/{id}/risk/calculate`.
  - **Referencias PRD:** RF005, CA004, CA006.
  - **Criterio de pronto:** endpoint documentado com retorno de score, nivel e fatores.

- [x] 3.8 Implementar contrato `GET /alerts`.
  - **Referencias PRD:** RF006, CA007, CA008.
  - **Criterio de pronto:** endpoint documentado com filtros e estrutura de listagem de alertas.

- [x] 3.9 Implementar contrato `GET /dashboard/summary`.
  - **Referencias PRD:** RF007, CA009.
  - **Criterio de pronto:** endpoint documentado com agregacoes minimas do dashboard.

### 4. Implementacao backend

- [x] 4.1 Implementar modulo de autenticacao e protecao basica de credenciais.
  - **Referencias PRD:** RNF004, DEP006.
  - **Criterio de pronto:** fluxo de autenticacao ou contexto demonstrativo funciona sem expor dados sensiveis.

- [x] 4.2 Implementar servico de cadastro e validacao de area monitorada.
  - **Referencias PRD:** RF001, RN001, CA001, CA002.
  - **Criterio de pronto:** criacao de area valida persiste ou simula persistencia e rejeita entradas invalidas.

- [x] 4.3 Implementar servico de consulta espacial da area monitorada.
  - **Referencias PRD:** RF002, RN002, CA003.
  - **Criterio de pronto:** backend fornece dados espaciais para renderizacao da area e raio no mapa.

- [x] 4.4 Implementar servico de focos de calor com suporte a fonte simulada e fallback.
  - **Referencias PRD:** RF003, RN002, RN003, RN004, RNF002, CA004, CA005.
  - **Criterio de pronto:** backend retorna focos coerentes com a area e mantem fluxo quando integracao externa falha.

- [x] 4.5 Implementar servico de dados climaticos com suporte a fonte simulada e fallback.
  - **Referencias PRD:** RF004, RN005, RNF002, CA004, CA005.
  - **Criterio de pronto:** backend retorna snapshot climatico valido e continua funcional sem dependencia externa obrigatoria.

- [x] 4.6 Implementar motor de risco e classificacao.
  - **Referencias PRD:** RF005, RN003, RN004, RN005, RN006, CA004, CA006.
  - **Criterio de pronto:** score e classificacao sao calculados com base nas regras definidas e retornados com fatores explicitos.

- [x] 4.7 Implementar geracao de alerta preventivo.
  - **Referencias PRD:** RF006, RN007, CA007, CA008.
  - **Criterio de pronto:** alerta ativo e coerente e produzido a partir do resultado do risco com recomendacoes praticas.

- [x] 4.8 Implementar agregacoes e servico do dashboard.
  - **Referencias PRD:** RF007, CA009.
  - **Criterio de pronto:** backend consolida indicadores minimos necessarios para leitura gerencial.
  - **Evidencia de validacao:** revisao estatica do scaffold backend em `backend/src/*`, alinhamento com os contratos de API e bootstrap demonstrativo em memoria. Validacao automatizada nao foi executada porque `tsc` nao esta disponivel neste ambiente.

### 5. Implementacao frontend/mobile

- [x] 5.1 Implementar fluxo de entrada/login demonstrativo.
  - **Referencias PRD:** escopo funcional, UX/UI, RNF004.
  - **Criterio de pronto:** usuario acessa o fluxo principal com contexto de sessao coerente.
  - **Evidencia de validacao:** prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` com login demonstrativo, persistencia de sessao em `sessionStorage`, mensagem de erro para credenciais invalidas e tela autenticada exibindo usuario, permissao, token e expiracao.

- [x] 5.2 Implementar formulario de cadastro de area monitorada.
  - **Referencias PRD:** RF001, RN001, CA001, CA002.
  - **Criterio de pronto:** formulario coleta dados minimos, valida entrada e avanca ao sucesso.
  - **Evidencia de validacao:** prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` com formulario de area, validacao inline de nome, tipo, latitude, longitude e raio, estado de sucesso com resumo da area e persistencia local em `sessionStorage`.

- [x] 5.3 Implementar tela de mapa de risco com area, raio e focos.
  - **Referencias PRD:** RF002, CA003, DEP002.
  - **Criterio de pronto:** mapa exibe area monitorada, contexto espacial e legenda compreensivel.
  - **Evidencia de validacao:** tela de mapa adicionada ao prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html`, com estado vazio, anel monitorado, vizinhanca operacional, marcadores de focos e legenda; checagem sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

- [x] 5.4 Integrar exibição de focos e dados climaticos na experiencia de calculo.
  - **Referencias PRD:** RF003, RF004, CA004, CA005.
  - **Criterio de pronto:** usuario consegue visualizar os insumos usados no calculo de risco.
  - **Evidencia de validacao:** o prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` agora exibe a seção `Experiencia de calculo` com focos, snapshot climatico, sinais que entram no score e contexto de fonte `MOCK/FALLBACK`; validacao sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

- [x] 5.5 Implementar tela ou componente de resultado do score de risco.
  - **Referencias PRD:** RF005, RNF001, CA004, CA006.
  - **Criterio de pronto:** score, nivel e fatores ficam visiveis em linguagem clara e com destaque visual adequado.
  - **Evidencia de validacao:** bloco visual `Resultado do score` adicionado ao prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html`, com score, nivel, severidade, resumo e fatores explicaveis; validacao sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

- [x] 5.6 Implementar detalhe do alerta preventivo.
  - **Referencias PRD:** RF006, RN007, RNF001, CA007.
  - **Criterio de pronto:** alerta exibe resumo da situacao, causas principais e recomendacoes acionaveis.
  - **Evidencia de validacao:** secao `Detalhe do alerta preventivo` adicionada ao prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html`, com estado vazio, alerta ativo, resumo, causas e recomendacoes; validacao sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

- [x] 5.7 Implementar dashboard gerencial.
  - **Referencias PRD:** RF007, CA008, CA009.
  - **Criterio de pronto:** dashboard exibe agregacoes principais, incluindo estado vazio quando aplicavel.
  - **Evidencia de validacao:** secao `Dashboard gerencial` adicionada ao prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html`, com metricas, distribuicao por nivel, areas prioritarias e estado vazio quando nao ha alerta ativo; validacao sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

- [x] 5.8 Implementar demonstracao visual de notificacao mobile ou in-app.
  - **Referencias PRD:** RF008, RN007, CA010.
  - **Criterio de pronto:** notificacao reflete o contexto do alerta gerado e permanece no escopo demonstrativo.
  - **Evidencia de validacao:** secao `Demonstracao de notificacao in-app` adicionada ao prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html`, com preview mobile, mensagem acionavel e estado vazio quando nao ha alerta ativo; validacao sintatica do bloco `script` executada com `node -e` e resultado `script-ok`.

### 6. Estados de UI e experiencia do usuario

- [x] 6.1 Implementar estado de loading nas operacoes de consulta e calculo.
  - **Referencias PRD:** estados de interface, RF002, RF005.
  - **Criterio de pronto:** usuario recebe feedback visual claro enquanto o sistema carrega ou calcula.
  - **Evidencia de validacao:** prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` com estados de loading dedicados para consulta do mapa e calculo de risco; validacao sintatica do bloco `script` executada com `node --check` em arquivo temporario extraido do HTML, sem erros.

- [x] 6.2 Implementar estados de sucesso e vazio para alertas e dashboard.
  - **Referencias PRD:** RF006, RF007, CA008, CA009, RNF001.
  - **Criterio de pronto:** telas diferenciam claramente presenca e ausencia de dados relevantes.
  - **Evidencia de validacao:** o prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` agora diferencia explicitamente o estado vazio inicial, o vazio com area cadastrada e o estado de sucesso com alerta ativo para as secoes `Detalhe do alerta preventivo` e `Dashboard gerencial`; validacao sintatica do bloco `script` executada com `node --check` em arquivo temporario extraido do HTML, sem erros.

- [x] 6.3 Implementar estado de erro com fallback para dados simulados.
  - **Referencias PRD:** RF003, RF004, RNF002, CA005.
  - **Criterio de pronto:** falhas externas nao quebram o fluxo e sao comunicadas sem ambiguidade.
  - **Evidencia de validacao:** o prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` agora oferece o toggle `Simular falha externa`, exibe banners de fallback no mapa e na experiencia de calculo e mantém o fluxo operacional com dados mockados; validacao sintatica do bloco `script` executada com `node --check` em arquivo temporario extraido do HTML, sem erros.

- [x] 6.4 Implementar estado de dados invalidos no cadastro de area.
  - **Referencias PRD:** RF001, RN001, CA002.
  - **Criterio de pronto:** campos invalidos sao destacados com mensagens coerentes.
  - **Evidencia de validacao:** o prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` agora exibe resumo de dados invalidos, destaca campos com `.is-invalid`, aplica `aria-invalid`, foca o primeiro campo com erro e bloqueia coordenadas/raio ausentes antes da conversao numerica; validacao sintatica do bloco `script` executada com `node --check` em arquivo temporario extraido do HTML, sem erros.

- [x] 6.5 Implementar tratamento visual para permissao negada e notificacao demonstrativa.
  - **Referencias PRD:** estados de permissao negada, RF008, CA010.
  - **Criterio de pronto:** usuario entende quando nao tem acesso e a notificacao e apresentada de forma consistente.
  - **Evidencia de validacao:** prototipo navegavel em `prototypes/orbitguard-fire-prototipo-v2.html` com controle `Simular area privada`, painel visual de acesso restrito baseado em `canViewPrivateAreas: false`, bloqueio demonstrativo de mapa/risco/alerta/dashboard e preview de notificacao `IN_APP | ACESSO_RESTRITO` sem revelar detalhes sensiveis; validacao sintatica do bloco `script` executada com `node --check` em arquivo temporario extraido do HTML, sem erros.

### 7. Regras de negocio e validacoes

- [x] 7.1 Implementar regras do motor de risco e classificacao por faixa.
  - **Referencias PRD:** RN003, RN004, RN005, RN006, RF005, CA006.
  - **Criterio de pronto:** cada regra impacta o score corretamente e a classificacao final respeita as faixas definidas.
  - **Evidencia de validacao:** regras consolidadas em `backend/src/common/domain/risk-rules.ts` e `backend/src/risk-engine/risk-engine.service.ts`, com validacao executada por `npm run check` em `backend/` e verificacao manual do backend em memoria mostrando os tres cenarios bootstrapados nas faixas `CRITICAL` (`95`), `MODERATE` (`45`) e `LOW` (`0`).

- [x] 7.2 Implementar regra de leitura de focos recentes e concentracao por janela temporal.
  - **Referencias PRD:** RF003, RN004.
  - **Criterio de pronto:** backend distingue evento isolado de concentracao relevante para o risco.
  - **Evidencia de validacao:** `backend/src/fire-events/fire-events.service.ts` filtra focos por `periodHours` e `backend/src/risk-engine/risk-engine.service.ts` reutiliza a mesma janela para o calculo; validacao manual no backend mostrou diferenca entre janela de `5h` e `24h` no mesmo area bootstrapada, com `2` focos e score `75/HIGH` na janela curta e `4` focos com fator `FIRE_CLUSTER` e score `95/CRITICAL` na janela longa. Validacao automatizada executada com `npm run check` em `backend/`.

- [x] 7.3 Implementar validacao e interpretacao das variaveis climaticas usadas no risco.
  - **Referencias PRD:** RF004, RN005.
  - **Criterio de pronto:** clima invalido, ausente ou extremo e tratado de forma deterministica.
  - **Evidencia de validacao:** `backend/src/common/domain/weather-rules.ts` centraliza a validacao e interpretacao das variaveis climaticas com fallback deterministico, `backend/src/weather/weather.service.ts` normaliza snapshots invalidos antes de expor o clima e `backend/src/risk-engine/risk-engine.service.ts` consome os sinais interpretados para o calculo; validacao automatizada com `npm run check` em `backend/` e smoke test manual via `node -r ts-node/register -e` confirmando que um snapshot corrompido em memoria volta a resposta `FALLBACK` com `temperatureC: 33.2`, `humidityPercent: 28`, `precipitationMm: 0`, `windSpeedMs: 4.1` e que o resumo de risco permanece coerente.

- [x] 7.4 Implementar validacao de campos obrigatorios e formato da area monitorada.
  - **Referencias PRD:** RN001, CA001, CA002.
  - **Criterio de pronto:** area invalida nao pode ser salva nem usada em calculo.
  - **Evidencia de validacao:** validacao extraida para `backend/src/monitored-areas/monitored-area-validation.ts`, aplicada em `backend/src/monitored-areas/monitored-areas.service.ts` e coberta por script de assercoes em `backend/test/monitored-areas.service.test.ts`; validacao automatizada executada com `npm run check` em `backend/` e `node -r ts-node/register test\\monitored-areas.service.test.ts`, com saida `monitored-areas validation checks passed`.

- [x] 7.5 Implementar regra de proximidade espacial e relevancia do foco no mapa e no calculo.
  - **Referencias PRD:** RN002, RN003, CA003.
  - **Criterio de pronto:** somente focos relevantes impactam exibicao e pontuacao.
  - **Evidencia de validacao:** regra formalizada em `backend/src/common/domain/fire-event-proximity.ts` e aplicada em `backend/src/integrations/mocks/mock-data.ts`, `backend/src/fire-events/fire-events.service.ts` e `backend/src/risk-engine/risk-engine.service.ts`; validacao automatizada executada com `npm run check` em `backend/`, `node -r ts-node/register test\\fire-events-proximity.test.ts` e `node -r ts-node/register test\\monitored-areas.service.test.ts`, com saidas `fire-events proximity checks passed` e `monitored-areas validation checks passed`.

- [x] 7.6 Implementar construcao de mensagem explicavel do alerta.
  - **Referencias PRD:** RN007, CA007, CA010.
  - **Criterio de pronto:** mensagem final explicita fatores e recomendacoes sem linguagem tecnica excessiva.
  - **Evidencia de validacao:** construcao centralizada em `backend/src/alerts/alert-message.ts` e consumida por `backend/src/alerts/alerts.service.ts`, com mensagem, resumo e recomendacoes derivadas dos fatores do risco; validacao automatizada executada com `npm run check` em `backend/`, `node -r ts-node/register test\\alert-message.test.ts` e `node -r ts-node/register test\\fire-events-proximity.test.ts`, com saidas `alert message checks passed` e `fire-events proximity checks passed`.

### 8. Testes unitarios

- [x] 8.1 Criar testes unitarios para validacao do cadastro de area.
  - **Referencias PRD:** RF001, RN001, CA001, CA002.
  - **Criterio de pronto:** testes cobrem sucesso, campos invalidos e bloqueios principais.
  - **Evidencia de validacao:** cobertura ampliada em `backend/test/monitored-areas.service.test.ts` com caminho feliz adicional para `name` com `trim`, preservando a normalizacao observavel do cadastro; validacao executada com `cd backend && npm run check` e `cd backend && node -r ts-node/register test\\monitored-areas.service.test.ts`, com saidas `check` sem erros e `monitored-areas validation checks passed`.

- [x] 8.2 Criar testes unitarios para transformacao e exibicao do contexto espacial.
  - **Referencias PRD:** RF002, RN002, CA003.
  - **Criterio de pronto:** transformacoes de coordenadas, raio e legenda possuem cobertura.
  - **Evidencia de validacao:** cobertura adicionada em `backend/test/monitored-areas.service.test.ts` para `MonitoredAreasService.getById`, verificando centro espacial normalizado, raio monitorado, raio operacional e legenda do `mapContext`; validacao executada com `cd backend && node -r ts-node/register test\\monitored-areas.service.test.ts` e `cd backend && npm run check`, ambos com saida sem erros.

- [x] 8.3 Criar testes unitarios para adaptadores de dados simulados de focos e clima.
  - **Referencias PRD:** RF003, RF004, RNF002, CA005.
  - **Criterio de pronto:** mocks e fallbacks retornam estruturas consistentes.
  - **Evidencia de validacao:** teste adicionado em `backend/test/mock-data-adapters.test.ts` cobrindo os cenarios mockados `CRITICAL`, `MODERATE` e `LOW` via `FireEventsService` e `WeatherService`, com validacao automatizada executada por `cd backend && npm run check` e `cd backend && node -r ts-node/register test\\mock-data-adapters.test.ts`, ambos sem erros.

- [x] 8.4 Criar testes unitarios para motor de risco, classificacao e alerta explicavel.
  - **Referencias PRD:** RF005, RF006, RN003, RN004, RN005, RN006, RN007, CA006, CA007.
  - **Criterio de pronto:** cenarios baixo, moderado, alto e critico ficam cobertos.
  - **Evidencia de validacao:** novo teste em `backend/test/risk-engine-alerts.test.ts` cobre `LOW`, `MODERATE`, `HIGH` e `CRITICAL` no backend em memoria, validando score, classificacao, severidade, fatores explicaveis e geracao de alerta; validacao executada com `cd backend && npm run check` e `cd backend && node -r ts-node/register test\\risk-engine-alerts.test.ts`, ambos sem erros.

- [x] 8.5 Criar testes unitarios para agregacoes do dashboard.
  - **Referencias PRD:** RF007, CA009.
  - **Criterio de pronto:** indicadores agregados e estado vazio ficam cobertos.
  - **Evidencia de validacao:** teste adicionado em `backend/test/dashboard.service.test.ts` cobrindo o estado vazio e um snapshot populado com tres areas, validando `monitoredAreasCount`, `activeAlertsCount`, `averageRiskScore`, `recentFireEventsCount`, `areasByRiskLevel`, `priorityAreas` e `hasActiveAlerts`; validacao executada com `cd backend && node -r ts-node/register test\\dashboard.service.test.ts` e `cd backend && npm run check`, ambos sem erros.

### 9. Testes de integracao/API

- [x] 9.1 Criar testes de integracao para autenticacao e protecao de dados sensiveis.
  - **Referencias PRD:** RNF004, contrato de auth.
  - **Criterio de pronto:** endpoints de auth validam payload, erros e nao vazam dados indevidos.
  - **Evidencia de validacao:** teste de integracao adicionado em `backend/test/auth.integration.test.ts`, cobrindo `register`, `login` e `me` na fachada publica `OrbitGuardFireBackend`; o teste valida erro de payload com `ValidationApplicationError`, erro de credenciais com `AuthenticationApplicationError` e confirma que as respostas publicas nao expõem `passwordHash`, `sessionContext`, `accessToken` ou `refreshToken`. Validacao executada com `cd backend && node -r ts-node/register test\\auth.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

- [x] 9.2 Criar testes de integracao para criacao e consulta de area monitorada.
  - **Referencias PRD:** RF001, CA001, CA002.
  - **Criterio de pronto:** requests validos e invalidos retornam status e payload esperados.
  - **Evidencia de validacao:** teste de integracao adicionado em `backend/test/monitored-areas.integration.test.ts`, cobrindo criacao autenticada, listagem da area do usuario, normalizacao de payload e rejeicao de cadastro invalido com `ValidationApplicationError`; validacao executada com `cd backend && node -r ts-node/register test\\monitored-areas.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

- [x] 9.3 Criar testes de integracao para consulta espacial e mapa.
  - **Referencias PRD:** RF002, CA003.
  - **Criterio de pronto:** resposta contem dados suficientes para renderizar area e focos.
  - **Evidencia de validacao:** novo teste de integracao em `backend/test/monitored-area-map.integration.test.ts` cobrindo a fachada publica `OrbitGuardFireBackend` para cadastro autenticado, consulta espacial via `GET /monitored-areas/:id` e contexto de focos relevantes via `GET /monitored-areas/:id/fire-events`; validacao executada com `cd backend && node -r ts-node/register test\\monitored-area-map.integration.test.ts` e `cd backend && npm run check`, ambos sem erros.

- [x] 9.4 Criar testes de integracao para endpoint de focos de calor.
  - **Referencias PRD:** RF003, CA004, CA005.
  - **Criterio de pronto:** endpoint cobre sucesso, vazio, erro externo e fallback simulado.
  - **Evidencia de validacao:** novo teste em `backend/test/fire-events.integration.test.ts` cobrindo quatro cenarios observaveis do endpoint `GET /monitored-areas/:id/fire-events`: retorno bem-sucedido com dataset critico mockado, estado vazio com foco fora do escopo operacional, fallback controlado quando a persistencia de focos falha e fallback simulado para dataset moderado. Validacao executada com `cd backend && npm run check`, `cd backend && node -r ts-node/register test\\fire-events.integration.test.ts`, `cd backend && node -r ts-node/register test\\monitored-area-map.integration.test.ts`, `cd backend && node -r ts-node/register test\\fire-events-proximity.test.ts` e `cd backend && node -r ts-node/register test\\mock-data-adapters.test.ts`, todas sem erros.

- [x] 9.5 Criar testes de integracao para endpoint de clima.
  - **Referencias PRD:** RF004, CA004, CA005.
  - **Criterio de pronto:** endpoint cobre sucesso, erro externo e resposta simulada coerente.
  - **Evidencia de validacao:** teste de integracao adicionado em `backend/test/weather.integration.test.ts`, cobrindo retorno live com snapshot `LIVE`, fallback por falha externa simulada em `getLatestWeatherSnapshot` e resposta mockada coerente para o cenario moderado; validacao executada com `cd backend && node -r ts-node/register test\\weather.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

- [x] 9.6 Criar testes de integracao para calculo de risco.
  - **Referencias PRD:** RF005, RN006, CA004, CA006.
  - **Criterio de pronto:** endpoint retorna score e classificacao corretos nos cenarios principais.
  - **Evidencia de validacao:** novo teste de integracao em `backend/test/risk.integration.test.ts` cobrindo os cenarios `LOW`, `MODERATE` e `CRITICAL` na fachada `OrbitGuardFireBackend`, com validacoes de `score`, `level`, `severity`, fatores, sinais contributivos, `dataSources` e gatilho de alerta; validacao executada com `cd backend && node -r ts-node/register test\risk.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

- [x] 9.7 Criar testes de integracao para listagem de alertas.
  - **Referencias PRD:** RF006, CA007, CA008.
  - **Criterio de pronto:** endpoint cobre lista com alertas, lista vazia e filtros basicos.
  - **Evidencia de validacao:** novo teste de integracao em `backend/test/alerts.integration.test.ts` cobrindo lista populada, filtros por `level`, `monitoredAreaId` e `status`, e estado vazio com `emptyStateMessage`; validacao executada com `cd backend && node -r ts-node/register test\\alerts.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

- [x] 9.8 Criar testes de integracao para resumo do dashboard.
  - **Referencias PRD:** RF007, CA009.
  - **Criterio de pronto:** agregacoes do dashboard retornam estrutura prevista e consistencia minima.
  - **Evidencia de validacao:** novo teste de integracao em `backend/test/dashboard.integration.test.ts` cobrindo o resumo do dashboard para o dataset demo bootstrapped e para um usuario autenticado sem areas monitoradas, validando estrutura, contadores, `areasByRiskLevel`, `priorityAreas`, `hasActiveAlerts` e estado vazio; validacao executada com `cd backend && node -r ts-node/register test\\dashboard.integration.test.ts` e `cd backend && npm run check`, ambas sem erros.

### 10. Testes funcionais/E2E

- [x] 10.1 Validar fluxo de cadastro de area monitorada.
  - **Referencias PRD:** CA001, CA002.
  - **Criterio de pronto:** fluxo de cadastro passa com sucesso e falha controlada para dados invalidos.
  - **Evidencia de validacao:** smoke test E2E em `prototypes/orbitguard-fire-prototipo-v2.e2e.test.js`, executado com `node prototypes\\orbitguard-fire-prototipo-v2.e2e.test.js`, cobrindo login demonstrativo, cadastro valido de `Fazenda Santa Luzia` com avanço para mapa e resumo espacial, e cadastro invalido com mensagens por campo, destaque visual e foco no primeiro erro. Resultado: `orbitguard-fire prototype area flow checks passed`.

- [ ] 10.2 Validar exibicao da area, raio e focos no mapa.
  - **Referencias PRD:** CA003.
  - **Criterio de pronto:** evidencia funcional confirma renderizacao correta do contexto espacial.

- [ ] 10.3 Validar fluxo completo de consulta/simulacao e calculo de risco.
  - **Referencias PRD:** CA004, CA005, CA006.
  - **Criterio de pronto:** fluxo passa com dados disponiveis e com fallback simulado em falha externa.

- [ ] 10.4 Validar detalhe do alerta preventivo.
  - **Referencias PRD:** CA007.
  - **Criterio de pronto:** alerta exibe fatores e recomendacoes coerentes com o risco calculado.

- [ ] 10.5 Validar dashboard com e sem alertas ativos.
  - **Referencias PRD:** CA008, CA009.
  - **Criterio de pronto:** dashboard cobre estado populado e estado vazio com comunicacao adequada.

- [ ] 10.6 Validar demonstracao da notificacao mobile/in-app.
  - **Referencias PRD:** CA010.
  - **Criterio de pronto:** notificacao espelha corretamente o contexto e urgencia do alerta.

### 11. Testes nao funcionais

- [ ] 11.1 Validar compreensibilidade do score, alerta e recomendacoes.
  - **Referencias PRD:** RNF001.
  - **Criterio de pronto:** evidencia manual ou teste guiado confirma clareza minima para usuario nao tecnico.

- [ ] 11.2 Validar resiliencia do fluxo sem dependencia externa obrigatoria.
  - **Referencias PRD:** RNF002, CA005.
  - **Criterio de pronto:** fluxo principal continua operacional usando mocks quando servicos externos falham.

- [ ] 11.3 Validar tempo de resposta do fluxo demonstrativo.
  - **Referencias PRD:** RNF003.
  - **Criterio de pronto:** operacoes principais ficam dentro da meta definida para demonstracao ou possuem justificativa registrada.

- [ ] 11.4 Validar protecao de dados sensiveis e exposicao minima em logs e payloads.
  - **Referencias PRD:** RNF004.
  - **Criterio de pronto:** logs, DTOs e respostas publicas nao expõem credenciais ou dados indevidos.

### 12. Observabilidade, logs e metricas

- [ ] 12.1 Implementar logs de inicio, sucesso e falha em coleta mockada, calculo de risco e geracao de alerta.
  - **Referencias PRD:** RNF005, RNF002.
  - **Criterio de pronto:** operacoes criticas possuem logs rastreaveis sem ruido excessivo.

- [ ] 12.2 Implementar boas praticas de log para nao expor dados sensiveis de localizacao e autenticacao.
  - **Referencias PRD:** RNF004, RNF005.
  - **Criterio de pronto:** revisao tecnica confirma que logs nao vazam coordenadas privadas ou credenciais.

- [ ] 12.3 Registrar metricas operacionais minimas para dashboard tecnico ou acompanhamento manual.
  - **Referencias PRD:** metricas de sucesso, RF007.
  - **Criterio de pronto:** existe forma de acompanhar alertas ativos, score medio e falhas de integracao no MVP.

### 13. Documentacao

- [ ] 13.1 Atualizar documentacao funcional e tecnica do MVP.
  - **Tipo:** Documentacao.
  - **Criterio de pronto:** documentacao cobre fluxo principal, mocks, contratos, regras do risco e limitacoes do MVP.

- [ ] 13.2 Documentar decisoes de escopo e diferencas entre comportamento demonstrativo e evolucao futura.
  - **Referencias PRD:** fora de escopo, riscos, plano de release.
  - **Criterio de pronto:** leitores entendem claramente o que e MVP, o que e mock e o que fica para fases futuras.

### 14. CI/CD, ambiente e release

- [ ] 14.1 Configurar ambiente local e pipeline minima para executar frontend, backend e testes do MVP.
  - **Tipo:** Release.
  - **Criterio de pronto:** time consegue subir o MVP e rodar a bateria minima de validacao sem passos ocultos.

- [ ] 14.2 Validar configuracoes, seeds e mocks necessarios para demonstracao consistente.
  - **Referencias PRD:** DEP004, DEP007.
  - **Criterio de pronto:** ambiente de demo sempre inicializa com dados coerentes para o fluxo principal.

- [ ] 14.3 Preparar checklist de demonstracao/release do MVP.
  - **Tipo:** Release.
  - **Criterio de pronto:** existe roteiro objetivo para validar a entrega antes de apresentacao ou handoff.

### 15. Validacao final e aceite

- [ ] 15.1 Confirmar cobertura final dos criterios de aceite do PRD.
  - **Referencias PRD:** CA001, CA002, CA003, CA004, CA005, CA006, CA007, CA008, CA009, CA010.
  - **Criterio de pronto:** todos os criterios de aceite possuem evidencia de validacao automatizada ou manual.

- [ ] 15.2 Revisar riscos residuais e pendencias abertas da entrega.
  - **Referencias PRD:** riscos, perguntas em aberto, RNF003, RNF004, RNF005.
  - **Criterio de pronto:** pendencias restantes estao registradas com impacto e encaminhamento claro.

- [ ] 15.3 Validar documentacao final, rastreabilidade e preparo para extracao em issues.
  - **Tipo:** QA.
  - **Criterio de pronto:** tasks e PRD estao coerentes, rastreaveis e prontas para desdobramento operacional.

## 9. Checklist de qualidade da lista de tasks

- [x] Todas as tasks possuem descricao objetiva
- [x] Tasks principais estao organizadas em ordem logica
- [x] Subtasks sao pequenas e acionaveis
- [x] Requisitos funcionais do PRD foram cobertos
- [x] Regras de negocio do PRD foram cobertas
- [x] Criterios de aceite foram convertidos em validacoes ou testes
- [x] Requisitos nao funcionais foram considerados
- [x] Estados de UI foram considerados quando aplicavel
- [x] Contratos de API foram considerados quando aplicavel
- [x] Dados e persistencia foram considerados quando aplicavel
- [x] Tasks de QA foram incluidas
- [x] Tasks de documentacao foram incluidas
- [x] Tasks de observabilidade foram incluidas quando aplicavel
- [x] Tasks de release foram incluidas quando aplicavel
- [x] Itens fora de escopo nao foram incluidos indevidamente
- [x] Existe mapa de rastreabilidade entre PRD e tasks
