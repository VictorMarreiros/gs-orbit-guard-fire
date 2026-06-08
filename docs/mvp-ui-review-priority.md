# OrbitGuard Fire MVP UI Review Priority

**Status:** Concluido para a task 1.3  
**Data:** 2026-06-07  
**Referencia:** `tasks/tasks-melhoria-frontend-ui-jornada.md`, `docs/mvp-ui-surface-map.md`, `docs/mvp-ui-language-audit.md`, `tasks/prd-melhoria-frontend-ui-jornada.md`

## 1. Objetivo

Definir a ordem de revisao das superficies do prototipo demonstrativo, priorizando primeiro o que o usuario ve no inicio da jornada e depois o que explica o risco, para orientar as proximas subtasks de copy, hierarquia visual e estados.

## 2. Criterio usado

A prioridade foi definida com base em tres perguntas:

- O bloco e visto nos primeiros segundos da jornada?
- O bloco orienta a acao principal da tela?
- O bloco acumula texto tecnico ou repeticao que pode confundir um usuario nao tecnico?

Quanto maior o impacto nas duas primeiras perguntas e maior o ruido na terceira, mais alta a prioridade de revisao.

## 3. Ordem de revisao por tela

### 3.1 Prioridade 1 - Entrada / login demonstrativo

**Motivo:** e a primeira superficie visivel e define a percepcao inicial do produto.

**Foco da revisao:**

- remover linguagem de implementacao visivel;
- encurtar textos de apoio;
- deixar clara a acao principal de entrada;
- reduzir qualquer referencia a contexto tecnico de sessao.

**Blocos com maior urgencia:**

- hero de abertura;
- card de login;
- resumo de contexto demonstrativo;
- cards de permissao e acesso restrito;
- switcher de sessao;
- barra de navegacao sequencial.

### 3.2 Prioridade 2 - Cadastro de area monitorada

**Motivo:** e a primeira acao operacional real do fluxo e precisa ficar simples para concluir sem hesitacao.

**Foco da revisao:**

- simplificar a explicacao do formulario;
- remover repeticao de regras;
- destacar nome da area, tipo, coordenadas e raio como unica acao relevante;
- suavizar mensagens de estado vazio, sucesso e erro.

**Blocos com maior urgencia:**

- titulo e descricao da secao;
- formulario principal;
- chips de regra;
- resumo de validacao;
- estado de sucesso do cadastro.

### 3.3 Prioridade 3 - Mapa de risco

**Motivo:** ocupa uma das telas mais importantes do fluxo e concentra leitura espacial, legenda e fallback.

**Foco da revisao:**

- reduzir textos que explicam a infraestrutura;
- manter a leitura espacial curta e objetiva;
- esconder ou suavizar referencias tecnicas a fallback e origem dos dados;
- destacar area, raio e focos relevantes como informacao principal.

**Blocos com maior urgencia:**

- estado vazio do mapa;
- loading do mapa;
- banner de fallback;
- contexto espacial;
- legenda;
- resumo de focos relevantes.

### 3.4 Prioridade 4 - Experiencia de calculo / risco

**Motivo:** e a parte mais densa da jornada e precisa traduzir o score em algo compreensivel em poucos segundos.

**Foco da revisao:**

- simplificar o texto do carregamento;
- reduzir repeticao entre score, severidade e narrativa;
- deixar os fatores explicaveis legiveis sem excesso de jargao;
- preservar a explicabilidade sem expor o funcionamento interno do calculo.

**Blocos com maior urgencia:**

- loading do risco;
- resultado do score;
- leitura imediata;
- fatores explicaveis;
- focos considerados;
- clima observado;
- sinais que entram no score;
- leitura do calculo.

### 3.5 Prioridade 5 - Detalhe do alerta preventivo

**Motivo:** fecha a leitura do risco e precisa ser acionavel, nao apenas descritivo.

**Foco da revisao:**

- encurtar o resumo do alerta;
- remover siglas e enums expostos sem contexto;
- destacar causa principal e recomendacao;
- manter o tom de orientacao pratica.

**Blocos com maior urgencia:**

- estado vazio do alerta;
- painel do alerta ativo;
- chips de estado e severidade;
- mensagem do alerta;
- causas principais;
- recomendacoes acionaveis.

### 3.6 Prioridade 6 - Dashboard gerencial

**Motivo:** consolida a jornada, mas depende de uma narrativa ja limpa nas telas anteriores.

**Foco da revisao:**

- simplificar labels de KPI;
- reduzir texto de apoio;
- tornar a leitura executiva mais direta;
- manter o estado vazio claro, mas curto.

**Blocos com maior urgencia:**

- estado vazio do dashboard;
- cards metricos;
- distribuicao por nivel;
- areas prioritarias;
- leitura executiva.

### 3.7 Prioridade 7 - Notificacao mobile / in-app

**Motivo:** e a superficie final da jornada e pode ser refinada depois que a mensagem central estiver consistente nas telas anteriores.

**Foco da revisao:**

- enxugar o preview mobile;
- remover sinais tecnicos desnecessarios;
- preservar o sentido de urgencia sem excesso de detalhe;
- alinhar a copy com o alerta principal.

**Blocos com maior urgencia:**

- estado vazio da notificacao;
- preview mobile ativo;
- cabecalho do telefone;
- headline, subhead, badge e corpo da mensagem;
- contexto do preview.

## 4. Sequencia de execucao recomendada

1. Entrada / login demonstrativo.
2. Cadastro de area monitorada.
3. Mapa de risco.
4. Experiencia de calculo / risco.
5. Detalhe do alerta preventivo.
6. Dashboard gerencial.
7. Notificacao mobile / in-app.

## 5. Conclusao

Esta ordem garante que a revisao comece pelas superfices mais visiveis e com maior impacto na primeira impressao, depois avance para as telas de analise e finalize nas superfices de consolidacao do fluxo. O resultado esperado e uma jornada mais curta, mais clara e menos tecnica para o usuario final.
