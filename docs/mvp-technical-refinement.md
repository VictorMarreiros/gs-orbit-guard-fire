# OrbitGuard Fire MVP Technical Refinement

**Status:** Consolidado para implementacao da trilha 1  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `tasks/tasks-orbitguard-fire-mvp.md`, `docs/mvp-foundation.md`, `docs/mvp-scope-alignment.md`

## 1. Objetivo

Fechar as definicoes tecnicas necessarias para executar as tasks `1.1` a `1.5` do MVP, reduzindo ambiguidades antes da modelagem, contratos e implementacao.

## 2. Decisoes consolidadas

### 2.1 Validacao minima para cadastro de area

Campos obrigatorios:

- `name`
- `type`
- `latitude`
- `longitude`
- `radiusKm`

Regras de formato:

- `name`: string entre `3` e `80` caracteres, sem aceitar valor vazio apos `trim`.
- `type`: enum inicial fechado com `RURAL_PROPERTY`, `RURAL_COMMUNITY`, `SCHOOL`, `CONSERVATION_AREA`, `INDIGENOUS_TERRITORY`.
- `latitude`: numero decimal entre `-90` e `90`.
- `longitude`: numero decimal entre `-180` e `180`.
- `radiusKm`: numero maior que `0` e menor ou igual a `50`.

Regras operacionais adicionais:

- Coordenadas com mais de `6` casas decimais podem ser aceitas, mas devem ser normalizadas para `6`.
- O sistema deve impedir envio com qualquer campo ausente, `NaN`, fora de faixa ou string vazia.
- O tipo de area deve ser validado no backend mesmo que o frontend envie um valor arbitrario.
- Para o MVP, nao sera obrigatorio bloquear duplicidade geografica; apenas registrar aviso futuro em backlog.

Mensagens minimas de erro:

- `name`: `Informe um nome entre 3 e 80 caracteres.`
- `type`: `Selecione um tipo de area valido.`
- `latitude`: `Informe uma latitude valida entre -90 e 90.`
- `longitude`: `Informe uma longitude valida entre -180 e 180.`
- `radiusKm`: `Informe um raio de monitoramento entre 0.1 km e 50 km.`

Resultado esperado:

- Payload valido cria a area e libera a navegacao para mapa e calculo.
- Payload invalido retorna erro estruturado por campo e bloqueia a continuidade.

### 2.2 Criterio operacional de raio e proximidade espacial

Definicao do escopo espacial:

- O `radiusKm` cadastrado define a area principal monitorada.
- A consulta de relevancia espacial deve considerar uma vizinhanca operacional de ate `radiusKm + 5 km` para suportar alerta preventivo.
- Focos dentro do raio da area sao exibidos e pontuados como `inside`.
- Focos fora do raio, mas ate `5 km` alem dele, sao exibidos como `nearby` e podem influenciar o score com peso reduzido.
- Focos alem de `radiusKm + 5 km` nao entram no mapa do fluxo principal nem no calculo do MVP.

Faixas de proximidade para regras de risco:

- `0` a `5 km`: criticamente proximo.
- maior que `5` ate `10 km`: proximo.
- maior que `10` ate limite operacional: periferico.

Comportamento no mapa:

- A area base aparece como marcador central.
- O raio monitorado aparece como circulo principal.
- Focos `inside` usam destaque visual mais forte.
- Focos `nearby` usam destaque secundario e legenda distinta.
- O mapa deve informar quando nenhum foco relevante foi encontrado no raio operacional.

Observacao tecnica:

- No MVP inicial, a distancia pode ser calculada por formula de Haversine.
- PostGIS continua como evolucao posterior, sem bloquear a regra demonstrativa.

### 2.3 Conjunto de dados simulados/controlados do MVP

O repositorio deve conter seed mockado versionado com ao menos tres cenarios fixos:

#### Cenario A - Critico

- Area rural com `radiusKm = 10`.
- `4` focos relevantes nas ultimas `24 h`.
- Pelo menos `2` focos a menos de `5 km`.
- Clima seco: temperatura alta, umidade baixa, chuva ausente.
- Resultado esperado: score `HIGH` ou `CRITICAL`, com alerta ativo.

#### Cenario B - Moderado

- Area com `1` ou `2` focos entre `5` e `10 km`.
- Temperatura elevada, mas com umidade intermediaria ou chuva leve.
- Resultado esperado: score `MODERATE` ou `HIGH`, com explicacao parcial dos fatores.

#### Cenario C - Vazio/Baixo

- Nenhum foco relevante no raio operacional.
- Clima sem extremos relevantes.
- Resultado esperado: score `LOW`, sem alerta ativo e dashboard com estado vazio ou baixo risco.

Politica de fallback:

- Se adaptador externo falhar, o backend deve registrar falha e retornar dados do cenario mockado correspondente.
- O frontend deve sinalizar que os dados vieram de base demonstrativa quando houver fallback explicito.
- O mock deve cobrir `fire-events`, `weather`, `risk` e `alerts` de forma coerente entre si.

Estrutura minima dos mocks:

- `areas.json`
- `fire-events.json`
- `weather-snapshots.json`
- `dashboard-summary.json`

### 2.4 Especificacao do motor de risco demonstrativo

Janela temporal:

- Janela padrao para focos recentes: `24 horas`.
- Parametro de consulta pode aceitar override posterior, mas o calculo padrao do MVP usa `24 h`.

Pontuacao por fator:

- `NEAR_FIRE_CRITICAL`: `25` pontos para foco a ate `5 km`.
- `NEAR_FIRE_WARNING`: `15` pontos para foco maior que `5` e ate `10 km`.
- `FIRE_CLUSTER`: `20` pontos quando existirem `3` ou mais focos relevantes em `24 h`.
- `HIGH_TEMP`: `15` pontos para temperatura acima de `32 C`.
- `LOW_HUMIDITY`: `20` pontos para umidade abaixo de `30%`.
- `LOW_RAIN`: `15` pontos para precipitacao abaixo de `1 mm`.
- `STRONG_WIND`: `10` pontos para vento acima de `8 m/s`.

Regras de acumulacao:

- A pontuacao final e limitada a `100`.
- Os fatores climaticos acumulam entre si.
- Entre fatores de proximidade, considerar apenas a maior contribuicao de proximidade por janela para evitar dupla contagem do mesmo sinal primario.
- `FIRE_CLUSTER` pode acumular com proximidade.

Classificacao final:

- `0` a `30`: `LOW`
- `31` a `60`: `MODERATE`
- `61` a `85`: `HIGH`
- `86` a `100`: `CRITICAL`

Severidade operacional sugerida:

- `LOW`: `INFO`
- `MODERATE`: `ATTENTION`
- `HIGH`: `WARNING`
- `CRITICAL`: `DANGER`

Fatores explicaveis obrigatorios:

- Cada fator retornado precisa expor `code`, `label`, `points` e `reason`.
- O motor deve retornar tambem um resumo textual curto com os principais contribuintes.

### 2.5 Comportamento da notificacao demonstrativa

Escopo:

- A notificacao sera exclusivamente visual, in-app, com preview mobile opcional na interface.
- Nao havera envio real por push, SMS, e-mail ou WhatsApp nesta fase.

Gatilho de exibicao:

- Exibir notificacao quando o risco calculado resultar em `HIGH` ou `CRITICAL`.
- Para `MODERATE`, permitir apenas banner contextual na tela de resultado, sem simulacao de push.
- Para `LOW`, nao exibir notificacao ativa.

Conteudo minimo:

- titulo curto orientado a acao;
- nome da area;
- nivel de risco;
- principal causa resumida;
- uma recomendacao imediata.

Exemplo de payload visual:

```json
{
  "title": "Risco critico de queimada",
  "areaName": "Fazenda Santa Luzia",
  "level": "CRITICAL",
  "summary": "Focos proximos e clima seco nas ultimas 24h.",
  "action": "Reforce a vigilancia local agora."
}
```

Diretrizes de UX:

- Texto total curto, legivel em poucos segundos.
- Cor e iconografia coerentes com o nivel do alerta.
- A notificacao deve espelhar o mesmo contexto do detalhe do alerta principal.
- Deve existir estado demonstrativo de permissao negada apenas como UI de exemplo, sem dependencia de sistema operacional.

## 3. Decisoes que destravam as proximas fases

- Modelagem pode assumir `24 h` como janela padrao de concentracao.
- Frontend e backend podem compartilhar os mesmos enums de tipo de area, nivel de risco e severidade.
- Os mocks agora possuem tres cenarios obrigatorios: critico, moderado e vazio.
- O motor de risco do MVP passa a ser deterministico, limitado a `100` e explicavel por fatores nomeados.
- A notificacao demonstrativa fica formalmente restrita a `HIGH` e `CRITICAL`.

## 4. Impacto nas proximas tasks

- `2.x`: usar as entidades e enums definidos aqui.
- `3.x`: refletir estas regras nos contratos de request/response.
- `4.x` e `7.x`: implementar a logica exatamente sobre os pesos, limiares e fallback aqui descritos.
- `5.x` e `6.x`: usar as mensagens, estados e gatilhos visuais definidos neste documento.
- `8.x` a `10.x`: criar cenarios de teste alinhados aos tres datasets mockados e as quatro faixas de risco.
