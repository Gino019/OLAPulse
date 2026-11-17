# Guía de entrega de OLAPulse (sin AWS)

Esta guía corresponde al enunciado: **repositorio público, despliegue automatizado, servicio cloud público, artículo individual en inglés, video público de menos de 5 minutos, envío a Telegram y ZIP de enlaces**.

## PASO 1. Probar el proyecto en tu computadora

1. Instala **Node.js 22** desde https://nodejs.org/.
2. Abre la carpeta `OLAPulse` en VS Code.
3. Abre **Terminal → New Terminal** y ejecuta:

```powershell
npm install
npm test
npm run dev
```

4. Abre la dirección de Vite (normalmente `http://localhost:5173`).
5. Comprueba que aparece **DuckDB engine ready**, KPIs, gráficos y tabla. La primera carga necesita internet para descargar DuckDB-Wasm.
6. Cambia el filtro Year (2023, 2024 y 2025), Region, Category y Sales channel. Haz clic en las cinco operaciones OLAP y revisa sus consultas SQL.

**Si no carga DuckDB:** revisa acceso a `cdn.jsdelivr.net`, pestaña F12 → Console y vuelve a cargar. No abras el HTML directamente desde archivos `file://`; usa Vite o el despliegue HTTP.

## PASO 2. Crear repositorio público y subir commits

1. En GitHub, crea un repositorio **público** llamado exactamente `OLAPulse`.
2. Si usas el ZIP con historial Git, extráelo con sus carpetas ocultas `.git`.
3. En la terminal situada dentro de OLAPulse ejecuta lo siguiente, sustituyendo `TU_USUARIO`:

```powershell
git log --oneline -5
git remote add origin https://github.com/TU_USUARIO/OLAPulse.git
git branch -M main
git push -u origin main
```

Si descargaste el ZIP sin `.git`, primero crea el repositorio local y sus commits:

```powershell
git init
git add .
git commit -m "feat: add DuckDB-Wasm OLAP dashboard"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/OLAPulse.git
git push -u origin main
```

**No subas tokens, claves o credenciales.** Para iniciar sesión, usa Git Credential Manager o GitHub Desktop, no pongas el token dentro de una URL compartida.

**Captura 1:** pestaña **Code**, donde se vea el nombre, el repositorio público y los archivos.

**Captura 2:** pestaña **Commits**, donde se vea el historial pertinente.

## PASO 3. Activar el despliegue automatizado en GitHub Pages

1. Abre el repositorio `OLAPulse`.
2. Ve a **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**.
3. Ve a **Actions** y busca **CI and Deploy (GitHub Pages)**.
4. Si el workflow no se ejecutó automáticamente, abre el workflow y pulsa **Run workflow** sobre la rama `main`.
5. Revisa que las etapas `build-test` y `deploy` figuren en verde.
6. Abre la dirección indicada por GitHub Pages, normalmente:
   `https://TU_USUARIO.github.io/OLAPulse/`
7. Prueba la dirección en una ventana de incógnito y vuelve a verificar el dashboard y las operaciones OLAP.

**Captura 3:** la ejecución completada con ambas etapas en verde.

**Captura 4:** dashboard publicado mostrando la URL, las tarjetas KPI y los gráficos.

Si usas un nombre de repositorio distinto, modifica `vite.config.js` para ajustar el atributo `base`.

## PASO 4. Publicar el artículo en Medium, completamente en inglés

1. Entra en https://medium.com/ y elige **Write a story**.
2. Usa el título y subtítulo de `docs/MEDIUM_ARTICLE.md`.
3. Copia el contenido inglés del archivo, desde **Introduction** hasta **References** (elimina el checklist final).
4. Inserta estas imágenes del directorio `docs/assets/`:
   - `article-cover.png` como portada, inmediatamente después del título/resumen.
   - `architecture.png` en **4. Solution Architecture**.
   - `olap-operations.png` en **8. Demonstrating the Five OLAP Operations**.
5. Añade **tres capturas reales**: dashboard (sección 7), explorador SQL mostrando ROLLUP (sección 8) y workflow GitHub Actions correcto (sección 9).
6. Añade los fragmentos SQL y JavaScript usando la opción de bloque de código de Medium para facilitar la lectura. Si el pegado de Markdown no conserva el resaltado, pega los fragmentos por separado.
7. Busca `YOUR_USERNAME` y reemplaza todos sus usos con tu nombre de usuario real de GitHub. Reemplaza la URL de demostración con la que verificaste en incógnito.
8. En la conclusión incluye enlaces **clicables** al repositorio y al despliegue.
9. En Publish, agrega hasta cinco temas: `OLAP`, `DuckDB`, `SQL`, `Business Intelligence`, `GitHub Actions`.
10. Publica para acceso público. Copia la URL real del artículo (el enlace con `/@.../titulo...`).

**Captura 5:** inicio del artículo donde se vea el título, la portada y el autor.

> Importante: Medium no convierte automáticamente rutas relativas a imágenes de un archivo Markdown local. Debes subir los PNG como imágenes de la publicación.

## PASO 5. Grabar y publicar el video

1. Lee `docs/VIDEO_SCRIPT_ES.md` o `docs/VIDEO_SCRIPT_EN.md`.
2. Abre en este orden: repositorio GitHub → diagrama de arquitectura → dashboard público → cinco operaciones OLAP → GitHub Actions → artículo Medium.
3. Graba con OBS Studio o tu grabador de pantalla favorito (ideal 1080p, 16:9).
4. Muestra el SQL de al menos una operación ejecutándose y sus resultados.
5. Finaliza en aproximadamente **4:10**; confirma duración **inferior a 5:00**.
6. Publica en YouTube como **Público**. Añade el enlace del repositorio y del artículo a la descripción.
7. Copia la URL pública del video y comprueba en incógnito que sea accesible.

**Captura 6:** video subido en YouTube, título y duración visibles.

## PASO 6. Telegram y entrega ZIP

Una vez publicadas las URL reales, sustituye los marcadores del archivo `submission/links_template.txt`.

```text
PROJECT: OLAPulse — Interactive Sales Intelligence
PUBLIC_GITHUB_REPOSITORY: https://github.com/TU_USUARIO/OLAPulse
PUBLIC_LIVE_APPLICATION: https://TU_USUARIO.github.io/OLAPulse/
PUBLIC_MEDIUM_ARTICLE: https://medium.com/@TU_CUENTA/TU_ARTICULO
PUBLIC_VIDEO: https://www.youtube.com/watch?v=TU_VIDEO
```

Luego puedes generar el ZIP de entrega con:

```powershell
python scripts/make_submission.py
```

El script valida que no queden marcadores pendientes y crea `submission/OLAPulse_submission_links.zip` con las cuatro URL. **No entregues el ZIP de plantilla con placeholders.**

Envía **artículo y video** al grupo Telegram, como pide el enunciado. Mensaje sugerido:

> Hello! I am sharing my OLAP project, OLAPulse — an Interactive Sales Intelligence dashboard built with DuckDB-Wasm.\n\nMedium article: [URL REAL]\nVideo demonstration (under five minutes): [URL REAL]\nGitHub repository: [URL REAL]\nLive application: [URL REAL]

Finalmente, adjunta `submission/OLAPulse_submission_links.zip` a la plataforma de tareas.

## Evidencias finales que debes conservar

- Nombre visible de repositorio público y commits.
- Workflow GitHub Actions completado.
- Dashboard funcionando con motor DuckDB y filtros.
- Consulta SQL OLAP y tabla de resultados.
- Medium publicado con imágenes y enlaces.
- YouTube público con duración menor a cinco minutos.
- Mensaje en Telegram con ambos enlaces.
- ZIP de enlaces reales.

No afirmes que algo está publicado o desplegado hasta verificar su URL real en incógnito.
