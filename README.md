# Reporting Workflow

A workflow manager for court reporting agencies — track transcription jobs, assign reporters and editors, and calculate payments.

## Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 4, shadcn/ui, Lucide
- **Backend**: Express, TypeScript, Zod
- **Database**: PostgreSQL via Prisma 7

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL

### Setup

```bash
git clone git@github.com:adeharseno/court-reporting-workflow-system.git
cd court-reporting-workflow-system
npm install
```

Create a `.env` file at the root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reporting-workflow"
```

Push the schema and seed:

```bash
npx prisma db push
npm run db:seed
```

### Development

```bash
npm run dev:server   # API on http://localhost:3001
npm run dev:client   # Dashboard on http://localhost:5173
```

## Project structure

```
├── prisma/          # Schema + seed
├── server/          # Express API
│   └── src/
│       ├── routes/
│       ├── services/
│       └── middleware/
├── client/          # React SPA
│   └── src/
│       ├── components/
│       └── api.ts
└── docs/            # Design docs
```

## API

Base: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/reporters` | List or create reporters |
| GET | `/reporters/:id` | Get a reporter |
| GET/POST | `/editors` | List or create editors |
| GET | `/editors/:id` | Get an editor |
| GET/POST | `/jobs` | List or create jobs |
| GET | `/jobs/:id` | Get a job |
| GET | `/jobs/stats` | Job counts and revenue |
| POST | `/jobs/:id/assign-reporter` | Assign a reporter |
| POST | `/jobs/:id/assign-editor` | Assign an editor |
| PATCH | `/jobs/:id/status` | Update job status |
| GET | `/jobs/:id/payment` | Calculate payment |

## Workflow

```
NEW → ASSIGNED → TRANSCRIBED → REVIEWED → COMPLETED
```

Physical jobs require a reporter in the same location. Remote jobs can go to any available reporter.
