# Prisma

This directory contains Prisma schema and migrations for the database layer.

## Schema

The `schema.prisma` file defines the database schema and is the source of truth for the database structure.

## Migrations

Database migrations are stored in the `migrations/` directory.

### Running Migrations

```bash
# Create and run a new migration
npm run prisma:migrate

# Generate Prisma Client (usually done automatically)
npm run prisma:generate

# Open Prisma Studio (UI for database management)
npm run prisma:studio
```

## Database Setup

1. Configure `DATABASE_URL` in `.env` file (PostgreSQL, MySQL, or SQLite)
2. Run `npm run prisma:migrate` to create tables
3. Start developing!
