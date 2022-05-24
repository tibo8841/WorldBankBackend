# World Bank Dashboard - Backend 🥐

This package was created for World Bank for users to refine searches of development indicators for countries around the world, where they can choose to compare an indicator between two countries for a specific year or a year range, or for one country, an indicator for a year range (or all indicators if not specified). Users will then be able to view their history of searches and re-render the results if desired.

The backend server uses the Abc framework via Deno and the PostgreSQL driver was used for database management and deployment.

## Database source

The initial database was taken from the World Bank website (https://www.kaggle.com/datasets/kaggle/world-development-indicators).

## Software installation

```
brew install deno

import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
```
