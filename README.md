# Avalia — Sistema de Valuación Automatizada de Inmuebles

AVM (Automated Valuation Model) para inmuebles con chatbot. A partir de las
características de una propiedad y datos de mercado comparables, calcula un valor
estimado, un rango y un nivel de confianza, justificado con los comparables usados.

**Stack:** Node.js + Express (ESM) · PostgreSQL (Supabase) · React + Vite + TailwindCSS.

> Documento de planeación completo en [`docs/PLANEACION_SISTEMA_VALUACION.md`](docs/PLANEACION_SISTEMA_VALUACION.md).

## Estructura

```
backend/src/
  config/      middleware/      jobs/
  modules/  auth · inmuebles · mercado · valuacion · chatbot · reportes · dashboard
frontend/src/
  pages/  services/  components/{layout,ui}
docs/
```

## Autor

Proyecto individual desarrollado por **Antonio Noriega** ([@AntonioNoriega](https://github.com/AntonioNoriega)).
Los roles Scrum (Product Owner, Scrum Master, Development Team) los asume el mismo autor para fines de la práctica.

## Flujo de trabajo con Git (Práctica 1.2)

1. El **Scrum Master** crea el repositorio y lo comparte en GitHub.
2. Cada integrante del **Development Team** clona el repo y trabaja en una **rama secundaria**:
   ```bash
   git clone <url-del-repo>
   git checkout -b feature/HU-1.1-gestion-usuarios
   # ...trabajar...
   git add -A && git commit -m "feat(auth): scaffold módulo auth"
   git push -u origin feature/HU-1.1-gestion-usuarios
   ```
3. El integrante **pide autorización** para fusionar (Pull Request).
4. El **Scrum Master autoriza y fusiona** la rama secundaria a `master`:
   ```bash
   git checkout master
   git merge --no-ff feature/HU-1.1-gestion-usuarios
   git push origin master
   ```

### Convenciones
- Ramas: `feature/HU-<id>-<slug>`, `fix/...`, `docs/...`
- Commits: `tipo(scope): mensaje` (ej. `feat(valuacion): cálculo de estimado`)

### Compartir en GitHub (Scrum Master)
```bash
git remote add origin https://github.com/AntonioNoriega/avalia.git
git branch -M master
git push -u origin master
```

### Gotcha Windows / Git Bash
Si `git commit` falla por locks:
```bash
rm -f .git/HEAD.lock .git/index.lock
git add -A && git commit -m "mensaje"
```
