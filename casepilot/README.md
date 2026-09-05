# CasePilot – AI-Powered Cybercrime Portal

CasePilot is a full-stack, AI-assisted cybercrime reporting and case management platform built with Next.js 16 (App Router), NestJS, PostgreSQL 16, Prisma ORM, Redis 7, and BullMQ.

---

## True Repo Root
```
C:\Users\anuro\OneDrive\Desktop\Projects\CyberCrime\casepilot
```
> **Note**: Always run all commands from inside `casepilot/`, not the parent folder.

---

## Architecture & Ports

| Service | Technology | Port / Connection |
| :--- | :--- | :--- |
| **Web Frontend** | Next.js 16 (App Router, Turbopack) | `http://localhost:5000` |
| **Backend API** | NestJS 12, Express, Passport JWT | `http://localhost:4000/api` |
| **Database** | PostgreSQL 16 (Docker) | `localhost:5432` (`casepilot`) |
| **Queue / Cache** | Redis 7 (Docker) | `localhost:6379` |
| **ORM** | Prisma (12-model relational schema) | `prisma/schema.prisma` |

---

## Setup & Running Guide

### 1. Start Database & Redis (Docker)
Ensure Docker Desktop is running, then start the containers:
```bash
docker compose up -d
```
Verify containers:
```bash
docker ps --filter "name=casepilot"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database & Seed
Run database migrations and seed realistic cases:
```bash
npm run db:migrate
npm run db:seed
```
*(Or use `npx prisma db seed` directly)*

### 4. Start Development Servers
Start both the NestJS API (port 4000) and Next.js Web Frontend (port 5000) concurrently:
```bash
npm run dev
```

Or start them individually:
```bash
# Terminal 1: API (port 4000)
npm run dev:api

# Terminal 2: Web (port 5000)
npm run dev:web
```

---

## Demo Credentials

- **URL**: [http://localhost:5000](http://localhost:5000)
- **Mobile Number**: `9989284448`
- **OTP**: `123456`

---

## Verification & Features

- **Overview Dashboard**: View real-time statistics (total cases, amounts lost, status breakdowns)
- **10 Seeded Cases**: Real-world cybercrime scenarios (UPI fraud, investment scam, account compromise, ransomware, sextortion, etc.)
- **New Complaint AI Intake**: 3-panel reactive interface (dynamic form, real-time extracted fields, confidence badges, AI chat assistant)
- **Track Your Case**: Search by case number (e.g., `CP2024000001`) with case health score and AI assistant Q&A
- **Evidence Management**: Secure upload and metadata tracking
- **Escalation Pipeline**: Case health assessment and stuck case escalations
