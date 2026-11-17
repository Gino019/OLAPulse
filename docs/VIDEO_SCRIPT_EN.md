# OLAPulse video walkthrough — English narration (around 4 minutes)

**00:00–00:25 — Introduction**

"Welcome! Today I will demonstrate OLAPulse, an Online Analytical Processing solution built with DuckDB-Wasm, JavaScript, Chart.js, and Vite. Its purpose is to turn retail transactions into actionable business insights."

**00:25–00:55 — Public repository**

"Here is the public GitHub repository. It contains the full application, a reproducible synthetic dataset with 4,800 transactions, SQL query builders, tests, documentation, and an automated deployment workflow."

**00:55–01:25 — Architecture**

"Instead of using an external database server, DuckDB-Wasm processes the sales data inside the browser. GitHub Actions runs our tests and production build, and GitHub Pages publishes the website. No AWS services are required."

**01:25–02:05 — Dashboard demonstration**

"The dashboard displays four key metrics: revenue, profit, total orders, and profit margin. Charts summarize monthly revenue, product categories, regional sales, and top products. I can also filter the data by year, region, category, and channel."

**02:05–03:05 — OLAP operations**

"The OLAP Explorer demonstrates five operations. Slice selects one category; Dice combines multiple conditions; Drill-down moves from category to product; Roll-up calculates hierarchical subtotals; and Pivot turns sales channels into separate columns. The generated SQL is visible, and the query results appear immediately below it."

**03:05–03:40 — Export and automation**

"Users can copy SQL and export results as a CSV file. Now I will open GitHub Actions, where the workflow automatically tests, builds, and deploys the site after a commit is pushed to the main branch."

**03:40–04:10 — Closing**

"I also published an English technical article on Medium describing the objective, technology stack, architecture, SQL operations, and deployment. You can find the complete source code and the live website through the provided links. Thank you for watching!"

**Important:** Only describe a deployment or article as published after verifying its real public URL. Keep the full video shorter than five minutes.
