# Convenções de Idioma

Este repositório segue uma regra única de idioma para manter a documentação consistente e o código previsível.

## Regra Principal

- Documentação deve ser escrita em `pt-BR`.
- Código deve permanecer em `en-US`.

## O Que Entra Em Cada Categoria

### Documentação em `pt-BR`

- `README.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `docs/*.md`
- `tasks/*.md`
- `ralph/*.md`
- mensagens de apoio em `ralph/*.sh`

### Conteúdo Técnico em `en-US`

- Identificadores de código, como nomes de classes, funções, variáveis e módulos
- Contratos, tipos, enums e nomes de campos
- Comandos, trechos de terminal e exemplos de configuração
- JSON, payloads e exemplos de API
- Nomes de arquivos técnicos e diretórios
- Mensagens embutidas no código que façam parte da interface técnica
- Saídas textuais de apoio em scripts operacionais devem seguir `pt-BR`, mantendo comandos e nomes técnicos em `en-US`

## Regras Práticas

- Não traduza nomes técnicos que já fazem parte da API ou do código.
- Não misture explicação em inglês dentro de documentação nova, exceto quando for necessário para preservar um termo técnico.
- Se houver conflito entre um texto em português e um artefato técnico em inglês, o artefato técnico prevalece.

## Fonte De Verdade

Esta regra deve ser aplicada junto com `AGENTS.md` e com as convenções de git definidas em `docs/git-conventions.md`.
