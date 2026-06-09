# OrbitGuard Fire MVP UI Language Audit

**Status:** Concluido para a task 1.2  
**Data:** 2026-06-07  
**Referencia:** `tasks/tasks-melhoria-frontend-ui-jornada.md`, `docs/mvp-ui-surface-map.md`, `prototypes/orbitguard-fire-prototipo-v2.html`, `prototypes/orbitguard-fire-prototipo-v2.js`

## 1. Objetivo

Registrar, por superficie do prototipo demonstrativo, os textos, rotulos e chips que expõem linguagem tecnica interna ou termos de implementacao que precisam ser simplificados nas proximas subtasks da jornada de UI.

## 2. Criterio do inventario

Foram considerados como ruido tecnico os elementos visiveis ao usuario que mencionam:

- mocks, fallback ou fonte externa;
- token, session, provider ou payload;
- status e siglas de implementacao;
- nome de contrato, endpoint ou detalhe interno;
- referencias a demo, seed, debug ou cenario tecnico quando aparecem como texto principal da interface.

## 3. Inventario por superficie

### 3.1 Entrada / login demonstrativo

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| demo pill | `MVP demonstrativo | auth demo + session context` | terminologia tecnica interna | Junta abreviacoes de implementacao com o contexto de sessao. |
| resumo de contexto | `Usuario demo` | rotulo de demo | Pode ser simplificado para leitura de usuario final. |
| resumo de contexto | `Provider` | termo tecnico | Termo em ingles que expõe detalhe de autenticacao. |
| resumo de contexto | `Bearer token + expiry` | contrato interno | Mostra formato tecnico de sessao ao usuario final. |
| helper de acesso | `Preencher acesso demo` | demo explicita | Pode virar acao operacional mais curta. |
| helper de credenciais | `demo email: ...` | credencial tecnica | Expõe dado de teste como texto de apoio. |
| helper de credenciais | `demo senha: ...` | credencial tecnica | Expõe dado de teste como texto de apoio. |
| helper de credenciais | `auth mode: DEMO` | modo tecnico | Pode ser trocado por linguagem de uso. |
| banner de erro | `Credenciais demo preenchidas...` | demo interna | Frase de apoio ainda marcada como teste. |
| banner de sucesso | `Autenticacao demonstrativa concluida...` | termo tecnico | Reforca o modo demonstrativo em vez do uso real. |
| card de permissao | `403 demonstrativo` | status tecnico | Mostra codigo de resposta HTTP para o usuario. |
| navegacao do fluxo | `Sessao A`, `Sessao B`, `Sessao C` | estrutura interna | Indica etapas por letra, nao por acao do usuario. |
| mini card | `Access token` | contrato interno | Exibe dado tecnico de autenticacao. |

### 3.2 Cadastro de area monitorada

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| descricao da secao | `Os campos abaixo seguem as regras do contrato...` | referencia contratual | Reforca contrato tecnico em vez da acao do usuario. |
| descricao do card | `Registre uma area para habilitar a leitura espacial do MVP.` | linguagem de MVP | Mantem foco no prototipo, nao no beneficio do usuario. |
| helper de validacao | `lat` / `long` / `radius` explicados como regra | detalhe de implementacao | Pode ser reduzido em copy final. |
| estado de apoio | `Cadastro com ajustes pendentes` | status tecnico | Expressa estado de fluxo interno. |

### 3.3 Mapa de risco

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| loading | `O mapa demonstrativo aparece em seguida...` | demo interna | Mantem linguagem de prototipo. |
| banner fallback | `Falha externa simulada no mapa` | fallback tecnico | Expõe mecanismo interno ao usuario. |
| banner fallback | `dados mockados coerentes` | mock tecnico | Conecta o estado visual ao mecanismo de teste. |
| banner fallback chips | `MOCK` | fonte interna | Chip tecnico visivel ao usuario. |
| banner fallback chips | `FALLBACK ATIVO` | estado tecnico | Explica o mecanismo de contingencia. |
| status do mapa | `Consultando mapa ... com fallback local` | fallback tecnico | Mostra detalhe de implementacao no status principal. |
| contexto espacial | `Raio monitorado de ... com vizinhanca operacional` | termo operacional | Nao e erro, mas ainda carrega linguagem tecnica densa. |
| fonte de dados | `Fonte: fallback local` | origem tecnica | Exibe mecanismo de contingencia em texto principal. |
| fonte de dados | `Fonte: mock controlado` | origem tecnica | Expõe a natureza dos dados de demo. |
| referencias no texto | `NASA FIRMS` / `NASA POWER` | fonte tecnica externa | Termos uteis em contexto tecnico, mas ruidosos para usuario final. |

### 3.4 Experiencia de calculo / risco

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| loading | `Consolidando focos, clima e score...` | jargao tecnico | Fala do processo interno do calculo. |
| banner fallback | `Falha externa simulada no calculo` | fallback tecnico | Explica o mecanismo de contingencia. |
| banner fallback | `FALLBACK ATIVO` | estado tecnico | Chip interno visivel. |
| fonte | `Fonte: MOCK/FALLBACK` | origem tecnica | Combina as duas origens em um rótulo interno. |
| label de resultado | `Score` | termo tecnico | Pode permanecer como metrico, mas e mais tecnico que narrativo. |
| label de severidade | `Severidade: INFO` | classificacao interna | Exibe classificacao operacional sem traduzir beneficio. |
| resumo | `Janela demonstrativa de 24h, alinhada ao contrato` | contrato interno | Referencia contrato e janela tecnica na UI. |
| narrativa | `risco demonstrativo` | demo interna | Mantem o foco no prototipo, nao no alerta para o usuario. |
| resultado sem dados | `Sem fatores de risco` | status tecnico | Linguagem de sistema, nao de acao. |

### 3.5 Detalhe do alerta preventivo

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| chips de estado | `ACTIVE` | status tecnico | Usa estado interno em ingles. |
| chips de canal | `IN_APP` | canal tecnico | Expõe forma de entrega da notificacao. |
| chips de nivel | `CRITICAL` | classificacao tecnica | Mantem enum tecnico visivel. |
| chips de severidade | `DANGER` | severidade interna | Mantem linguagem operacional de backend. |
| titulo de alerta | `Risco preventivo de queimada` | linguagem intermediaria | Entende-se, mas ainda carrega formula tecnica. |
| descricao | `O detalhamento do alerta mostra por que o cenário foi classificado como critico.` | explicacao de classificacao | Reexplica a logica interna do score. |

### 3.6 Dashboard gerencial

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| metricas | `Areas monitoradas` | rotulo operacional | Adequado como KPI, mas ainda tecnico. |
| metricas | `Alertas ativos` | rotulo operacional | Adequado como KPI, com baixa necessidade de ajuste. |
| metricas | `Score medio` | termo tecnico | Mantem uma metrico de risco explicita. |
| metricas | `Focos recentes` | termo tecnico | Requer simplificacao narrativa se for exibido fora do contexto analitico. |
| nota | `Contagem de areas disponiveis para a sessao demonstrativa.` | linguagem de demo | Explica o estado interno em vez do dado entregue. |
| nota | `Mostra se existe acompanhamento em tempo de demonstracao.` | linguagem de demo | Mantem foco no comportamento de teste. |
| estado vazio | `Leitura executiva` | jargao corporativo | Pode soar mais tecnico do que utilitario para o usuario final. |

### 3.7 Notificacao mobile / in-app

| Elemento | Texto atual | Tipo de ruido | Observacao |
|---|---|---|---|
| subtitulo | `IN_APP | DANGER` | status tecnico | Usa canal e severidade de forma interna. |
| badge | `CRITICAL` | classificacao tecnica | Enum tecnico exposto no preview. |
| contexto | `A notificacao segue o mesmo resumo do alerta preventivo e funciona como demonstracao visual, sem envio real.` | explicacao de demo | Reforca o limite tecnico do prototipo. |
| estado vazio | `Sem notificacao ativa` | status tecnico | Pode ficar mais orientado a acao. |
| titulo restrito | `Notificacao restrita` | estado tecnico | Explica bloqueio interno no preview. |
| subtitulo restrito | `IN_APP | ACESSO_RESTRITO` | status tecnico | Exibe codigo e estado interno. |
| badge restrito | `403` | codigo HTTP | Codigo tecnico visivel ao usuario final. |

## 4. Padroes de ruido encontrados

- Siglas e enums de backend aparecem diretamente na UI, como `DEMO`, `ACTIVE`, `IN_APP`, `CRITICAL`, `DANGER` e `403`.
- Estados de fallback e mock sao expostos como rótulo principal em vez de ficarem limitados ao contexto interno do sistema.
- Algumas descricoes explicam o contrato tecnico do fluxo em vez de dizer ao usuario o que ele deve fazer ou entender.
- A jornada inicial concentra a maior parte dos termos de implementacao, principalmente na entrada, no mapa e no calculo.

## 5. Saida esperada para as proximas subtasks

Este inventario serve como base para:

- simplificar a copy da entrada e do cadastro;
- reduzir a exposicao de tokens, estados e origens tecnicas;
- tornar fallback, mock e contrato invisiveis ou discretos para o usuario final;
- orientar a reescrita dos estados de interface sem alterar a regra de negocio.
