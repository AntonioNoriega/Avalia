# Evidencias de control de versiones — Práctica 1.2

**Proyecto:** Avalia · **Autor:** Antonio Noriega (@AntonioNoriega)
**Repositorio remoto:** https://github.com/AntonioNoriega/avalia
**Sprint:** 1

---

## 1. Instalación de Git
Para instalar Git en el entorno de Windows, se utilizó el gestor de paquetes oficial de Windows (`winget`) mediante el siguiente comando en la terminal de administración:
```powershell
winget install --id Git.Git -e --source winget
```
*Nota:* Tras completar la instalación, se reinició la terminal para cargar las nuevas variables de entorno en el `PATH` del sistema.

---

## 2. Identidad de Git configurada
Se configuró la identidad global del autor del proyecto mediante los siguientes comandos:
```bash
git config --global user.name "Antonio Noriega"
git config --global user.email "202304034@utacapulco.edu.mx"
```

### Verificación de Configuración:
```bash
git config user.name
# Salida: Antonio Noriega

git config user.email
# Salida: 202304034@utacapulco.edu.mx
```

---

## 3. Comandos de Inicialización y Flujo de Trabajo (Sprint 1)

A continuación se detallan los comandos paso a paso ejecutados en la terminal para cumplir con el flujo de trabajo Scrum del Sprint 1:

### A. Scrum Master: Inicializar el repositorio y estructura base
```bash
# Inicialización local del repositorio
git init

# Crear archivos de estructura base y agregarlos al staging area
git add README.md GETTING_STARTED.md .gitignore docs/ backend/ frontend/

# Primer commit de la estructura del proyecto
git commit -m "chore: inicializa estructura del proyecto Avalia (.gitignore, README, scaffold)"

# Vincular con el repositorio remoto de GitHub
git remote add origin https://github.com/AntonioNoriega/avalia.git
git branch -M master
git push -u origin master
```

### B. Development Team: Sprint Planning y desarrollo en ramas secundarias
Para la **HU-1.1 (Gestión de Usuarios y Roles)**:
```bash
# Crear y cambiarse a la rama secundaria de desarrollo
git checkout -b feature/HU-1.1-gestion-usuarios

# Desarrollar el código de auth y middleware JWT...
# Registrar archivos modificados y realizar commits locales con la convención pactada
git add backend/src/middleware/auth.js backend/src/middleware/rbac.js
git commit -m "feat(auth): esquema de usuarios y middleware de autenticacion JWT"

# Desarrollar endpoints y controladores del perfil...
git add backend/src/modules/auth/auth.controller.js
git commit -m "feat(auth): endpoints de login y perfil (controller + service)"

# Enviar la rama secundaria a GitHub para solicitar la fusión (Pull Request)
git push -u origin feature/HU-1.1-gestion-usuarios
```

Para la **HU-2.1 (Registro de Inmuebles)**:
```bash
# Volver a master y crear la nueva rama para la segunda HU
git checkout master
git checkout -b feature/HU-2.1-registrar-inmueble

# Desarrollar rutas y controladores de inmuebles del cliente...
git add backend/src/modules/inmuebles/
git commit -m "feat(inmuebles): rutas y controlador para registrar inmuebles del cliente"

# Subir rama secundaria a GitHub
git push -u origin feature/HU-2.1-registrar-inmueble
```

### C. Scrum Master: Autorización y fusión de ramas secundarias
El Scrum Master revisa las solicitudes de integración y realiza la fusión en la rama principal `master` usando la bandera `--no-ff` (no fast-forward) para conservar el grafo de ramas histórico:

Fusión de la primera rama secundaria:
```bash
git checkout master
git merge --no-ff feature/HU-1.1-gestion-usuarios -m "merge: integra feature/HU-1.1-gestion-usuarios a master (autorizado por Scrum Master)"
```

Fusión de la segunda rama secundaria:
```bash
git checkout master
git merge --no-ff feature/HU-2.1-registrar-inmueble -m "merge: integra feature/HU-2.1-registrar-inmueble a master (autorizado por Scrum Master)"
```

Subir los cambios finales integrados a la rama principal de GitHub:
```bash
git push origin master
```

---

## 4. Ramas del proyecto
```
  feature/HU-1.1-gestion-usuarios
  feature/HU-2.1-registrar-inmueble
* master
```

---

## 5. Historial completo (grafo)
```
*   bc97e87 merge: integra feature/HU-2.1-registrar-inmueble a master (autorizado por Scrum Master)
|\  
| * c1b0365 feat(inmuebles): rutas y controlador para registrar inmuebles del cliente
|/  
*   f2d7080 merge: integra feature/HU-1.1-gestion-usuarios a master (autorizado por Scrum Master)
|\  
| * 8ca4c26 feat(auth): endpoints de login y perfil (controller + service)
| * 91812f4 feat(auth): esquema de usuarios y middleware de autenticacion JWT
|/  
* dc510bb chore: inicializa estructura del proyecto Avalia (.gitignore, README, scaffold)
```

---

## 6. Detalle de commits en master
```
bc97e87  2026-05-28  Antonio Noriega  merge: integra feature/HU-2.1-registrar-inmueble a master (autorizado por Scrum Master)
c1b0365  2026-05-27  Antonio Noriega  feat(inmuebles): rutas y controlador para registrar inmuebles del cliente
f2d7080  2026-05-22  Antonio Noriega  merge: integra feature/HU-1.1-gestion-usuarios a master (autorizado por Scrum Master)
8ca4c26  2026-05-21  Antonio Noriega  feat(auth): endpoints de login y perfil (controller + service)
91812f4  2026-05-20  Antonio Noriega  feat(auth): esquema de usuarios y middleware de autenticacion JWT
dc510bb  2026-05-05  Antonio Noriega  chore: inicializa estructura del proyecto Avalia (.gitignore, README, scaffold)
```

