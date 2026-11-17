# Guion de video: OLAPulse (aproximadamente 4 minutos y 15 segundos)

**Título sugerido para YouTube:** `OLAPulse | Building an OLAP Sales Analytics Dashboard with DuckDB-Wasm + GitHub Actions`

**Formato recomendado:** grabación de pantalla 16:9, voz en español, interfaz y rótulos técnicos en inglés. Duración máxima exigida: 5:00. Este guion reserva cerca de 40 segundos de margen.

| Tiempo | Lo que muestras en pantalla | Guion para narrar |
|---|---|---|
| 00:00–00:25 | Portada OLAPulse + título del proyecto | "Hola, hoy presentaré OLAPulse, una solución de procesamiento analítico en línea, u OLAP, desarrollada con DuckDB-Wasm, JavaScript y Chart.js. El objetivo es convertir datos de ventas en información útil para tomar decisiones." |
| 00:25–00:55 | Abrir GitHub: README, árbol de archivos, CSV y `src/queries.js` | "Aquí está el repositorio público con todo el código fuente. Tenemos cuatro mil ochocientas transacciones sintéticas, consultas SQL, frontend, pruebas y un flujo de automatización que podemos revisar." |
| 00:55–01:25 | Mostrar `docs/assets/architecture.png`, pasar a la app publicada | "La arquitectura usa un motor DuckDB en WebAssembly que corre dentro del navegador. GitHub almacena el código, GitHub Actions ejecuta las pruebas y la compilación, y GitHub Pages publica la aplicación. No utilizamos AWS." |
| 01:25–02:05 | Sitio en vivo: KPIs, gráfico de tendencia, categorías, regiones, cambiar filtros | "En el panel observamos ingresos, utilidad, número de pedidos y margen de ganancia. Podemos filtrar por año, región, categoría y canal. Cada cambio vuelve a ejecutar consultas SQL y actualiza los gráficos." |
| 02:05–03:05 | OLAP Explorer: pulsar Slice, Dice, Drill-down, Roll-up y Pivot; ejecutar Roll-up | "El módulo central demuestra cinco operaciones OLAP. Slice analiza una categoría, Dice restringe varias dimensiones, Drill-down muestra los productos de una categoría, Roll-up calcula subtotales y Pivot cambia la distribución de las columnas. En cada caso vemos y ejecutamos el SQL real." |
| 03:05–03:38 | Copiar SQL y exportar CSV; luego GitHub Actions con ejecución exitosa | "También podemos copiar una consulta y descargar sus resultados. Para demostrar el despliegue automatizado, vemos el historial de GitHub Actions, donde las pruebas, la construcción y la publicación se ejecutan mediante el workflow." |
| 03:38–04:10 | Abre artículo Medium y muestra repo y enlace al sitio | "Finalmente, publiqué un artículo técnico en Medium en inglés, donde explico el objetivo, la arquitectura, las consultas SQL y el despliegue. Los enlaces del artículo, el video y el repositorio quedan disponibles para revisar el trabajo. Gracias." |

## Grabación y evidencia

1. Abre el sitio público en incógnito y verifica que muestra el estado `DuckDB engine ready`.
2. Prepara dos pestañas: GitHub y dashboard. También el artículo de Medium si ya está público.
3. Graba pantalla y micrófono (OBS Studio, Xbox Game Bar o similar). Usa 1920×1080 si es posible.
4. Durante la demostración, muestra **al menos una consulta SQL y sus resultados**.
5. No muestres contraseñas, tokens ni información personal de la cuenta.
6. Exporta a MP4, revisa que dure menos de cinco minutos y publica como **Público** en YouTube (no Privado ni Oculto si exigen que sea público).
7. Copia la URL del video en `submission/links_template.txt` y en el artículo Medium.

## Texto de descripción de YouTube (puede pegarse tal cual después de reemplazar enlaces)

> OLAPulse is a browser-based OLAP sales analytics application built with DuckDB-Wasm, JavaScript, Chart.js, and Vite. It demonstrates Slice, Dice, Drill-down, Roll-up, and Pivot through SQL, plus automated deployment using GitHub Actions and GitHub Pages. No AWS services are used.\n\nRepository: https://github.com/YOUR_USERNAME/OLAPulse\nLive demo: https://YOUR_USERNAME.github.io/OLAPulse/\nMedium article: [ADD LINK]\n\n#OLAP #DuckDB #SQL #BusinessIntelligence #GitHubActions
