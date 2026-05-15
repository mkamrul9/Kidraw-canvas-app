# Last Commit Summary

Commit: 43f5b14ce997358fbaed8768c439c992fc82fa3f
Date: 2026-05-12
Message: fix: downgrade prisma to prisma 5

## Overview
- Downgraded Prisma tooling and client to the v5.22.x line.
- Switched database dependencies to Postgres support and cleaned lockfile entries.
- Updated Prisma config, schema, and client initialization to match the v5 setup.

## Files Changed
- package.json
- package-lock.json
- prisma.config.ts
- prisma/schema.prisma
- src/lib/prisma.ts

## Notable Changes
- Dependencies: set `prisma` and `@prisma/client` to ^5.22.0, added `@prisma/adapter-pg` and `pg`.
- Prisma config: refreshed generated config file and kept schema/migrations paths and `DATABASE_URL` datasource.
- Schema: set provider to `postgresql`, use binary engine, and keep auth models with a user-owned `Board` model and JSON layers.
- Prisma client: initialize `PrismaClient` with logging and a global singleton pattern for dev.
