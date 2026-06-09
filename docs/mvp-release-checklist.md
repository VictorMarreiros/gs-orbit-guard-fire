# OrbitGuard Fire MVP Release Checklist

**Status:** Preparado para a task 14.3  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `tasks/tasks-orbitguard-fire-mvp.md`, `docs/mvp-operational-guide.md`, `docs/mvp-scope-alignment.md`

## 1. Objetivo

Definir um roteiro objetivo para validar o MVP antes de apresentacao, handoff ou demonstracao guiada.

## 2. Antes da demonstracao

- [ ] Confirmar que o escopo da apresentacao continua restrito ao MVP demonstrativo.
- [ ] Revisar `docs/mvp-operational-guide.md` e `docs/mvp-scope-alignment.md` para reforcar o que entra e o que fica fora de escopo.
- [ ] Validar que a sessao demo usa o contexto demonstrativo esperado.
- [ ] Verificar se a pipeline minima local ainda passa sem erros.

Comandos de validacao:

```bash
npm run check
npm run check:backend
npm run check:prototype
npm run demo:prototype
```

## 3. Roteiro da demonstracao

Siga esta ordem para manter o fluxo coerente durante a apresentacao:

1. Executar login demonstrativo.
2. Cadastrar a area monitorada principal.
3. Confirmar mapa com centro, raio e focos relevantes.
4. Abrir a experiencia de calculo e revisar focos e clima usados no risco.
5. Verificar score, nivel, severidade e fatores explicaveis.
6. Exibir o alerta preventivo e as recomendacoes praticas.
7. Conferir o dashboard com e sem alertas ativos.
8. Mostrar a notificacao in-app ou mobile demonstrativa.
9. Se necessario, alternar o fallback para provar resiliencia da demo.
10. Se necessario, testar o estado de acesso restrito para demonstrar privacidade.

## 4. Criterios de aceite da demo

- [ ] O login demonstrativo abre o fluxo principal sem ambiguidade.
- [ ] O cadastro de area valida dados minimos e rejeita entradas invalidas.
- [ ] O mapa exibe area, raio e focos coerentes com o contexto espacial.
- [ ] O calculo de risco apresenta score, nivel, severidade e fatores.
- [ ] O alerta preventivo mostra resumo, causas e recomendacoes.
- [ ] O dashboard destaca areas prioritarias, alertas ativos e estado vazio quando aplicavel.
- [ ] A notificacao in-app reflete a urgencia do alerta sem sair do escopo demonstrativo.
- [ ] O fluxo segue operante quando a fonte externa simulada falha.
- [ ] O material de apresentacao nao sugere que a demo e operacao produtiva.

## 5. Checklist de handoff

- [ ] Compartilhar os links para `README.md`, `docs/mvp-operational-guide.md` e `docs/mvp-release-checklist.md`.
- [ ] Informar os comandos usados na validacao local.
- [ ] Registrar as limitacoes conhecidas do MVP demonstrativo.
- [ ] Registrar as pendencias que ficam para as proximas fases.
- [ ] Confirmar que a task final de aceite e rastreabilidade pode ser executada com base no material atual.

