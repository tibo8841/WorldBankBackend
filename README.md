# World Bank Dashboard - Backend 🥐

This package was created for World Bank for users to refine searches of development indicators for countries around the world, where they can choose to compare an indicator between two countries for a specific year or a year range, or for one country, an indicator for a year range (or all indicators if not specified). Users will then be able to view their history of searches and re-render the results if desired.

The backend server uses the Abc framework via Deno and the PostgreSQL driver was used for database management and deployment.

## Software installation

```
brew install deno

import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
```

## Database information

### Database source

The initial database was taken from the [World Bank](https://www.kaggle.com/datasets/kaggle/world-development-indicators) website.

### Tables within the database

Alongside the tables extracted from the World Bank database, the additional data will be separated into three tables for efficient categorisation:

1. Users, which will record user information for logging in
2. Search history, containing the conditions for which the users searched within
3. Sessions, so the user is not logged out immediately after closing the browser but instead after a certain time-frame.

## Linking backend and frontend
