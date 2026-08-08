# Architecture

## Phase 2: ClickHouse Integration

### Why ClickHouse?
ClickHouse was chosen as the required partner technology for its exceptional performance on analytical queries over large datasets (OLAP). In a production studio environment, analyzing thousands of historical budgets, box office returns, and granular scene-level telemetry requires a columnar database capable of high-speed aggregations.

### Database Schema
We implemented a two-table design:
1. `movies`: Contains top-level film metrics (budget, box office, genre, overall VFX intensity).
2. `scenes`: Contains granular production breakdown data (location, indoor/outdoor, prop count).

### Data Access Layer
The ASP.NET Core backend communicates with ClickHouse using the official `ClickHouse.Client` ADO.NET provider.
The `ClickHouseAnalyticsService` implements the `IMovieAnalyticsService` interface, abstracting away SQL queries behind strongly-typed DTOs (e.g., `SceneCostBenchmarkDto`, `BudgetBoxOfficeAnalyticsDto`).

### Data Seeding
Because we need realistic analytical variations, a Node.js script (`data/seed/generate_seed.js`) programmatically generates a SQL script containing 150 synthetic movies and their associated scenes. This is executed automatically when the Docker container initializes.
