# Git Conventions

This repository follows a simple git convention set that should be applied by default.

## Branch Names

- Use a prefix that matches the work type.
- Default prefix for feature work: `feat/`
- Other allowed prefixes: `fix/`, `docs/`, `test/`, `chore/`
- Keep the suffix short, lowercase, and kebab-case.

Examples:

- `feat/git-conventions`
- `fix/alert-message`
- `docs/api-contracts`

## Commit Messages

- Use a single-line subject only.
- Do not add a body, paragraph breaks, bullet lists, or extra commentary.
- Prefer Conventional Commits formatting.
- Do not use empty scope parentheses like `feat()`: use `feat(scope): ...` when a scope exists, or `feat: ...` when it does not.
- Keep the subject concise and focused on the change.

Examples:

- `feat(git): add branch naming rule`
- `docs(git): define commit format`
- `chore(ci): simplify validation step`

## Practical Rule

If a commit message or branch name would be hard to scan in a quick history view, shorten it.
