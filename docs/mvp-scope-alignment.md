# OrbitGuard Fire MVP Scope Alignment

**Status:** Consolidado para alinhamento e aguardando validacao humana  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `tasks/tasks-orbitguard-fire-mvp.md`

## 1. Objetivo deste alinhamento

Consolidar o escopo executavel do MVP a partir da visao geral, escopo funcional, fora de escopo e plano de release do PRD, deixando explicito o que entra agora, o que fica preservado fora de escopo e o que depende de decisao humana do time.

## 2. Escopo fechado para a Fase 1 do MVP

O incremento atual deve entregar um fluxo demonstrativo ponta a ponta, navegavel e explicavel, cobrindo:

- entrada/login demonstrativo para acessar o fluxo principal;
- cadastro de area monitorada com nome, tipo, coordenadas e raio;
- visualizacao da area no mapa com contexto espacial e legenda;
- uso de focos de calor simulados ou vindos de adaptador com fallback local;
- uso de variaveis climaticas relevantes com fallback local;
- calculo de score de risco de `0` a `100` com fatores explicitos;
- classificacao do risco em faixas predefinidas;
- geracao de alerta preventivo com resumo, causas e recomendacoes;
- dashboard consolidado com indicadores minimos;
- demonstracao visual de notificacao mobile ou in-app;
- estados de loading, sucesso, vazio, erro e dados invalidos no fluxo principal.

## 3. Preservacao explicita do fora de escopo

Os itens abaixo permanecem fora desta entrega e nao devem ser puxados para o incremento atual:

- operacao produtiva com SLA real;
- integracao obrigatoria e estavel com todas as APIs externas;
- aplicacao mobile nativa;
- envio real de notificacoes por WhatsApp, SMS ou e-mail;
- modelos preditivos de machine learning;
- gestao completa multi-tenant com perfis avancados de autorizacao;
- ingestao historica em larga escala;
- relatorios ESG, integracao com sensores locais ou Defesa Civil.

## 4. Leitura consolidada do plano de release

### Entra agora na Fase 1

- fluxo navegavel ponta a ponta;
- cadastro de area;
- mapa com focos simulados ou controlados;
- score de risco explicavel;
- alerta preventivo;
- dashboard estatico ou semi-dinamico;
- demonstracao de notificacao.

### Fica adiado para a Fase 2

- implementacao definitiva de frontend em React seguindo a baseline do projeto;
- backend NestJS com contratos principais;
- persistencia relacional e geoespacial com PostgreSQL e PostGIS;
- autenticacao JWT;
- historico persistido de risco e alertas.

### Fica adiado para a Fase 3

- integracoes reais com NASA FIRMS, NASA POWER e INPE BDQueimadas;
- jobs de ingestao periodica;
- notificacoes reais;
- ajuste de regras por tipo de area;
- app mobile e capacidades preditivas.

## 5. Decisoes de escopo para destravar a implementacao

- O MVP continua demonstrativo, nao operacional, e isso deve ficar claro em interface e documentacao.
- O login inicial pode ser simplificado, desde que a arquitetura nao inviabilize JWT depois.
- Mock e fallback deixam de ser contingencia e passam a ser parte oficial do comportamento esperado no MVP.
- O motor de risco sera deterministico, explicavel e baseado em regras do PRD, sem qualquer leitura de previsao real.
- O dashboard pode nascer com agregacoes derivadas de base controlada, desde que seja coerente com o fluxo principal.
- A camada geoespacial pode comecar simplificada, com calculo de distancia e representacao de raio, sem depender de PostGIS no primeiro incremento funcional.

## 6. Vinculo entre PRD e escopo validado para implementacao

### Visao geral e escopo funcional

O PRD exige um fluxo que cadastra area, exibe mapa, consulta ou simula focos e clima, calcula risco, gera alerta e exibe dashboard. Esse fluxo foi mantido integralmente como centro do MVP.

### Fora de escopo

Todos os itens de nao objetivo do PRD foram preservados sem reinterpretacao. Nada neste alinhamento transforma essas frentes em obrigatorias para o primeiro incremento.

### Plano de release

O MVP continua aderente a uma leitura incremental:

- Fase 1 valida o fluxo demonstrativo.
- Fase 2 endurece arquitetura, APIs, banco e autenticacao.
- Fase 3 adiciona integracoes reais e capacidades operacionais.

## 7. Pendencias que ainda exigem validacao do time

- Confirmar se o primeiro incremento precisa subir banco local desde o dia 1 ou se pode iniciar com persistencia reduzida e seed controlado.
- Confirmar a janela temporal padrao para considerar focos recentes no calculo de risco.
- Confirmar a lista inicial de tipos de area suportados no cadastro.
- Confirmar se o estado de permissao negada entra no primeiro fluxo navegavel ou fica apenas preparado para iteracao seguinte.
- Confirmar o nivel minimo de historico persistido necessario para o dashboard da demo.

## 8. Resultado desta task

O escopo do MVP esta consolidado em documento e os itens fora de escopo estao explicitamente preservados, atendendo a parte documental da task `0.2`.

A marcacao da task no checklist deve continuar dependente da validacao humana do time sobre as pendencias listadas acima.
