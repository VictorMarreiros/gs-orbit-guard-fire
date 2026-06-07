# PRD - OrbitGuard Fire MVP

**Produto:** OrbitGuard Fire  
**Funcionalidade:** MVP da plataforma de alerta orbital preventivo contra queimadas  
**Versao:** 1.0  
**Status:** Draft  
**Responsavel:** Product / Engenharia / QA  
**Data:** 2026-06-07  

---

## 1. Visao geral

O OrbitGuard Fire e uma plataforma digital para monitoramento preventivo de queimadas que combina dados orbitais, dados climaticos, geolocalizacao e um motor explicavel de risco. O MVP deve demonstrar, de forma simples e defensavel, que e possivel transformar dados tecnicos de fontes como NASA FIRMS, NASA POWER e INPE BDQueimadas em alertas compreensiveis, mapas de risco, recomendacoes praticas e dashboards operacionais.

A entrega deve cobrir o fluxo principal de cadastrar uma area monitorada, visualizar a area no mapa, identificar focos de calor proximos, consultar variaveis climaticas, calcular um score de risco, gerar um alerta preventivo e exibir recomendacoes e uma visao consolidada em dashboard.

## 2. Contexto e problema

Queimadas e incendios ambientais geram perdas humanas, ambientais, economicas e produtivas. Embora existam bases publicas com dados climaticos e de satelite, essas informacoes costumam ser tecnicas, fragmentadas e pouco acessiveis para usuarios locais, pequenos produtores, comunidades e gestores publicos.

Sem uma camada de traducao operacional, o usuario impactado nao consegue:

- identificar rapidamente se ha focos relevantes perto da sua area;
- entender se as condicoes climaticas aumentam o risco;
- receber um alerta com contexto suficiente para agir preventivamente;
- consolidar a situacao em uma visao gerencial simples.

O MVP existe para validar a proposta de valor do produto e servir como base demonstrativa para evolucao posterior com integracoes reais, persistencia geoespacial e notificacoes automatizadas.

## 3. Objetivos

### 3.1. Objetivo principal

Demonstrar um fluxo funcional e explicavel de deteccao preventiva de risco de queimadas para areas monitoradas, usando dados espaciais e climaticos de forma acessivel ao usuario final.

### 3.2. Objetivos especificos

- Permitir o cadastro de uma area monitorada com dados suficientes para analise espacial inicial.
- Exibir em mapa a area monitorada, o raio de cobertura e focos de calor proximos.
- Calcular um score de risco demonstrativo com fatores explicitos e classificacao por nivel.
- Gerar um alerta preventivo com explicacao dos fatores de risco e recomendacoes acionaveis.
- Consolidar alertas, areas prioritarias e evolucao de risco em um dashboard gerencial.

## 4. Nao objetivos / Fora de escopo

Esta entrega nao contempla:

- operacao produtiva com SLA real;
- integracao obrigatoria e estavel com todas as APIs externas no MVP;
- aplicacao mobile nativa;
- envio real de notificacoes por WhatsApp, SMS ou e-mail;
- modelos preditivos de machine learning;
- gestao completa multi-tenant com perfis avancados de autorizacao;
- ingestao historica em larga escala;
- relatorios ESG, integracao com sensores locais ou Defesa Civil.

Itens fora do escopo podem ser considerados em versoes futuras quando fizer sentido.

## 5. Personas / usuarios impactados

### 5.1. Pequeno produtor rural

Usuario que monitora propriedade ou area produtiva exposta a vegetacao e clima seco.

**Necessidade principal:** saber se ha risco de queimada perto da sua area para agir antes do agravamento.  
**Dor atual:** dados tecnicos e dispersos dificultam leitura rapida do risco.  
**Valor entregue:** alerta claro, mapa contextual e recomendacoes praticas.

### 5.2. Comunidade ou escola rural

Grupo local que precisa de visibilidade simples sobre risco ambiental proximo.

**Necessidade principal:** entender quando a situacao exige atencao preventiva.  
**Dor atual:** ausencia de informacao consolidada e compreensivel.  
**Valor entregue:** visualizacao simplificada do risco e orientacoes imediatas.

### 5.3. Gestor publico ou Defesa Civil municipal

Usuario institucional que precisa priorizar monitoramento e resposta.

**Necessidade principal:** consolidar areas prioritarias e alertas ativos.  
**Dor atual:** dificuldade para comparar sinais de risco em diferentes areas.  
**Valor entregue:** dashboard resumido com priorizacao e status operacional.

## 6. Jornada do usuario

### 6.1. Jornada principal

1. O usuario acessa a plataforma e entra no fluxo principal.
2. O usuario cadastra uma area monitorada com nome, tipo, coordenadas e raio de monitoramento.
3. O sistema exibe a area cadastrada no mapa.
4. O sistema consulta ou simula focos de calor proximos e variaveis climaticas.
5. O sistema calcula o score de risco com base nas regras definidas.
6. O sistema classifica o nivel de risco e gera um alerta preventivo.
7. O usuario visualiza explicacao do alerta, fatores de risco e recomendacoes.
8. O usuario acessa o dashboard gerencial para acompanhar visao consolidada.

### 6.2. Jornadas alternativas

- Quando APIs externas estiverem indisponiveis, o sistema deve operar com dados simulados/controlados para preservar a demonstracao.
- Quando nao houver focos de calor ou variaveis suficientes para classificacao elevada, o sistema deve exibir risco baixo ou moderado com contexto explicativo.
- Quando dados de entrada da area forem invalidos, o sistema deve bloquear o cadastro e orientar correcao.
- Quando o usuario nao tiver permissao para visualizar uma area privada, o sistema deve impedir o acesso aos detalhes.
- Quando nao houver alertas ativos, o dashboard deve apresentar estado vazio com orientacao de acompanhamento.

## 7. Escopo funcional

A funcionalidade deve conter:

- fluxo navegavel de entrada/login demonstrativo;
- cadastro de area monitorada;
- visualizacao da area em mapa com raio de monitoramento;
- identificacao ou simulacao de focos de calor proximos;
- consulta ou simulacao de variaveis climaticas relevantes;
- calculo de score de risco com fatores explicitos;
- classificacao do risco em niveis;
- detalhe do alerta com explicabilidade e recomendacoes;
- dashboard gerencial com consolidacao de indicadores;
- demonstracao de notificacao mobile/in-app.

## 8. Requisitos funcionais

### RF001 - Cadastrar area monitorada

O sistema deve permitir o cadastro de uma area monitorada com nome, tipo, coordenadas geograficas e raio de monitoramento.

**Criterios:**

- O formulario deve aceitar dados minimos necessarios para identificacao e georreferenciamento da area.
- O sistema deve validar obrigatoriedade e formato dos campos antes de concluir o cadastro.
- O sistema deve associar a area monitorada ao usuario autenticado ou ao contexto demonstrativo equivalente.

**Referencias relacionadas:** RN001, RN002, CA001, CA002.

### RF002 - Exibir area e contexto espacial no mapa

O sistema deve apresentar a area monitorada em um mapa com destaque visual da localizacao e do raio de cobertura.

**Criterios:**

- O mapa deve exibir a area cadastrada como ponto, poligono simplificado ou marcador equivalente.
- O raio de monitoramento deve ser visualmente representado.
- Focos de calor proximos devem ser exibidos com legenda adequada.

**Referencias relacionadas:** RN002, RN003, CA003.

### RF003 - Obter ou simular focos de calor proximos

O sistema deve consultar ou simular focos de calor proximos a area monitorada para apoiar o calculo de risco.

**Criterios:**

- O sistema deve suportar fonte simulada/controlada no MVP.
- O sistema deve armazenar ou apresentar distancia aproximada, momento da deteccao e quantidade de focos relevantes.
- O sistema deve considerar o periodo recente configurado para demonstracao do risco.

**Referencias relacionadas:** RN003, RN004, CA004, CA005.

### RF004 - Obter ou simular dados climaticos relevantes

O sistema deve consultar ou simular variaveis climaticas relevantes para o motor de risco.

**Criterios:**

- O sistema deve considerar temperatura, precipitacao e outras variaveis disponiveis para o MVP.
- O sistema deve exibir os dados usados no calculo em formato compreensivel.
- O sistema deve continuar funcional com dados controlados quando integracoes externas nao estiverem disponiveis.

**Referencias relacionadas:** RN004, RN005, CA004, CA005.

### RF005 - Calcular score de risco explicavel

O sistema deve calcular um score de risco de queimadas com base em fatores observaveis e regras demonstrativas.

**Criterios:**

- O score deve variar de 0 a 100.
- O sistema deve explicitar quais fatores contribuiram para a pontuacao final.
- O sistema deve classificar o resultado em niveis de risco predefinidos.

**Referencias relacionadas:** RN004, RN005, RN006, CA006.

### RF006 - Gerar alerta preventivo

O sistema deve gerar um alerta preventivo quando o score calculado indicar necessidade de atencao.

**Criterios:**

- O alerta deve apresentar nivel de risco, severidade e resumo da situacao.
- O alerta deve explicar por que o risco foi elevado.
- O alerta deve sugerir recomendacoes praticas para mitigacao ou monitoramento.

**Referencias relacionadas:** RN006, RN007, CA007, CA008.

### RF007 - Exibir dashboard gerencial

O sistema deve apresentar um dashboard com consolidacao operacional das areas monitoradas e alertas.

**Criterios:**

- O dashboard deve mostrar alertas ativos, score medio, focos recentes e areas prioritarias.
- O dashboard deve permitir leitura rapida da situacao geral.
- O dashboard deve representar a evolucao ou distribuicao de risco em formato visual simples.

**Referencias relacionadas:** RN007, CA009.

### RF008 - Demonstrar notificacao mobile ou in-app

O sistema deve demonstrar como um alerta preventivo poderia ser entregue em dispositivo movel ou canal in-app.

**Criterios:**

- A demonstracao deve manter coerencia com o alerta gerado no fluxo principal.
- O conteudo da notificacao deve ser curto, claro e acionavel.
- A demonstracao nao precisa enviar notificacoes reais no MVP.

**Referencias relacionadas:** RN007, CA010.

## 9. Regras de negocio

### RN001 - Dados minimos da area monitorada

Uma area monitorada so pode ser cadastrada se possuir identificacao, tipo, coordenadas e raio de monitoramento validos.

**Exemplo:** uma area sem latitude ou longitude nao pode seguir para o calculo de risco.  
**Impacto esperado:** garante integridade minima do fluxo espacial.

### RN002 - Escopo espacial da analise

O monitoramento deve considerar os eventos e variaveis associados ao raio definido para a area cadastrada ou a sua vizinhanca operacional.

**Exemplo:** focos fora do raio configurado podem ser ignorados ou tratados com menor relevancia.  
**Impacto esperado:** evita alerta sem relacao geografica com a area monitorada.

### RN003 - Proximidade de focos afeta o score

Focos de calor proximos a area monitorada devem aumentar a pontuacao de risco conforme a faixa de distancia definida pelo motor demonstrativo.

**Exemplo:** foco entre 5 e 10 km adiciona 25 pontos.  
**Impacto esperado:** prioriza ameacas geograficamente relevantes.

### RN004 - Concentracao recente de focos afeta o score

A quantidade de focos observados em janela recente deve elevar o score quando atingir ou superar o limiar configurado.

**Exemplo:** tres ou mais focos em 24 horas adicionam 20 pontos.  
**Impacto esperado:** distingue evento isolado de padrao de agravamento.

### RN005 - Condicoes climaticas adversas afetam o score

Temperatura elevada, baixa umidade e ausencia de chuva devem contribuir para aumento do risco conforme limites definidos.

**Exemplo:** temperatura acima de 32 C adiciona 15 pontos e precipitacao abaixo de 1 mm adiciona 15 pontos.  
**Impacto esperado:** incorpora contexto ambiental no alerta.

### RN006 - Classificacao do score

O score deve ser convertido em nivel de risco segundo faixas predefinidas.

**Exemplo:** 0-30 LOW, 31-60 MODERATE, 61-85 HIGH e 86+ CRITICAL.  
**Impacto esperado:** padroniza leitura do resultado pelo usuario.

### RN007 - Alerta deve ser explicavel e acionavel

Todo alerta exibido ao usuario deve informar fatores de risco relevantes e pelo menos uma recomendacao pratica coerente com o nivel calculado.

**Exemplo:** em risco CRITICAL, recomendar vigilancia imediata, checagem da area e acionamento preventivo de responsaveis locais.  
**Impacto esperado:** transforma score em decisao operacional.

## 10. Requisitos nao funcionais

### RNF001 - Compreensibilidade do risco

O MVP deve apresentar score, nivel, fatores e recomendacoes em linguagem compreensivel para usuario nao tecnico.

**Metrica sugerida:** todos os alertas exibem score, classificacao e pelo menos 3 fatores explicitos quando aplicavel.

### RNF002 - Resiliencia demonstrativa

O MVP deve continuar operacional com dados simulados/controlados quando APIs externas estiverem indisponiveis.

**Metrica sugerida:** o fluxo principal deve ser executavel fim a fim sem dependencia obrigatoria de internet.

### RNF003 - Performance do fluxo demonstrativo

As telas principais do MVP devem responder de forma adequada para contexto de apresentacao.

**Metrica sugerida:** transicoes e carregamento do calculo demonstrativo em ate 3 segundos na maior parte dos cenarios locais.

### RNF004 - Seguranca basica de dados

O produto deve considerar autenticacao, protecao de credenciais, validacao de entrada e restricao de visualizacao de areas privadas nas proximas iteracoes funcionais.

**Metrica sugerida:** endpoints previstos usam autenticacao JWT e nao expõem dados sensiveis em logs quando implementados.

### RNF005 - Observabilidade minima

O sistema deve registrar eventos relevantes de coleta, calculo de risco e falhas de integracao.

**Metrica sugerida:** logs de inicio/fim de coleta, calculo de score e erros criticos disponiveis para auditoria tecnica.

## 11. UX/UI e comportamento esperado

O MVP deve incluir as seguintes telas ou estados navegaveis:

- landing page com proposta de valor;
- login/entrada demonstrativa;
- formulario de cadastro de area monitorada;
- tela de calculo de risco;
- mapa de risco com legenda, focos e variaveis ambientais;
- detalhe do alerta com explicacao do cenario e acoes recomendadas;
- dashboard gerencial com indicadores consolidados;
- tela ou componente de notificacao mobile/in-app.

O comportamento esperado inclui:

- navegacao clara entre as etapas do fluxo principal;
- exibicao visual do nivel de risco com destaque adequado;
- linguagem objetiva e acessivel;
- comportamento responsivo pelo menos para desktop e visualizacao mobile demonstrativa;
- mensagens de erro e vazio coerentes com o contexto;
- consideracao minima de acessibilidade, como contraste legivel e rotulos de campos.

## 12. Estados da interface

### 12.1. Loading

Durante consulta, simulacao ou calculo, o sistema deve exibir indicador de carregamento e mensagem contextual, como "Calculando risco da area monitorada".

### 12.2. Sucesso

Ao concluir o fluxo, o sistema deve exibir score, classificacao, fatores de risco, recomendacoes e elementos visuais correspondentes no mapa e no dashboard.

### 12.3. Vazio

Quando nao houver alertas ativos, focos proximos ou historico disponivel, o sistema deve informar o estado sem ambiguidade e orientar o usuario a continuar monitorando ou cadastrar nova area.

### 12.4. Erro

Quando houver falha de integracao, consulta ou processamento, o sistema deve informar que os dados externos nao puderam ser obtidos e, quando possivel, prosseguir com dados simulados ou alternativa controlada.

### 12.5. Permissao negada

Quando o usuario tentar acessar area privada sem autorizacao, o sistema deve bloquear a visualizacao e apresentar mensagem de acesso restrito.

### 12.6. Dados invalidos

Quando latitude, longitude, raio ou campos obrigatorios estiverem invalidos, o sistema deve destacar os campos com problema e impedir a continuidade do cadastro ate correcao.

## 13. Dados e modelo esperado

Entidades principais previstas para o MVP e evolucao imediata:

- `User`
- `MonitoredArea`
- `FireEvent`
- `WeatherSnapshot`
- `RiskScore`
- `RiskFactor`
- `Alert`

Campos sugeridos para `MonitoredArea`:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Fazenda Santa Luzia",
  "type": "RURAL_PROPERTY",
  "latitude": -15.7801,
  "longitude": -47.9292,
  "radiusKm": 10,
  "createdAt": "2026-06-07T12:00:00Z",
  "updatedAt": "2026-06-07T12:00:00Z"
}
```

Campos sugeridos para `RiskScore`:

```json
{
  "id": "uuid",
  "areaId": "uuid",
  "score": 95,
  "level": "CRITICAL",
  "severity": "DANGER",
  "factors": [
    { "code": "NEAR_FIRE", "points": 25 },
    { "code": "FIRE_CLUSTER", "points": 20 },
    { "code": "HIGH_TEMP", "points": 15 },
    { "code": "LOW_HUMIDITY", "points": 20 },
    { "code": "LOW_RAIN", "points": 15 }
  ],
  "calculatedAt": "2026-06-07T12:05:00Z"
}
```

Campos sugeridos para `Alert`:

```json
{
  "id": "uuid",
  "areaId": "uuid",
  "riskScoreId": "uuid",
  "status": "ACTIVE",
  "level": "CRITICAL",
  "title": "Risco critico de queimada detectado",
  "message": "Focos proximos e clima seco elevam o risco da area.",
  "recommendedActions": [
    "Reforcar monitoramento local",
    "Verificar focos proximos",
    "Acionar responsavel operacional"
  ],
  "createdAt": "2026-06-07T12:05:00Z"
}
```

Dados sensiveis ou criticos:

- coordenadas de areas privadas;
- credenciais de usuario;
- preferencias de notificacao;
- historico operacional associado a area monitorada.

## 14. Contratos de API sugeridos

### 14.1. Registrar usuario

**Endpoint:**

```http
POST /auth/register
```

**Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

**Erros esperados:** `400`, `409`, `422`, `500`.

### 14.2. Login

**Endpoint:**

```http
POST /auth/login
```

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta 200:**

```json
{
  "accessToken": "jwt",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Erros esperados:** `400`, `401`, `422`, `500`.

### 14.3. Criar area monitorada

**Endpoint:**

```http
POST /monitored-areas
```

**Body:**

```json
{
  "name": "Fazenda Santa Luzia",
  "type": "RURAL_PROPERTY",
  "latitude": -15.7801,
  "longitude": -47.9292,
  "radiusKm": 10
}
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "name": "Fazenda Santa Luzia"
}
```

**Erros esperados:** `400`, `401`, `422`, `500`.

### 14.4. Consultar focos de calor da area

**Endpoint:**

```http
GET /monitored-areas/{id}/fire-events?periodHours=48
```

**Resposta 200:**

```json
{
  "items": [
    {
      "id": "ext-1",
      "latitude": -15.8,
      "longitude": -47.91,
      "detectedAt": "2026-06-07T10:00:00Z",
      "distanceKm": 7.4
    }
  ],
  "total": 1
}
```

**Erros esperados:** `400`, `401`, `403`, `404`, `500`.

### 14.5. Consultar clima atual da area

**Endpoint:**

```http
GET /monitored-areas/{id}/weather/latest
```

**Resposta 200:**

```json
{
  "temperatureC": 33.2,
  "precipitationMm": 0,
  "humidityPct": 28,
  "windSpeedMs": 4.1,
  "observedAt": "2026-06-07T09:00:00Z"
}
```

**Erros esperados:** `400`, `401`, `403`, `404`, `500`.

### 14.6. Calcular risco da area

**Endpoint:**

```http
POST /monitored-areas/{id}/risk/calculate
```

**Resposta 200:**

```json
{
  "score": 95,
  "level": "CRITICAL",
  "severity": "DANGER",
  "factors": [
    { "code": "NEAR_FIRE", "points": 25 },
    { "code": "FIRE_CLUSTER", "points": 20 }
  ]
}
```

**Erros esperados:** `400`, `401`, `403`, `404`, `500`.

### 14.7. Listar alertas

**Endpoint:**

```http
GET /alerts
```

**Query params:**

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| status | string | Nao | Filtra por status do alerta |
| level | string | Nao | Filtra por nivel de risco |

**Resposta 200:**

```json
{
  "items": [
    {
      "id": "uuid",
      "level": "CRITICAL",
      "status": "ACTIVE"
    }
  ],
  "total": 1
}
```

**Erros esperados:** `400`, `401`, `500`.

### 14.8. Resumo de dashboard

**Endpoint:**

```http
GET /dashboard/summary
```

**Resposta 200:**

```json
{
  "activeAlerts": 3,
  "averageRiskScore": 67,
  "recentFireEvents": 8,
  "priorityAreas": 2
}
```

**Erros esperados:** `400`, `401`, `500`.

## 15. Criterios de aceite

### CA001 - Cadastro de area com sucesso

**Dado que** o usuario preenche nome, tipo, coordenadas e raio validos  
**Quando** conclui o cadastro da area monitorada  
**Entao** o sistema deve registrar a area e permitir avancar para a visualizacao no mapa

**Referencias:** RF001, RN001.

### CA002 - Bloqueio de cadastro invalido

**Dado que** o usuario informa coordenadas ausentes ou raio invalido  
**Quando** tenta concluir o cadastro  
**Entao** o sistema deve impedir a acao e exibir os erros dos campos obrigatorios

**Referencias:** RF001, RN001.

### CA003 - Visualizacao espacial da area

**Dado que** existe uma area monitorada cadastrada  
**Quando** o usuario acessa o mapa de risco  
**Entao** o sistema deve exibir a area, o raio de cobertura e os focos proximos com legenda

**Referencias:** RF002, RN002.

### CA004 - Calculo de risco com dados disponiveis

**Dado que** o sistema possui focos de calor e variaveis climaticas para a area  
**Quando** o usuario executa o calculo de risco  
**Entao** o sistema deve gerar score, classificacao e lista de fatores de contribuicao

**Referencias:** RF003, RF004, RF005, RN003, RN004, RN005, RN006.

### CA005 - Continuidade com dados simulados

**Dado que** uma integracao externa esteja indisponivel  
**Quando** o usuario executar o fluxo principal do MVP  
**Entao** o sistema deve manter a demonstracao usando dados simulados/controlados e informar o contexto quando necessario

**Referencias:** RF003, RF004, RNF002.

### CA006 - Classificacao correta do score

**Dado que** o score calculado esteja em uma das faixas definidas  
**Quando** o sistema concluir o processamento  
**Entao** a classificacao exibida deve corresponder exatamente a faixa configurada

**Referencias:** RF005, RN006.

### CA007 - Alerta explicavel

**Dado que** o risco calculado exija alerta preventivo  
**Quando** o detalhe do alerta for exibido  
**Entao** o sistema deve apresentar nivel de risco, causas principais e recomendacoes praticas coerentes

**Referencias:** RF006, RN007.

### CA008 - Estado vazio sem alertas

**Dado que** nao existam alertas ativos para o usuario  
**Quando** ele acessar a area de alertas ou o dashboard  
**Entao** o sistema deve exibir estado vazio com mensagem clara e orientacao de acompanhamento

**Referencias:** RF006, RF007.

### CA009 - Dashboard consolidado

**Dado que** existam areas e alertas disponiveis  
**Quando** o usuario acessar o dashboard gerencial  
**Entao** o sistema deve exibir indicadores agregados, areas prioritarias e visao resumida do risco

**Referencias:** RF007.

### CA010 - Demonstracao de notificacao

**Dado que** um alerta preventivo foi gerado  
**Quando** a experiencia mobile ou in-app for apresentada  
**Entao** a notificacao deve refletir o mesmo contexto, nivel e urgencia do alerta principal

**Referencias:** RF008, RN007.

## 16. Metricas de sucesso

- percentual de execucao completa do fluxo principal durante demonstracoes;
- quantidade de areas monitoradas cadastradas em sessoes de validacao;
- quantidade de alertas gerados com explicacao completa;
- tempo medio para concluir cadastro e calculo de risco;
- taxa de falha de integracoes externas sem interromper a demonstracao;
- clareza percebida da informacao de risco em testes com usuarios ou avaliadores.

## 17. Casos de borda

- usuario sem internet durante uso do prototipo;
- API externa indisponivel;
- timeout em consultas de dados climaticos ou de focos;
- dados vazios ou inconsistentes de fontes externas;
- usuario sem permissao para area privada;
- latitude, longitude ou raio invalidos;
- area cadastrada inexistente ou removida;
- duplicidade de area muito proxima com mesmo identificador logico;
- volume alto de focos no mapa;
- score limiar entre duas classificacoes;
- alerta ja lido ou historico inexistente;
- diferenca entre dados simulados e dados reais em ambiente de demonstracao.

## 18. Dependencias

- DEP001 - prototipo navegavel HTML ou implementacao frontend equivalente;
- DEP002 - modelo de mapa interativo com Leaflet ou tecnologia equivalente;
- DEP003 - definicao inicial do motor de risco e pesos demonstrativos;
- DEP004 - dados simulados/controlados para execucao offline ou resiliente;
- DEP005 - integracoes planejadas com NASA FIRMS, NASA POWER e INPE BDQueimadas;
- DEP006 - backend com suporte a autenticacao, areas, alertas, dashboard e calculo de risco;
- DEP007 - persistencia relacional/geoespacial prevista com PostgreSQL e PostGIS.

## 19. Riscos

| Risco | Impacto | Probabilidade | Mitigacao |
|---|---|---|---|
| Dependencia excessiva de APIs externas na demonstracao | Alto | Media | Manter base simulada controlada e fallback explicito |
| Score demonstrativo ser interpretado como previsao operacional real | Alto | Media | Destacar natureza de MVP conceitual e regras demonstrativas |
| Complexidade geoespacial atrasar implementacao do MVP funcional | Medio | Media | Priorizar fluxo simplificado e evolucao progressiva para PostGIS |
| UX confusa para publico nao tecnico | Alto | Media | Validar linguagem, legenda e explicabilidade com usuarios alvo |
| Dados de localizacao exporem informacao sensivel | Alto | Baixa | Aplicar autenticacao, controle de acesso e cuidado com logs |
| Divergencia entre fontes de dados externas | Medio | Media | Normalizar dados e registrar origem de cada informacao |

## 20. Plano de release

### 20.1. Fase 1 - MVP

- fluxo navegavel ponta a ponta;
- cadastro de area;
- mapa com focos simulados;
- score de risco explicavel;
- alerta preventivo;
- dashboard estatico ou semi-dinamico;
- demonstracao de notificacao.

### 20.2. Fase 2 - Evolucao

- frontend em React;
- backend em NestJS;
- APIs principais;
- base PostgreSQL com PostGIS;
- persistencia de historico de risco e alertas;
- autenticacao JWT.

### 20.3. Fase 3 - Futuro

- integracoes reais com NASA FIRMS, NASA POWER e INPE;
- jobs de ingestao periodica;
- notificacoes reais;
- ajuste de regras por tipo de area;
- app mobile e capacidades preditivas.

## 21. Estrategia de QA

### 21.1. Testes funcionais

- validar cadastro de area com dados validos;
- validar bloqueio de dados invalidos;
- validar exibicao do mapa e do raio monitorado;
- validar calculo de risco para cenarios baixo, moderado, alto e critico;
- validar geracao e detalhe de alerta;
- validar dashboard com alertas e sem alertas;
- validar notificacao demonstrativa coerente com o alerta.

### 21.2. Testes de API

- validar contratos de autenticacao;
- validar criacao e consulta de areas monitoradas;
- validar consulta de focos e clima;
- validar retorno do calculo de risco com estrutura esperada;
- validar codigos de erro para `400`, `401`, `403`, `404`, `422` e `500`.

### 21.3. Testes nao funcionais

- validar tempo de resposta aceitavel no fluxo demonstrativo;
- validar comportamento offline ou com fallback de dados simulados;
- validar logs minimos de observabilidade;
- validar legibilidade, contraste e navegacao basica;
- validar nao exposicao de dados sensiveis em mensagens ou logs.

### 21.4. Cenarios BDD

```gherkin
Feature: OrbitGuard Fire MVP

  Scenario: Executar fluxo principal com risco critico
    Given que existe uma area monitorada valida
    And que ha focos de calor proximos e clima seco
    When o usuario calcula o risco da area
    Then o sistema apresenta score, nivel CRITICAL e recomendacoes praticas

  Scenario: Prosseguir com dados simulados
    Given que uma API externa esta indisponivel
    When o usuario executa o fluxo principal do MVP
    Then o sistema utiliza dados simulados e preserva a demonstracao
```

## 22. Perguntas em aberto

- Qual sera o criterio exato para permissao e compartilhamento de areas entre usuarios ou perfis institucionais?
- O MVP deve persistir historico real de score por area ou apenas simular historico para demonstracao?
- Qual janela temporal padrao sera usada para considerar focos recentes no calculo de risco?
- A notificacao demonstrativa sera apenas visual ou tambem deve existir canal de envio real em ambiente controlado?
- Quais tipos de area devem ser suportados no cadastro inicial alem de propriedade rural, comunidade e escola?

## 23. Checklist de qualidade do PRD

- [x] Problema descrito com clareza
- [x] Objetivo principal definido
- [x] Nao objetivos definidos
- [x] Personas ou usuarios impactados descritos
- [x] Jornada principal descrita
- [x] Escopo funcional delimitado
- [x] Requisitos funcionais com IDs
- [x] Regras de negocio com IDs
- [x] Requisitos nao funcionais com IDs
- [x] UX/UI e estados de interface descritos quando aplicavel
- [x] Criterios de aceite testaveis com IDs
- [x] Metricas de sucesso definidas
- [x] Casos de borda mapeados
- [x] Dependencias listadas
- [x] Riscos e mitigacoes definidos
- [x] Estrategia de QA definida
- [x] Perguntas em aberto registradas
- [x] Documento preparado para extracao estruturada de tasks

## 24. Observacao para extracao de tasks

Ao gerar tasks, agrupar por:

- preparacao e estrutura do projeto;
- autenticacao e usuarios;
- cadastro e persistencia de areas monitoradas;
- mapa e camada geoespacial;
- ingestao/mock de focos de calor;
- ingestao/mock de clima;
- motor de risco e classificacao;
- alertas e detalhe explicavel;
- dashboard gerencial;
- estados de UI e notificacao;
- testes funcionais e de API;
- observabilidade e seguranca basica.

Cada task deve referenciar os IDs relevantes do PRD, especialmente `RF`, `RN`, `RNF`, `CA` e `DEP`.

## 25. Resumo executivo

Esta entrega define o MVP do OrbitGuard Fire como uma plataforma demonstrativa de alerta preventivo contra queimadas baseada em geolocalizacao, focos de calor e contexto climatico. O problema atacado e a dificuldade de transformar dados tecnicos dispersos em decisao operacional simples para produtores, comunidades e gestores. O valor gerado esta na capacidade de cadastrar areas, visualizar risco no mapa, receber alerta explicavel e acompanhar um dashboard consolidado. O MVP prepara a evolucao para integracoes reais, persistencia geoespacial, notificacoes automatizadas e maior maturidade operacional.

## Premissas assumidas

- O README representa a fonte principal e suficiente para o escopo do PRD.
- O foco desta versao e o MVP conceitual e demonstrativo, nao uma operacao produtiva completa.
- O fluxo pode combinar dados simulados com arquitetura preparada para integracoes reais.
- O login do prototipo atual pode ser demonstrativo, mesmo que a arquitetura recomende autenticacao real nas fases seguintes.
